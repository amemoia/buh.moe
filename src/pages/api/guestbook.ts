import type { APIRoute } from 'astro';
import { db, Guestbook } from 'astro:db';

export const prerender = false;

export const POST: APIRoute = async ({ request, env }: any) => {
    try {
        const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
        let name = '';
        let message = '';
        let token = '';
        const getEnv = (k: string) => {
            try {
                if (env && typeof env[k] !== 'undefined') return env[k];
            } catch (e) {}
            try {
                if (typeof process !== 'undefined' && (process as any).env && (process as any).env[k]) return (process as any).env[k];
            } catch (e) {}
            try {
                // fallback to globalThis if set
                // @ts-ignore
                if (typeof globalThis !== 'undefined' && (globalThis as any)[k]) return (globalThis as any)[k];
            } catch (e) {}
            return undefined;
        };
        
        if (contentType.includes('application/json')) {
            const json = await request.json();
            name = (json.name ?? '').toString().trim();
            message = (json.message ?? '').toString().trim();
            token = (json['cf-turnstile-response'] ?? json.token ?? '').toString();
        } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            name = (formData.get('name')?.toString().trim() ?? '');
            message = (formData.get('message')?.toString().trim() ?? '');
            token = (formData.get('cf-turnstile-response')?.toString() ?? '');
        } else {
            try {
                const formData = await request.formData();
                name = (formData.get('name')?.toString().trim() ?? '');
                message = (formData.get('message')?.toString().trim() ?? '');
                token = (formData.get('cf-turnstile-response')?.toString() ?? '');
            } catch (e) {
                const txt = await request.text();
                const params = new URLSearchParams(txt);
                name = (params.get('name') ?? '').toString().trim();
                message = (params.get('message') ?? '').toString().trim();
                token = (params.get('cf-turnstile-response') ?? '').toString();
            }
        }
        
        if (!name || !message) {
            return new Response(null, { status: 303, headers: { Location: '/guestbook?status=error' } });
        }
        const MAX_MESSAGE = 300;
        if (message.length > MAX_MESSAGE) {
            return new Response(null, { status: 303, headers: { Location: '/guestbook?status=toolong' } });
        }
        
        async function processTurnstile(cf_turnstile_response: string) {
            const secret = getEnv('TURNSTILE_SITE_SECRET');
            if (!secret) return { success: false, errorCodes: ['missing-site-secret'] };
            
            const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
            const requestBody = new URLSearchParams({ secret, response: cf_turnstile_response });
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: requestBody.toString(),
            });
            
            const data = await response.json();
            return { success: Boolean(data.success), errorCodes: data['error-codes'] ?? [] };
        }
        
        if (!token) {
            return new Response(null, { status: 303, headers: { Location: '/guestbook?status=turnstile' } });
        }
        
        const hostHeader = request.headers.get('host') ?? '';
        const isLocal = hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1') || hostHeader.includes('::1');
        if (isLocal) {
            console.info('Skipping turnstile verification');
        } else {
            const turnstileResult = await processTurnstile(token);
            if (!turnstileResult.success) {
                console.warn('Turnstile verification failed', turnstileResult.errorCodes);
                const codes = turnstileResult.errorCodes || [];
                if (codes.includes('invalid-or-unknown-site-key') || codes.includes('invalid-site-secret') || codes.includes('missing-site-secret')) {
                    return new Response(null, { status: 303, headers: { Location: '/guestbook?status=turnstile_invalid_domain' } });
                }
                return new Response(null, { status: 303, headers: { Location: '/guestbook?status=turnstile' } });
            }
        }
        
        await db.insert(Guestbook).values({ name, message });

        let webhookFailed = false;
        try {
            const webhookUrl = (getEnv('DISCORD_WEBHOOK_GUESTBOOK') ?? '').toString().trim();
            if (webhookUrl) {
                const embedDescription = message.length > 3900 ? message.slice(0, 3900) + '…' : message;
                const mentionUserId = (getEnv('DISCORD_UID') ?? '')?.toString().trim();
                const mentionContent = mentionUserId ? `<@${mentionUserId}>` : undefined;

                const payload: any = {
                    username: 'guestbook',
                    embeds: [
                        {
                            title: `${name}`,
                            description: embedDescription,
                            timestamp: new Date().toISOString(),
                            color: 0xdc3545
                        }
                    ]
                };

                if (mentionContent) payload.content = mentionContent;
                if (mentionUserId) payload.allowed_mentions = { users: [mentionUserId] };

                // Send webhook with a short timeout and limited retry to avoid blocking the request
                const sendWebhook = async (url: string, bodyPayload: any, maxRetries = 1) => {
                    let attempt = 0;
                    const baseTimeout = 2000; // ms per attempt
                    const maxWaitMs = 5000; // cap server-suggested waits

                    while (attempt <= maxRetries) {
                        attempt++;
                        const ac = new AbortController();
                        const timeout = setTimeout(() => ac.abort(), baseTimeout);
                        try {
                            const res = await fetch(url, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(bodyPayload),
                                signal: ac.signal,
                            });
                            clearTimeout(timeout);

                            if (res.ok) return res;

                            if (res.status === 429) {
                                // Prefer JSON retry_after (Discord returns a json body on 429)
                                let retryAfterMs: number | undefined;
                                try {
                                    const j = await res.json().catch(() => null);
                                    if (j && typeof j.retry_after !== 'undefined') {
                                        const val = Number(j.retry_after);
                                        if (Number.isFinite(val)) retryAfterMs = val > 1000 ? Math.ceil(val) : Math.ceil(val * 1000);
                                    }
                                } catch (e) {}

                                if (!retryAfterMs) {
                                    const header = res.headers.get('retry-after') ?? res.headers.get('Retry-After');
                                    const num = header ? Number(header) : NaN;
                                    if (Number.isFinite(num)) retryAfterMs = num > 1000 ? Math.ceil(num) : Math.ceil(num * 1000);
                                }

                                if (!retryAfterMs) retryAfterMs = 1000;
                                // cap waits so we don't block for too long
                                retryAfterMs = Math.min(retryAfterMs, maxWaitMs);

                                const text = await res.text().catch(() => '<unreadable>');
                                console.warn('Discord webhook 429, attempt', attempt, 'will wait', retryAfterMs, 'ms', 'body:', text, 'headers:', Object.fromEntries(res.headers.entries()));

                                // wait then retry (but keep attempts small)
                                await new Promise((r) => setTimeout(r, retryAfterMs));
                                continue;
                            }

                            const text = await res.text().catch(() => '<unreadable>');
                            console.warn('Discord webhook failed', res.status, text);
                            return res;
                        } catch (e) {
                            clearTimeout(timeout);
                            if ((e as any)?.name === 'AbortError') {
                                console.warn('Discord webhook request aborted due to timeout (attempt', attempt, ')');
                            } else {
                                console.warn('Discord webhook error', e);
                            }
                            // small backoff before retry
                            await new Promise((r) => setTimeout(r, 250 * attempt));
                            continue;
                        }
                    }
                    return null;
                };

                // Fire the webhook but keep retries/timeouts small so the request doesn't hang;
                // the DB insert already happened so the user gets a prompt response.
                let webhookFailed = false;
                try {
                    const webhookRes = await sendWebhook(webhookUrl, payload, 1);
                    if (!webhookRes) {
                        console.warn('Discord webhook could not be sent after retries');
                        webhookFailed = true;
                    } else if (!webhookRes.ok) {
                        const txt = await webhookRes.text().catch(() => '<unreadable>');
                        console.warn('Discord webhook non-ok response', webhookRes.status, txt);
                        webhookFailed = true;
                    }
                } catch (e) {
                    console.warn('Unexpected error sending Discord webhook', e);
                    webhookFailed = true;
                }
            } else {
                console.info('DISCORD_WEBHOOK_GUESTBOOK / DISCORD_WEBHOOK_URL not set — skipping webhook send');
            }
        } catch (e) {
            console.warn('Failed to send Discord webhook for guestbook entry', e);
        }

        // If webhook failed to deliver, let the frontend show an informative message
        if (typeof webhookFailed !== 'undefined' && webhookFailed) {
            return new Response(null, { status: 303, headers: { Location: '/guestbook?status=ok_webhook_failed' } });
        }

        return new Response(null, { status: 303, headers: { Location: '/guestbook?status=ok' } });
    } catch (err) {
        console.error('Guestbook API error', err);
        return new Response(null, { status: 303, headers: { Location: '/guestbook?status=error' } });
    }
};

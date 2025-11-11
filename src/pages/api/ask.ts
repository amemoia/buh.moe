import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, env }: any) => {
    try {
    const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
    let name = '';
    let message = '';

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
        } else {
            try {
                const formData = await request.formData();
                name = (formData.get('name')?.toString().trim() ?? '');
                message = (formData.get('message')?.toString().trim() ?? '');
            } catch (e) {
                const txt = await request.text();
                const params = new URLSearchParams(txt);
                name = (params.get('name') ?? '').toString().trim();
                message = (params.get('message') ?? '').toString().trim();
            }
        }

        if (!name) name = 'anon';

        if (!message) {
            return new Response(null, { status: 303, headers: { Location: '/ask?status=error' } });
        }

        const MAX_MESSAGE = 1000;
        if (message.length > MAX_MESSAGE) {
            return new Response(null, { status: 303, headers: { Location: '/ask?status=toolong' } });
        }

        let webhookFailed = false;
        try {
            const webhookUrl = (getEnv('DISCORD_WEBHOOK_ASKS') ?? '').toString().trim();
            if (webhookUrl) {
                const embedDescription = message.length > 3900 ? message.slice(0, 3900) + '…' : message;
                const mentionUserId = (getEnv('DISCORD_UID') ?? '')?.toString().trim();
                const mentionContent = mentionUserId ? `<@${mentionUserId}>` : undefined;

                const payload: any = {
                    username: 'ask',
                    embeds: [
                        {
                            title: `${name} asks...`,
                            description: embedDescription,
                            timestamp: new Date().toISOString(),
                            color: 0xdc3545
                        }
                    ]
                };

                if (mentionContent) payload.content = mentionContent;
                if (mentionUserId) payload.allowed_mentions = { users: [mentionUserId] };

                // Optional KV-based throttle: prevent repeated sends from same client in short time
                try {
                    const clientIp = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'anon';
                    const throttleKey = `ask_throttle:${clientIp}`;
                    if (env && typeof env.SESSION !== 'undefined' && env.SESSION && typeof env.SESSION.get === 'function') {
                        try {
                            const existing = await env.SESSION.get(throttleKey);
                            if (existing) {
                                console.warn('Throttling ask from', clientIp);
                                return new Response(null, { status: 303, headers: { Location: '/ask?status=error' } });
                            }
                            // set short TTL to rate limit repeated posts from same client
                            await env.SESSION.put(throttleKey, '1', { expirationTtl: 5 });
                        } catch (e) {
                            // KV may not be available in some runtimes; ignore and continue
                            console.warn('KV throttle check failed', e);
                        }
                    }
                } catch (e) {
                    console.warn('Throttle check unexpected error', e);
                }

                // Send webhook with bounded retries/timeouts to avoid hanging the request
                const sendWebhook = async (url: string, bodyPayload: any, maxRetries = 1) => {
                    let attempt = 0;
                    const baseTimeout = 2000;
                    const maxWaitMs = 5000;
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
                                retryAfterMs = Math.min(retryAfterMs, maxWaitMs);
                                const text = await res.text().catch(() => '<unreadable>');
                                console.warn('Ask webhook 429, attempt', attempt, 'wait', retryAfterMs, 'ms', 'body:', text, 'headers:', Object.fromEntries(res.headers.entries()));
                                await new Promise((r) => setTimeout(r, retryAfterMs));
                                continue;
                            }
                            const text = await res.text().catch(() => '<unreadable>');
                            console.warn('Ask webhook failed', res.status, text);
                            return res;
                        } catch (e) {
                            clearTimeout(timeout);
                            if ((e as any)?.name === 'AbortError') {
                                console.warn('Ask webhook aborted due to timeout (attempt', attempt, ')');
                            } else {
                                console.warn('Ask webhook error', e);
                            }
                            await new Promise((r) => setTimeout(r, 250 * attempt));
                            continue;
                        }
                    }
                    return null;
                };

                try {
                    const webhookRes = await sendWebhook(webhookUrl, payload, 1);
                    if (!webhookRes) {
                        console.warn('Ask webhook could not be sent after retries');
                        webhookFailed = true;
                    } else if (!webhookRes.ok) {
                        const txt = await webhookRes.text().catch(() => '<unreadable>');
                        console.warn('Ask webhook non-ok response', webhookRes.status, txt);
                        webhookFailed = true;
                    }
                } catch (e) {
                    console.warn('Unexpected error sending Ask webhook', e);
                    webhookFailed = true;
                }
            } else {
                console.info('DISCORD_WEBHOOK_ASK / DISCORD_WEBHOOK_URL not set — skipping ask webhook send');
            }
        } catch (e) {
            console.warn('Failed to send Ask Discord webhook', e);
        }

        if (typeof webhookFailed !== 'undefined' && webhookFailed) {
            return new Response(null, { status: 303, headers: { Location: '/ask?status=ok_webhook_failed' } });
        }

        return new Response(null, { status: 303, headers: { Location: '/ask?status=ok' } });
    } catch (err) {
        console.error('Ask API error', err);
        return new Response(null, { status: 303, headers: { Location: '/ask?status=error' } });
    }
};

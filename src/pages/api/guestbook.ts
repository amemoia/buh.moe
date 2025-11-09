import type { APIRoute } from 'astro';
import { db, Guestbook } from 'astro:db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
        let name = '';
        let message = '';
        let token = '';
        
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
            const secret = import.meta.env.TURNSTILE_SITE_SECRET ?? import.meta.env.CF_TURNSTILE_SECRET ?? '';
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
        const skipInDev = import.meta.env.TURNSTILE_SKIP_IN_DEV === 'true';
        if (isLocal || skipInDev) {
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

        try {
            const webhookUrl = String(import.meta.env.DISCORD_WEBHOOK_GUESTBOOK ?? import.meta.env.DISCORD_WEBHOOK_URL ?? '').trim();
            if (webhookUrl) {
                const embedDescription = message.length > 3900 ? message.slice(0, 3900) + '…' : message;
                const payload = {
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

                const postWebhook = async () => {
                    return await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                };

                const res1 = await postWebhook();
                if (res1.ok) {
                } else if (res1.status === 429) {
                    const retryAfterHeader = res1.headers.get('retry-after') ?? res1.headers.get('Retry-After');
                    const retryAfterSec = retryAfterHeader ? Number(retryAfterHeader) : NaN;
                    const waitMs = Number.isFinite(retryAfterSec) && retryAfterSec > 0 ? Math.ceil(retryAfterSec * 1000) : 1000;
                    console.warn('Discord webhook rate limited, will retry after', waitMs, 'ms');
                    await new Promise((r) => setTimeout(r, waitMs));
                    try {
                        const res2 = await postWebhook();
                        if (!res2.ok) {
                            const body = await res2.text().catch(() => '<unreadable>');
                            console.warn('Discord webhook retry failed', res2.status, body);
                        }
                    } catch (e) {
                        console.warn('Discord webhook retry error', e);
                    }
                } else {
                    const body = await res1.text().catch(() => '<unreadable>');
                    console.warn('Discord webhook failed', res1.status, body);
                }
            } else {
                console.info('DISCORD_WEBHOOK_GUESTBOOK / DISCORD_WEBHOOK_URL not set — skipping webhook send');
            }
        } catch (e) {
            console.warn('Failed to send Discord webhook for guestbook entry', e);
        }

        return new Response(null, { status: 303, headers: { Location: '/guestbook?status=ok' } });
    } catch (err) {
        console.error('Guestbook API error', err);
        return new Response(null, { status: 303, headers: { Location: '/guestbook?status=error' } });
    }
};

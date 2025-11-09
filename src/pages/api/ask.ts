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

                const postWebhook = async () => {
                    return await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                };

                const res1 = await postWebhook();
                if (!res1.ok) {
                    if (res1.status === 429) {
                        const retryAfterHeader = res1.headers.get('retry-after') ?? res1.headers.get('Retry-After');
                        const retryAfterSec = retryAfterHeader ? Number(retryAfterHeader) : NaN;
                        const waitMs = Number.isFinite(retryAfterSec) && retryAfterSec > 0 ? Math.ceil(retryAfterSec * 1000) : 1000;
                        await new Promise((r) => setTimeout(r, waitMs));
                        try { const res2 = await postWebhook(); if (!res2.ok) { const body = await res2.text().catch(()=>'<unreadable>'); console.warn('Ask webhook retry failed', res2.status, body); } } catch (e) { console.warn('Ask webhook retry error', e); }
                    } else {
                        const body = await res1.text().catch(() => '<unreadable>');
                        console.warn('Ask webhook failed', res1.status, body);
                    }
                }
            } else {
                console.info('DISCORD_WEBHOOK_ASK / DISCORD_WEBHOOK_URL not set — skipping ask webhook send');
            }
        } catch (e) {
            console.warn('Failed to send Ask Discord webhook', e);
        }

        return new Response(null, { status: 303, headers: { Location: '/ask?status=ok' } });
    } catch (err) {
        console.error('Ask API error', err);
        return new Response(null, { status: 303, headers: { Location: '/ask?status=error' } });
    }
};

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
    const contentType = (request.headers.get('content-type') ?? '').toLowerCase();
    let name = '';
    let message = '';

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
            const webhookUrl = import.meta.env.DISCORD_WEBHOOK_ASKS;
            if (webhookUrl) {
                const embedDescription = message.length > 3900 ? message.slice(0, 3900) + '…' : message;
                const payload = {
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

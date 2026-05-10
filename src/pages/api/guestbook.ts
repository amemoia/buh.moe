import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";
import { parseFormOrJson, verifyTurnstile, isLocalRequest, redirect, sendDiscordWebhook } from '../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
        const rateLimitKey = `rl:guestbook:${ip}`;
        
        const isRateLimited = await env.SESSION.get(rateLimitKey);
        if (isRateLimited && !isLocalRequest(request)) {
            return redirect('/guestbook?status=timeout');
        }

        const { name: rawName, message: rawMessage, token } = await parseFormOrJson(request);
        const name = rawName.trim();
        const message = rawMessage.trim();
        if (!name || !message) {
            return redirect('/guestbook?status=goaway');
        }

        if (name.length > 50 || message.length > 300) {
            return redirect('/guestbook?status=toolong');
        }

        const turnstileSecret = env.TURNSTILE_SITE_SECRET;
        if (turnstileSecret && token) {
            const { success } = await verifyTurnstile(turnstileSecret, token);
            if (!success && !isLocalRequest(request)) {
                return redirect('/guestbook?status=turnstile');
            }
        }
        await env.DB.prepare('INSERT INTO Guestbook (name, message) VALUES (?, ?)')
            .bind(name, message)
            .run();

        // Set rate limit cooldown (KV minimum TTL is 60 seconds)
        await env.SESSION.put(rateLimitKey, "1", { expirationTtl: 60 });

        const webhookUrl = env.DISCORD_WEBHOOK_GUESTBOOK;
        if (webhookUrl) {
            const mentionUserId = env.DISCORD_UID;
            const payload: any = {
                username: "guestbook",
                embeds: [
                    {
                        title: name,
                        description: message.length > 3900 ? message.slice(0, 3900) + "…" : message,
                        timestamp: new Date().toISOString(),
                        color: 0xdc3545,
                    },
                ],
            };

            if (mentionUserId) {
                payload.content = `<@${mentionUserId}>`;
                payload.allowed_mentions = { users: [mentionUserId] };
            }

            const success = await sendDiscordWebhook(webhookUrl, payload);
            if (!success) {
                return redirect('/guestbook?status=ok_webhook_failed');
            }
        }

        return redirect('/guestbook?status=ok');
    } catch (e) {
        console.error(e);
        return redirect('/guestbook?status=error');
    }
};

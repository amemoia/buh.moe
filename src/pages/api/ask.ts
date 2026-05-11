import type { APIRoute } from 'astro';
import { env } from "cloudflare:workers";
import { parseFormOrJson, verifyTurnstile, redirect, sendDiscordWebhook } from '../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const ip = request.headers.get("CF-Connecting-IP") || "127.0.0.1";
        const rateLimitKey = `rl:ask:${ip}`;

        const isRateLimited = await env.SESSION.get(rateLimitKey);
        if (isRateLimited) {
            return redirect('/ask?status=timeout');
        }

        const { name: rawName, message: rawMessage, token } = await parseFormOrJson(request);
        const name = rawName.trim() || "Anonymous";
        const message = rawMessage.trim();

        if (!message) {
            return redirect('/ask?status=goaway');
        }

        if (name.length > 64 || message.length > 1000) {
            return redirect('/ask?status=toolong');
        }

        const turnstileSecret = env.TURNSTILE_SITE_SECRET;
        if (turnstileSecret && token) {
            const { success } = await verifyTurnstile(turnstileSecret, token);
            if (!success) {
                return redirect('/ask?status=turnstile');
            }
        }

        const webhookUrl = env.DISCORD_WEBHOOK_ASKS;
        if (!webhookUrl) {
            console.error("DISCORD_ASK_WEBHOOK is not set");
            return redirect('/ask?status=error');
        }

        const mentionUserId = env.DISCORD_UID;
        const payload: any = {
            username: "ask",
            embeds: [
                {
                    title: `${name} asks...`,
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

        if (success) {
            await env.SESSION.put(rateLimitKey, "1", { expirationTtl: 60 });
        } else {
            return redirect('/ask?status=ok_webhook_failed');
        }

        return redirect('/ask?status=ok');
    } catch (e) {
        console.error(e);
        return redirect('/ask?status=error');
    }
};

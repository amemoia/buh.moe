export const prerender = false;

import type { APIRoute } from "astro";
import { isLocalRequest, verifyTurnstile, sendDiscordWebhook, parseFormOrJson, ratelimit, redirect } from "../../lib/api";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async (context) => {
    const { request } = context;

    const { name, message, token } = await parseFormOrJson(request);

    if (!message) return redirect("/ask?status=error");
    if (name.length > 64) return redirect("/ask?status=error");
    if (message.length > 1000) return redirect("/ask?status=toolong");

    
    if (name.startsWith(">") || name.startsWith('\">') || message.startsWith(">") || message.startsWith('\">'))
        return redirect("/ask?status=goaway");

    const isLocal = isLocalRequest(request);
    if (!token && !isLocal) return redirect("/ask?status=turnstile");

    if (!isLocal) {
        const secret = (env as any).TURNSTILE_SITE_SECRET;
        if (!secret) return redirect("/ask?status=turnstile");
        const { success, codes } = await verifyTurnstile(String(secret), token);
        if (!success) {
            const bad = ["invalid-or-unknown-site-key", "invalid-site-secret", "missing-site-secret"];
            if (codes.some((c) => bad.includes(c))) return redirect("/ask?status=turnstile_invalid_domain");
            return redirect("/ask?status=turnstile");
        }
    }

    const clientIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "anon";
    if (await ratelimit(clientIp, "ask_ratelimit", 60, env.SESSION)) {
        return redirect("/ask?status=timeout");
    }

    const webhookUrl = ((env as any).DISCORD_WEBHOOK_ASKS)?.toString().trim();

    if (!webhookUrl) return redirect("/ask?status=ok_webhook_failed");

    const mentionUserId = ((env as any).DISCORD_UID)?.toString().trim();
    const payload: any = {
        username: "ask",
        embeds: [
            { 
                title: name || "Anonymous", 
                description: message.length > 3900 ? `${message.slice(0, 3900)}...` : message, 
                timestamp: new Date().toISOString(), 
                color: 0xe94f66 
            },
        ],
    };

    if (mentionUserId) {
        payload.content = `<@${mentionUserId}>`;
        payload.allowed_mentions = { users: [mentionUserId] };
    }

    const ok = await sendDiscordWebhook(webhookUrl, payload);
    return redirect(ok ? "/ask?status=ok" : "/ask?status=ok_webhook_failed");
};

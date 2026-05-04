import type { APIRoute } from "astro";
import { db } from "../../db";
import { Guestbook } from "../../db/schema";
import { isLocalRequest, verifyTurnstile, sendDiscordWebhook } from "../../lib/api";
import { env } from "cloudflare:workers";

export const prerender = false;

const redirect = (path: string) =>
    new Response(null, {
        status: 303,
        headers: { Location: path },
    });


export const POST: APIRoute = async (context) => {
    const { request } = context;

    let name = "";
    let message = "";
    let token = "";

    const form = await request.formData().catch(() => null);
    if (form && form.get("name")) {
        name = String(form.get("name") ?? "").trim();
        message = String(form.get("message") ?? "").trim();
        token = String(form.get("cf-turnstile-response") ?? "");
    } else {
        try {
            const json = (await request.json()) as any;
            name = String(json.name ?? "").trim();
            message = String(json.message ?? "").trim();
            token = String(json["cf-turnstile-response"] ?? json.token ?? "");
        } catch {
            const params = new URLSearchParams(await request.text());
            name = String(params.get("name") ?? "").trim();
            message = String(params.get("message") ?? "").trim();
            token = String(params.get("cf-turnstile-response") ?? "");
        }
    }

    if (!name || !message || name.length > 50) return redirect("/guestbook?status=error");
    if (message.length > 300) return redirect("/guestbook?status=toolong");
    if (name.startsWith(">") || name.startsWith('\">') || message.startsWith(">") || message.startsWith('\">'))
        return redirect("/guestbook?status=goaway");

    const isLocal = isLocalRequest(request);
    if (!token && !isLocal) return redirect("/guestbook?status=turnstile");

    if (!isLocal) {
        const secret = (env as any).TURNSTILE_SITE_SECRET;
        if (!secret) return redirect("/guestbook?status=turnstile");
        const { success, codes } = await verifyTurnstile(String(secret), token);
        if (!success) {
            const bad = ["invalid-or-unknown-site-key", "invalid-site-secret", "missing-site-secret"];
            if (codes.some((c) => bad.includes(c))) return redirect("/guestbook?status=turnstile_invalid_domain");
            return redirect("/guestbook?status=turnstile");
        }
    }

    const clientIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for") ?? "anon";
    try {
        if (env.SESSION?.get) {
            if (await env.SESSION.get(`guestbook_throttle:${clientIp}`)) return redirect("/guestbook?status=timeout");
            await env.SESSION.put(`guestbook_throttle:${clientIp}`, "1", { expirationTtl: 60 });
        }
    } catch { }

    if (!env.DB) return redirect("/guestbook?status=error");
    const d1 = db(env.DB);
    await d1.insert(Guestbook).values({ name, message });

    const webhookUrl = ((env as any).DISCORD_WEBHOOK_GUESTBOOK)?.toString().trim();
    if (!webhookUrl) return redirect("/guestbook?status=ok");
    const mentionUserId = ((env as any).DISCORD_UID)?.toString().trim();
    const payload: any = {
        username: "guestbook",
        embeds: [
            { title: name, description: message.length > 3900 ? `${message.slice(0, 3900)}...` : message, timestamp: new Date().toISOString(), color: 0xdc3545 },
        ],
    };
    if (mentionUserId) {
        payload.content = `<@${mentionUserId}>`;
        payload.allowed_mentions = { users: [mentionUserId] };
    }

    const ok = await sendDiscordWebhook(webhookUrl, payload);
    return redirect(ok ? "/guestbook?status=ok" : "/guestbook?status=ok_webhook_failed");
};

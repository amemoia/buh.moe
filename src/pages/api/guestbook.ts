import type { APIRoute } from "astro";
import { db, Guestbook } from "astro:db";
import {
  getEnv,
  isLocalRequest,
  verifyTurnstile,
  sendDiscordWebhook,
} from "../../lib/api";

export const prerender = false;

const redirect = (path: string) =>
  new Response(null, { status: 303, headers: { Location: path } });

export const POST: APIRoute = async ({ request, env }: any) => {
  try {
    const contentType = (
      request.headers.get("content-type") ?? ""
    ).toLowerCase();
    let name = "",
      message = "",
      token = "";

    if (contentType.includes("application/json")) {
      const json = await request.json();
      name = (json.name ?? "").toString().trim();
      message = (json.message ?? "").toString().trim();
      token = (json["cf-turnstile-response"] ?? json.token ?? "").toString();
    } else {
      try {
        const form = await request.formData();
        name = form.get("name")?.toString().trim() ?? "";
        message = form.get("message")?.toString().trim() ?? "";
        token = form.get("cf-turnstile-response")?.toString() ?? "";
      } catch {
        const params = new URLSearchParams(await request.text());
        name = (params.get("name") ?? "").toString().trim();
        message = (params.get("message") ?? "").toString().trim();
        token = (params.get("cf-turnstile-response") ?? "").toString();
      }
    }

    if (name.length > 100 || !name || !message)
      return redirect("/guestbook?status=error");
    if (message.length > 300) return redirect("/guestbook?status=toolong");

    const isLocal = isLocalRequest(request);
    if (!token && !isLocal) return redirect("/guestbook?status=turnstile");

    if (!isLocal) {
      const secret = getEnv(env, "TURNSTILE_SITE_SECRET");
      if (!secret) return redirect("/guestbook?status=turnstile");
      const { success, codes } = await verifyTurnstile(secret, token);
      if (!success) {
        if (
          codes.includes("invalid-or-unknown-site-key") ||
          codes.includes("invalid-site-secret") ||
          codes.includes("missing-site-secret")
        )
          return redirect("/guestbook?status=turnstile_invalid_domain");
        return redirect("/guestbook?status=turnstile");
      }
    }

    try {
      const clientIp =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for") ??
        "anon";
      if (typeof env?.SESSION?.get === "function") {
        if (await env.SESSION.get(`guestbook_throttle:${clientIp}`))
          return redirect("/guestbook?status=error");
        await env.SESSION.put(`guestbook_throttle:${clientIp}`, "1", {
          expirationTtl: 60,
        });
      }
    } catch {}

    await db.insert(Guestbook).values({ name, message });

    const webhookUrl = getEnv(env, "DISCORD_WEBHOOK_GUESTBOOK")
      ?.toString()
      .trim();
    if (!webhookUrl) return redirect("/guestbook?status=ok");

    const mentionUserId = getEnv(env, "DISCORD_UID")?.toString().trim();
    const payload: any = {
      username: "guestbook",
      embeds: [
        {
          title: name,
          description:
            message.length > 3900 ? message.slice(0, 3900) + "…" : message,
          timestamp: new Date().toISOString(),
          color: 0xdc3545,
        },
      ],
    };
    if (mentionUserId) {
      payload.content = `<@${mentionUserId}>`;
      payload.allowed_mentions = { users: [mentionUserId] };
    }

    const ok = await sendDiscordWebhook(webhookUrl, payload);
    return redirect(
      ok ? "/guestbook?status=ok" : "/guestbook?status=ok_webhook_failed",
    );
  } catch {
    return redirect("/guestbook?status=error");
  }
};

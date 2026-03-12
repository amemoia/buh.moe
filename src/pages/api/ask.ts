import type { APIRoute } from "astro";
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

    if (name.length > 100 || !message) return redirect("/ask?status=error");
    if (!name) name = "anon";
    if (message.length > 1000) return redirect("/ask?status=toolong");

    const isLocal = isLocalRequest(request);
    if (!token && !isLocal) return redirect("/ask?status=turnstile");

    if (!isLocal) {
      const secret = getEnv(env, "TURNSTILE_SITE_SECRET");
      if (!secret) return redirect("/ask?status=turnstile");
      const { success } = await verifyTurnstile(secret, token);
      if (!success) return redirect("/ask?status=turnstile");
    }

    try {
      const clientIp =
        request.headers.get("cf-connecting-ip") ??
        request.headers.get("x-forwarded-for") ??
        "anon";
      if (typeof env?.SESSION?.get === "function") {
        if (await env.SESSION.get(`ask_throttle:${clientIp}`))
          return redirect("/ask?status=error");
        await env.SESSION.put(`ask_throttle:${clientIp}`, "1", {
          expirationTtl: 5,
        });
      }
    } catch {}

    const webhookUrl = getEnv(env, "DISCORD_WEBHOOK_ASKS")?.toString().trim();
    if (!webhookUrl) return redirect("/ask?status=ok");

    const mentionUserId = getEnv(env, "DISCORD_UID")?.toString().trim();
    const payload: any = {
      username: "ask",
      embeds: [
        {
          title: `${name} asks...`,
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
    return redirect(ok ? "/ask?status=ok" : "/ask?status=ok_webhook_failed");
  } catch {
    return redirect("/ask?status=error");
  }
};

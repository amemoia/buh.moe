import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const present = {
      ASTRO_DB_APP_TOKEN: Boolean(process.env.ASTRO_DB_APP_TOKEN),
      ASTRO_DB_REMOTE_URL: Boolean(process.env.ASTRO_DB_REMOTE_URL),
      TURNSTILE_SITE_SECRET: Boolean(process.env.TURNSTILE_SITE_SECRET || import.meta.env.TURNSTILE_SITE_SECRET),
      TURNSTILE_SITE_KEY: Boolean(process.env.TURNSTILE_SITE_KEY || import.meta.env.TURNSTILE_SITE_KEY),
      DISCORD_WEBHOOK_GUESTBOOK: Boolean(process.env.DISCORD_WEBHOOK_GUESTBOOK || import.meta.env.DISCORD_WEBHOOK_GUESTBOOK),
      DISCORD_WEBHOOK_ASKS: Boolean(process.env.DISCORD_WEBHOOK_ASKS || import.meta.env.DISCORD_WEBHOOK_ASKS),
      DISCORD_UID: Boolean(process.env.DISCORD_UID || import.meta.env.DISCORD_UID),
    };

    return new Response(JSON.stringify(present, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('envcheck error', e);
    return new Response(JSON.stringify({ error: 'failed' }), { status: 500 });
  }
};

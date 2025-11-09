import type { APIRoute } from 'astro';

export const prerender = false;

// Debug endpoint: report presence of important env vars without exposing values.
// Only for temporary debugging; remove when done.
export const GET: APIRoute = async () => {
  try {
    const check = (name: string) => ({
      inProcess: Boolean((process && (process.env as any)?.[name])),
      inImportMeta: Boolean((import.meta as any)?.env && (import.meta as any).env[name]),
      inGlobal: Boolean((globalThis as any)[name]),
    });

    const vars = [
      'ASTRO_DB_APP_TOKEN',
      'ASTRO_DB_REMOTE_URL',
      'TURNSTILE_SITE_SECRET',
      'TURNSTILE_SITE_KEY',
      'DISCORD_WEBHOOK_GUESTBOOK',
      'DISCORD_WEBHOOK_ASKS',
      'DISCORD_UID',
    ];

    const present: Record<string, { inProcess: boolean; inImportMeta: boolean; inGlobal: boolean }> = {};
    for (const v of vars) present[v] = check(v);

    return new Response(JSON.stringify(present, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('envcheck error', e);
    return new Response(JSON.stringify({ error: 'failed' }), { status: 500 });
  }
};

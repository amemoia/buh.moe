import type { APIRoute } from 'astro';

export const prerender = false;

const mask = (v: any) => {
  if (v == null) return null;
  const s = String(v);
  if (s.length <= 12) return s;
  return `${s.slice(0, 8)}...${s.slice(-4)}`;
};

const lookupEnv = (env: any, k: string) => {
  try {
    if (env && typeof env[k] !== 'undefined') return env[k];
  } catch (e) {}
  try {
    if (typeof process !== 'undefined' && (process as any).env && (process as any).env[k]) return (process as any).env[k];
  } catch (e) {}
  try {
    // @ts-ignore
    if (typeof globalThis !== 'undefined' && (globalThis as any)[k]) return (globalThis as any)[k];
  } catch (e) {}
  return undefined;
};

export const GET: APIRoute = async ({ env }: any) => {
  const rawUrl = lookupEnv(env, 'ASTRO_DB_REMOTE_URL');
  let urlValid = false;
  let parsed = null;
  try {
    if (rawUrl) {
      // try to parse using the URL constructor
      parsed = new URL(String(rawUrl)).toString();
      urlValid = true;
    }
  } catch (e) {
    urlValid = false;
  }

  const out = {
    note: 'Sensitive values are masked. Do not leave this endpoint public.',
    envKeys: env ? Object.keys(env) : null,
    values: {
      ASTRO_DB_REMOTE_URL_raw: rawUrl ? String(rawUrl) : null,
      ASTRO_DB_REMOTE_URL_parsed: parsed,
      ASTRO_DB_REMOTE_URL_valid: urlValid,
      ASTRO_DB_APP_TOKEN: mask(lookupEnv(env, 'ASTRO_DB_APP_TOKEN')),
      TURNSTILE_SITE_SECRET: mask(lookupEnv(env, 'TURNSTILE_SITE_SECRET')),
      DISCORD_WEBHOOK_GUESTBOOK: lookupEnv(env, 'DISCORD_WEBHOOK_GUESTBOOK') ? String(lookupEnv(env, 'DISCORD_WEBHOOK_GUESTBOOK')) : null,
      DISCORD_WEBHOOK_ASKS: lookupEnv(env, 'DISCORD_WEBHOOK_ASKS') ? String(lookupEnv(env, 'DISCORD_WEBHOOK_ASKS')) : null,
      DISCORD_UID: lookupEnv(env, 'DISCORD_UID') ? String(lookupEnv(env, 'DISCORD_UID')) : null,
      SESSION_bound: Boolean(env && env.SESSION),
    }
  };

  return new Response(JSON.stringify(out, null, 2), { headers: { 'Content-Type': 'application/json' } });
};

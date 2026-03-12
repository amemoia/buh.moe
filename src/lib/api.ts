export const getEnv = (env: any, k: string): string | undefined => {
  try {
    if (env?.[k]) return env[k];
  } catch {}
  try {
    if ((process as any)?.env?.[k]) return (process as any).env[k];
  } catch {}
  try {
    if ((import.meta.env as any)?.[k]) return (import.meta.env as any)[k];
  } catch {}
  try {
    if ((globalThis as any)?.[k]) return (globalThis as any)[k];
  } catch {}
  return undefined;
};

export const isLocalRequest = (request: Request): boolean => {
  const host = request.headers.get("host") ?? "";
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1") ||
    host.endsWith(".workers.dev")
  );
};

export const verifyTurnstile = async (
  secret: string,
  token: string,
): Promise<{ success: boolean; codes: string[] }> => {
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
    },
  );
  const data = await res.json();
  return { success: Boolean(data.success), codes: data["error-codes"] ?? [] };
};

export const sendDiscordWebhook = async (
  url: string,
  payload: any,
): Promise<boolean> => {
  let attempt = 0;
  while (attempt <= 1) {
    attempt++;
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 2000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ac.signal,
      });
      clearTimeout(t);
      if (res.ok) return true;
      if (res.status === 429) {
        const j = await res.json().catch(() => null);
        let wait = j?.retry_after
          ? j.retry_after > 1000
            ? j.retry_after
            : j.retry_after * 1000
          : 1000;
        wait = Math.min(Math.ceil(wait), 5000);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      return false;
    } catch {
      clearTimeout(t);
      await new Promise((r) => setTimeout(r, 250 * attempt));
    }
  }
  return false;
};

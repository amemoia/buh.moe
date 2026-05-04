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
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            secret,
            response: token,
        }).toString(),
    });
    const data = (await res.json()) as any;
    return {
        success: Boolean(data.success),
        codes: data["error-codes"] ?? [],
    };
};

export const sendDiscordWebhook = async (url: string, payload: any): Promise<boolean> => {
    let attempt = 0;

    while (attempt <= 1) {
        attempt += 1;

        const ac = new AbortController();
        const timeout = setTimeout(() => ac.abort(), 2000);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: ac.signal,
            });

            clearTimeout(timeout);

            if (res.ok) return true;

            if (res.status === 429) {
                const retry = (await res.json().catch(() => null)) as any;
                let wait = retry?.retry_after
                    ? retry.retry_after > 1000
                        ? retry.retry_after
                        : retry.retry_after * 1000
                    : 1000;

                wait = Math.min(Math.ceil(wait), 5000);
                await new Promise((resolve) => setTimeout(resolve, wait));
                continue;
            }

            return false;
        } catch {
            clearTimeout(timeout);
            await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
        }
    }

    return false;
};

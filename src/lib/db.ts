// Lazy DB loader to avoid creating the DB client at module initialization.
// This delays `import('astro:db')` until request-time so missing secrets
// won't crash the Worker during module load.
export async function getDbModules(): Promise<{ db: any; Guestbook: any }> {
  try {
    const mod = await import('astro:db');
    return { db: (mod as any).db, Guestbook: (mod as any).Guestbook };
  } catch (err) {
    // Re-throw after logging so callers can handle gracefully.
    console.error('lazy db import failed', err);
    throw err;
  }
}

export default getDbModules;

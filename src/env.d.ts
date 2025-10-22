/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly DISCORD_USER_ID: string;
    readonly LANYARD_API: string;
    // Add more environment variables here as needed
    // readonly API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

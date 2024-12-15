import { defineConfig } from 'astro/config';
// Import /static for a static site
import vercelStatic from '@astrojs/vercel/static';
export default defineConfig({
    // Must be 'static' or 'hybrid'
    site: "https://buh.moe",
    output: 'static',
    adapter: vercelStatic({
        webAnalytics: {
            enabled: true,
        }
    }),
  });
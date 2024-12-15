import { defineConfig } from 'astro/config';
// Import /static for a static site
import vercel from '@astrojs/vercel';
export default defineConfig({
    // Must be 'static' or 'hybrid'
    site: "https://buh.moe",
    output: 'static',
    adapter: vercel(),
  });
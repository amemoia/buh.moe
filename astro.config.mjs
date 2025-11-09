// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  site: 'https://buh.moe',
  integrations: [icon(), db()],
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        'saeko'
      ]
    }
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  adapter: cloudflare(),
});
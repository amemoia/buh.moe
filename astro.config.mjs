// @ts-check
import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://buh.moe',
  
  integrations: [],

  vite: {
    plugins: [tailwindcss(), Icons({ compiler: 'astro' })],
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

  adapter: cloudflare()
});
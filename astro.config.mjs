import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://born2be4.github.io',
  base: '/rubezh-2026',
  trailingSlash: 'ignore',
  integrations: [tailwind()],
  build: {
    assets: 'assets',
  },
});

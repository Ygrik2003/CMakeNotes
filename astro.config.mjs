// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import astroExpressiveCode from 'astro-expressive-code';

const src = fileURLToPath(new URL('./src', import.meta.url));

const site = process.env.SITE_URL ?? 'http://127.0.0.1:43124';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [
    astroExpressiveCode(),
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru-RU',
          en: 'en-US',
        },
      },
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeSlug, rehypeKatex],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': src,
      },
    },
  },
});

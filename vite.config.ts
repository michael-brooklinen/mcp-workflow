import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    shopify({
      themeRoot: 'theme',
      sourceCodeDir: 'frontend',
      entrypointsDir: 'frontend/entrypoints',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend'),
      '~': path.resolve(__dirname, './node_modules'),
    },
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    emptyOutDir: true,
  },
});
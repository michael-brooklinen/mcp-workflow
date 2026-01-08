import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    shopify({
      themeRoot: 'theme',
      sourceCodeDir: 'src',
      entrypointsDir: 'stc/entrypoints',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './node_modules'),
    },
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    emptyOutDir: true,
  },
});

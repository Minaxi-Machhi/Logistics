import UnoCSS from 'unocss/vite';
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: 'IBM Plex Mono',
            weights: [400, 500],
          },
          {
            name: 'IBM Plex Sans',
            weights: [400, 500, 600],
            styles: ['normal'],
          },
        ],
      },
    }),
    UnoCSS()
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: [
      '.ts',
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})

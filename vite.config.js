import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      filename: 'sw.js',
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,webp,png}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/sw\.js$/,
          /^\/workbox-.*\.js$/
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // hace que se puedan importar objetos con import Component from '@/...'
    },
  },
})

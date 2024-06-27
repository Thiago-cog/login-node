import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Finance Pro',
        short_name: 'F.Pro',
        description: 'Descrição do aplicativo',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: './src/assets/2-removebg-preview.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ],
      },
      devOptions: {
        enabled: true,
        /* other options */
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-cdn-url\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'your-cache-name',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    strictPort: true,
    port: 3000
  }
})
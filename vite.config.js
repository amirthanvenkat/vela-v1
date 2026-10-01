import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Relative base so the build works on GitHub Pages (/vela-v1/) and from any other folder or host.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // Installable app + offline support. The service worker precaches the whole build, so after the
    // first visit VELA opens with no connection. New versions install in the background and take over
    // on the next launch (no forced reload mid-flow; demo progress lives in localStorage anyway).
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: './',
        name: 'VELA · Your money, moving.',
        short_name: 'VELA',
        description: 'Save and invest your first salary, without the jargon.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1B2D4F',
        theme_color: '#1B2D4F',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        cleanupOutdatedCaches: true,
        // Activate new versions as soon as they're downloaded; the open page keeps the code it already
        // loaded, and the next launch runs the new build.
        skipWaiting: true,
        clientsClaim: true,
        // Google Fonts: the stylesheet can change, the font files never do.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 5777 },
  preview: { port: 5777 },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});

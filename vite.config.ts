import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    rollupOptions: {
      output: {
        /*
          Leaflet in its own chunk.

          It is ~150KB of code that changes only when the dependency is upgraded,
          while the app chunk changes on every deploy. Bundled together, one
          typo-fix release makes every returning visitor re-download the map
          library; split, that chunk stays in their cache until Leaflet itself
          moves.
        */
        manualChunks: { leaflet: ['leaflet'] },
      },
    },
  },
  server: {
    // Must stay in the gateway's CORS_ALLOW_ORIGINS list, otherwise the browser
    // blocks every credentialed request before it leaves the page.
    port: 5173,
    strictPort: true,
  },
})

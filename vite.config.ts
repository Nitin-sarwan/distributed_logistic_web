import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    // Must stay in the gateway's CORS_ALLOW_ORIGINS list, otherwise the browser
    // blocks every credentialed request before it leaves the page.
    port: 5173,
    strictPort: true,
  },
})

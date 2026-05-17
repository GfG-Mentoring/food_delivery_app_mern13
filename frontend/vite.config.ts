import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // On Vercel, static assets are served from backend/public; Express static() is ignored there.
    outDir:
      process.env.VERCEL === '1'
        ? path.resolve(__dirname, '../backend/public')
        : 'dist',
    emptyOutDir: true,
  },
})

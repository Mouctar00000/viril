import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { reviewsApiPlugin } from './scripts/reviewsApiPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reviewsApiPlugin()],
})

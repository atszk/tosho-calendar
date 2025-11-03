import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  base: '/tosho-calendar/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    Sitemap({
      hostname: 'https://atszk.github.io/tosho-calendar',
    }),
  ],
  server: {
    host: true
  }
})

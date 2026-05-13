import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is driven by the BASE_PATH env var so the same repo can target
// multiple hosts. GitHub Pages sets BASE_PATH=/Homes-Brokerage-OS/; Forge /
// custom domains (e.g. homes.esystematic.org) leave it unset → root '/'.
// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['homes.esystematic.org'],
  },
}))

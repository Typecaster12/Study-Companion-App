import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  allowedHosts: ["pretty-crabs-count.loca.lt", "itchy-yaks-fix.loca.lt", "cfb3893244fe.ngrok-free.app"],
  },
})

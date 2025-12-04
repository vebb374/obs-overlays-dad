import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'zustand', 'react-router-dom'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge', 'react-rnd']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true
  }
})

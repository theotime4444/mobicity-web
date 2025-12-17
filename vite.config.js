import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permet d'écouter sur toutes les interfaces (nécessaire pour Docker)
    port: 5173,
    watch: {
      usePolling: true, // Nécessaire pour Docker sur Windows
    },
    // Proxy pour éviter les problèmes CORS en développement
    // L'API est montée directement sur /, donc on proxy tout vers l'API
    proxy: {
      '/v1': {
        target: 'http://host.docker.internal:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

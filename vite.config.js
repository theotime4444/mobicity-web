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
    // Le proxy redirige /v1 vers l'API backend
    // En local : localhost:3001 (par défaut)
    // Pour Docker : définir VITE_API_BASE_URL=http://host.docker.internal:3001
    proxy: {
      '/v1': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

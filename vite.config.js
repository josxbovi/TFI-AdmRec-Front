import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto del frontend (diferente al backend que usa 3000)
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend en puerto 3000
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Elimina /api del path
      }
    }
  }
})


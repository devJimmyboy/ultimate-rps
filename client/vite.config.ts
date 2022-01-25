import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': { target: 'http://localhost:6969/socket.io', ws: true },
      '/login': {
        target: 'http://localhost:6969',
        changeOrigin: true,
      }
    }
  }
})

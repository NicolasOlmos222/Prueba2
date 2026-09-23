import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_LOCAL_URL || 'http://localhost:3000',
        changeOrigin: true
      },
      '/health': {
        target: process.env.VITE_BACKEND_LOCAL_URL || 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});


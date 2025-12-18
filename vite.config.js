import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minicss: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-ui': ['swiper', 'yet-another-react-lightbox', '@fortawesome/react-fontawesome']
        }
      }
    }
  },
  server: {
    port: 5701,
    strictPort: true,
    host: true
  }
})

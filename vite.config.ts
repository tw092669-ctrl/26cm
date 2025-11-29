import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Optimized build settings for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/tw092669-ctrl/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // By default Vite uses esbuild for minification which is fast and doesn't require extra config
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react', 'html-to-image'],
        },
      },
    },
  },
});
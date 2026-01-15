import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // GitHub Pages 部署路徑設定
      // 部署 URL: https://tw092669-ctrl.github.io/26cm/
      base: mode === 'production' ? '/26cm/' : '/',
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      
      plugins: [react()],
      
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      build: {
        outDir: 'dist',
        sourcemap: false,
        // 優化打包配置
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'charts': ['recharts'],
            }
          }
        }
      }
    };
});

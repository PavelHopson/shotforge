import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react-vendor';
              if (id.includes('node_modules/lucide-react')) return 'icons';
              if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'charts';
              return undefined;
            },
          },
        },
      },
});

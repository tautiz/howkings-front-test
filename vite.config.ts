import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://bos.howkings.lt'; // Fallback URL jei env kintamasis nerastas

  console.log('API URL:', apiUrl); // Debuginimui

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Debuginimui
              console.log('Proxying request:', {
                from: req.url,
                to: proxyReq.path,
                headers: proxyReq.getHeaders()
              });
              proxyReq.setHeader('Cookie', req.headers.cookie || '');
            });
          }
        }
      }
    }
  }
});

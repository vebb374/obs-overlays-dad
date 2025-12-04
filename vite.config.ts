import { defineConfig, type ViteDevServer, type Connect } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import type { ServerResponse } from 'node:http'

// Custom plugin to handle scene persistence
const scenePersistence = () => ({
  name: 'scene-persistence',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/api/scene', (req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
      const scenePath = path.resolve(process.cwd(), 'scene.json');

      if (req.method === 'GET') {
        if (fs.existsSync(scenePath)) {
          const content = fs.readFileSync(scenePath, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.end(content);
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Scene file not found' }));
        }
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            // Validate JSON before writing
            JSON.parse(body);
            fs.writeFileSync(scenePath, body);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save scene' }));
          }
        });
        return;
      }

      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), scenePersistence()],
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'zustand', 'react-router-dom'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge', 'react-rnd']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true
  }
})

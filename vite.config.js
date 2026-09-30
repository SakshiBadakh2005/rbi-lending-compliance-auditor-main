import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playStoreMiddleware } from './server/playStoreHandler.js'
import { geminiMiddleware } from './server/geminiHandler.js'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server',
      configureServer(server) {
        server.middlewares.use('/api/play-store', playStoreMiddleware)
        server.middlewares.use('/api/gemini', geminiMiddleware)
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api/play-store', playStoreMiddleware)
        server.middlewares.use('/api/gemini', geminiMiddleware)
      }
    }
  ],
})

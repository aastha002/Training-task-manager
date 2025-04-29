import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages fix for React Router
function spaFallbackPlugin() {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.includes('.') && !req.url.startsWith('/@')) {
          req.url = '/index.html'
        }
        next()
      })
    }
  }
}

export default defineConfig({
  base: '/Training-task-manager/',
  plugins: [react(), spaFallbackPlugin()],
})

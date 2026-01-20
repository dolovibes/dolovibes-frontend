import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimizaciones de build
  build: {
    // Tamaño mínimo para crear chunks separados (en bytes)
    chunkSizeWarningLimit: 500,
    
    // Configuración de Rollup para code splitting
    rollupOptions: {
      output: {
        // Separar vendors en chunks independientes
        manualChunks: {
          // React y React DOM en un chunk separado (cambian poco)
          'react-vendor': ['react', 'react-dom'],
          // Router en su propio chunk
          'router': ['react-router-dom'],
          // React Query
          'query': ['@tanstack/react-query'],
          // i18n
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // Iconos (pueden ser pesados)
          'icons': ['lucide-react'],
        },
        // Nombres de archivos con hash para cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Minificación agresiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
        drop_debugger: true,
      },
    },
    
    // Generar source maps solo en desarrollo
    sourcemap: false,
    
    // Target moderno para mejor optimización
    target: 'es2020',
  },
  
  // Optimizaciones del servidor de desarrollo
  server: {
    // Pre-bundle dependencies
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/pages/HomePage.jsx',
        './src/components/VideoHero.jsx',
      ],
    },
  },
  
  // Optimización de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'i18next',
      'react-i18next',
      'axios',
    ],
  },
})

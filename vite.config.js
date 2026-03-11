import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// Plugin to inject GTM env var into index.html
// Uses loadEnv to properly read .env files, and removes GTM blocks entirely when ID is not set or invalid
function htmlEnvPlugin(gtmId) {
  // Allowlist validation: accept only standard GTM IDs like "GTM-XXXXXXX"
  const safeGtmId =
    typeof gtmId === 'string' && /^GTM-[A-Z0-9]+$/.test(gtmId.trim())
      ? gtmId.trim()
      : null;

  return {
    name: 'html-env',
    transformIndexHtml(html) {
      if (!safeGtmId) {
        // Remove entire GTM script and noscript blocks when ID is not configured or invalid
        html = html.replace(/\s*<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\s*/g, '');
        html = html.replace(/\s*<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, '');
        return html;
      }
      return html.replace(/%VITE_GTM_ID%/g, safeGtmId);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Only load VITE_-prefixed vars to avoid accidentally consuming non-public env vars
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
  plugins: [
    react(),
    htmlEnvPlugin(env.VITE_GTM_ID),
    // Compresión Gzip y Brotli para producción
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  
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
};
})

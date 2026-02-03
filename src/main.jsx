import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import i18n from './i18n' // Inicializar i18n
import { CurrencyProvider } from './utils/currency.jsx'
import { SiteTextsProvider } from './contexts/SiteTextsContext.jsx'
import { clearSpanishDataCache } from './services/api.js'
import App from './App.jsx'

// Configurar React Query cliente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Locales soportados para filtrar queries
const SUPPORTED_LOCALES = ['es', 'en', 'it', 'de'];

// Invalidar cache de React Query cuando cambie el idioma
// Esto previene inconsistencias de datos entre idiomas
i18n.on('languageChanged', (newLang) => {
  // 1. Limpiar cache de datos españoles (fallback de imágenes)
  clearSpanishDataCache();

  // 2. Cancelar queries en progreso para evitar race conditions
  queryClient.cancelQueries();

  // 3. Invalidar solo queries que dependen del locale (más eficiente que removeQueries)
  // Esto marca los queries como stale y se refetcharán cuando se necesiten
  queryClient.invalidateQueries({
    predicate: (query) => {
      // Invalidar queries cuyo último key sea un locale
      const queryKey = query.queryKey;
      const lastKey = queryKey[queryKey.length - 1];
      return typeof lastKey === 'string' && SUPPORTED_LOCALES.includes(lastKey);
    }
  });

  console.info(`[i18n] Language changed to ${newLang}, locale-specific cache invalidated`);
});

// Componente de carga inicial mientras se cargan traducciones
const InitialLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando DoloVibes...</p>
    </div>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<InitialLoader />}>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <SiteTextsProvider>
            <App />
          </SiteTextsProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </Suspense>
  </StrictMode>,
)


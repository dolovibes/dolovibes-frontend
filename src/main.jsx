import { StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import i18n from './i18n' // Inicializar i18n
import { CurrencyProvider } from './utils/currency.jsx'
import { SiteTextsProvider } from './contexts/SiteTextsContext.jsx'
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

// Invalidar cache de React Query cuando cambie el idioma
// Esto previene inconsistencias de datos entre idiomas
i18n.on('languageChanged', (newLang) => {
  // Cancelar queries en progreso para evitar race conditions
  queryClient.cancelQueries();
  
  // Remover todos los queries del cache para forzar refetch con nuevo locale
  // Usar removeQueries en lugar de invalidateQueries para evitar peticiones duplicadas
  queryClient.removeQueries();
  
  console.info(`[i18n] Language changed to ${newLang}, cache cleared`);
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


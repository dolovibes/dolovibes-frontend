import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './i18n' // Inicializar i18n (solo side effects)
import { CurrencyProvider } from './utils/currency.jsx'
import { SiteTextsProvider } from './contexts/SiteTextsContext.jsx'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

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

// NOTA: La invalidación del cache de React Query al cambiar idioma se maneja en
// LanguageTransitionContext (dentro de App.jsx). El contexto usa removeQueries
// y espera a que las queries críticas se carguen antes de mostrar el contenido,
// evitando así la mezcla de idiomas durante la transición.

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
    <ErrorBoundary>
      <Suspense fallback={<InitialLoader />}>
        <QueryClientProvider client={queryClient}>
          <CurrencyProvider>
            <SiteTextsProvider>
              <App />
            </SiteTextsProvider>
          </CurrencyProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)


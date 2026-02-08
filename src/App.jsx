import React, { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, ROUTE_PATHS } from './utils/localizedRoutes';
import { LanguageTransitionProvider, useLanguageTransition } from './contexts/LanguageTransitionContext';

// Componentes (cargan siempre - necesarios en todas las páginas)
import NavbarNew from './components/NavbarNew';
import QuoteModal from './components/QuoteModal';
import ErrorBoundary from './components/ErrorBoundary';

// Páginas con Lazy Loading - solo se cargan cuando se navega a ellas
const HomePage = lazy(() => import('./pages/HomePage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const PackageInfoPage = lazy(() => import('./pages/PackageInfoPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const DynamicLegalPage = lazy(() => import('./pages/DynamicLegalPage'));

const PageLoader = () => {
  const { t } = useTranslation('common');
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pizarra border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-niebla">{t('loading.generic')}</p>
      </div>
    </div>
  );
};

/**
 * Overlay que se muestra durante la transición de idioma
 * Previene que el usuario vea textos mezclados entre idiomas
 */
const LanguageTransitionOverlay = () => {
  const { isTransitioning } = useLanguageTransition();

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 bg-pizarra/20 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-pizarra border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

/**
 * Componente que sincroniza el idioma de la URL con i18n
 * Se ejecuta cuando cambia el parámetro :lang de la URL
 */
const LocaleSync = ({ children }) => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Validar que el idioma sea soportado
    if (lang && SUPPORTED_LOCALES.includes(lang)) {
      // Solo cambiar si es diferente para evitar loops
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
        // Guardar en localStorage
        try {
          localStorage.setItem('preferredLanguage', lang);
        } catch (_e) {
          // localStorage no disponible
        }
      }
    } else if (lang && !SUPPORTED_LOCALES.includes(lang)) {
      // Idioma no soportado, redirigir al default
      const newPath = location.pathname.replace(`/${lang}`, `/${DEFAULT_LOCALE}`);
      navigate(newPath, { replace: true });
    }
  }, [lang, i18n, location.pathname, navigate]);
  
  return children;
};

/**
 * Componente que detecta el idioma y redirige a la URL correcta
 * Solo se usa para la ruta raíz /
 */
const LocaleRedirect = () => {
  const { i18n } = useTranslation();
  
  // Obtener idioma preferido
  let targetLocale = DEFAULT_LOCALE;
  
  try {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      targetLocale = saved;
    } else if (SUPPORTED_LOCALES.includes(i18n.language)) {
      targetLocale = i18n.language;
    }
  } catch (_e) {
    // localStorage no disponible
  }
  
  return <Navigate to={`/${targetLocale}`} replace />;
};

/**
 * Componente wrapper para redirigir URLs antiguas (sin prefijo de idioma)
 * a las nuevas URLs con prefijo /es/
 * @param {string} routeType - 'experiences' | 'packages' | 'legal'
 */
const LegacyRedirect = ({ routeType }) => {
  const { slug } = useParams();
  const routePath = ROUTE_PATHS[DEFAULT_LOCALE][routeType];
  return <Navigate to={`/${DEFAULT_LOCALE}/${routePath}/${slug}`} replace />;
};

/**
 * Contenido interno de la app que usa el LanguageTransitionProvider
 * Debe estar dentro del Router porque usa hooks de react-router
 */
const AppContent = ({ isQuoteOpen, setIsQuoteOpen, initialInterest, setInitialInterest }) => {
  const handleOpenQuote = (interest = "") => {
    setInitialInterest(interest);
    setIsQuoteOpen(true);
  };

  return (
    <LanguageTransitionProvider>
      <div className="min-h-screen font-sans text-grafito bg-white">
        {/* Overlay de transición de idioma */}
        <LanguageTransitionOverlay />

        {/* Navbar global */}
        <NavbarNew onOpenQuote={() => handleOpenQuote()} />

        {/* Rutas con Suspense para lazy loading */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Redirect raíz al idioma preferido */}
            <Route path="/" element={<LocaleRedirect />} />
            
            {/* Rutas con prefijo de idioma */}
            <Route path="/:lang" element={<LocaleSync><HomePage /></LocaleSync>} />
            
            {/* Experiencias - todos los idiomas */}
            <Route path="/:lang/experiencias/:slug" element={<LocaleSync><ExperiencePage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            <Route path="/:lang/experiences/:slug" element={<LocaleSync><ExperiencePage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            <Route path="/:lang/esperienze/:slug" element={<LocaleSync><ExperiencePage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            <Route path="/:lang/erlebnisse/:slug" element={<LocaleSync><ExperiencePage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            
            {/* Paquetes - todos los idiomas */}
            <Route path="/:lang/paquetes/:slug" element={<LocaleSync><PackageInfoPage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            <Route path="/:lang/packages/:slug" element={<LocaleSync><PackageInfoPage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            <Route path="/:lang/pacchetti/:slug" element={<LocaleSync><PackageInfoPage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            <Route path="/:lang/pakete/:slug" element={<LocaleSync><PackageInfoPage onOpenQuote={handleOpenQuote} /></LocaleSync>} />
            
            {/* About - todos los idiomas */}
            <Route path="/:lang/nosotros" element={<LocaleSync><AboutUsPage onOpenQuote={() => handleOpenQuote()} /></LocaleSync>} />
            <Route path="/:lang/about" element={<LocaleSync><AboutUsPage onOpenQuote={() => handleOpenQuote()} /></LocaleSync>} />
            <Route path="/:lang/chi-siamo" element={<LocaleSync><AboutUsPage onOpenQuote={() => handleOpenQuote()} /></LocaleSync>} />
            <Route path="/:lang/ueber-uns" element={<LocaleSync><AboutUsPage onOpenQuote={() => handleOpenQuote()} /></LocaleSync>} />
            
            {/* Legal - todos los idiomas */}
            <Route path="/:lang/legales/:slug" element={<LocaleSync><DynamicLegalPage /></LocaleSync>} />
            <Route path="/:lang/legal/:slug" element={<LocaleSync><DynamicLegalPage /></LocaleSync>} />
            <Route path="/:lang/legale/:slug" element={<LocaleSync><DynamicLegalPage /></LocaleSync>} />
            <Route path="/:lang/rechtliches/:slug" element={<LocaleSync><DynamicLegalPage /></LocaleSync>} />
            
            {/* Fallback: URLs antiguas sin prefijo de idioma -> redirigir a español */}
            <Route path="/experiencias/:slug" element={<LegacyRedirect routeType="experiences" />} />
            <Route path="/paquetes/:slug" element={<LegacyRedirect routeType="packages" />} />
            <Route path="/nosotros" element={<Navigate to="/es/nosotros" replace />} />
            <Route path="/legales/:slug" element={<LegacyRedirect routeType="legal" />} />
            
            {/* Catch-all: cualquier ruta no encontrada -> home del idioma default */}
            <Route path="*" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
          </Routes>
        </Suspense>

        {/* Modal de Cotización */}
        <QuoteModal
          isOpen={isQuoteOpen}
          onClose={() => setIsQuoteOpen(false)}
          initialInterest={initialInterest}
        />
      </div>
    </LanguageTransitionProvider>
  );
};

// --- App Principal ---
const App = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [initialInterest, setInitialInterest] = useState("");

  return (
    <ErrorBoundary>
      <Router>
        <AppContent
          isQuoteOpen={isQuoteOpen}
          setIsQuoteOpen={setIsQuoteOpen}
          initialInterest={initialInterest}
          setInitialInterest={setInitialInterest}
        />
      </Router>
    </ErrorBoundary>
  );
};

export default App;

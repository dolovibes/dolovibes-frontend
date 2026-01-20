import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes (cargan siempre - necesarios en todas las páginas)
import NavbarNew from './components/NavbarNew';
import QuoteModal from './components/QuoteModal';

// Páginas con Lazy Loading - solo se cargan cuando se navega a ellas
const HomePage = lazy(() => import('./pages/HomePage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const PackageInfoPage = lazy(() => import('./pages/PackageInfoPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CancellationPage = lazy(() => import('./pages/CancellationPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const CookiesPage = lazy(() => import('./pages/CookiesPage'));

// Componente de carga mientras se descarga la página
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-pizarra border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-niebla">Cargando...</p>
    </div>
  </div>
);

// --- App Principal ---
const App = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [initialInterest, setInitialInterest] = useState("");

  const handleOpenQuote = (interest = "") => {
    setInitialInterest(interest);
    setIsQuoteOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen font-sans text-grafito bg-white">
        {/* Navbar global */}
        <NavbarNew onOpenQuote={() => handleOpenQuote()} />

        {/* Rutas con Suspense para lazy loading */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/experiencia/:slug"
              element={<ExperiencePage onOpenQuote={handleOpenQuote} />}
            />
            <Route
              path="/paquete/:slug"
              element={<PackageInfoPage onOpenQuote={handleOpenQuote} />}
            />
            <Route
              path="/about"
              element={<AboutUsPage onOpenQuote={() => handleOpenQuote()} />}
            />
            <Route path="/terminos" element={<TermsPage />} />
            <Route path="/cancelaciones" element={<CancellationPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
          </Routes>
        </Suspense>

        {/* Modal de Cotización */}
        <QuoteModal
          isOpen={isQuoteOpen}
          onClose={() => setIsQuoteOpen(false)}
          initialInterest={initialInterest}
        />
      </div>
    </Router>
  );
};

export default App;

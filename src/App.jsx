import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes
import NavbarNew from './components/NavbarNew';
import QuoteModal from './components/QuoteModal';

// Páginas
import HomePage from './pages/HomePage';
import ExperiencePage from './pages/ExperiencePage';
import PackageInfoPage from './pages/PackageInfoPage';
import AboutUsPage from './pages/AboutUsPage';

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

        {/* Rutas */}
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
        </Routes>

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

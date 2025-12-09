import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, User, Mail, Phone, ArrowRight, CheckCircle } from 'lucide-react';

// Componentes
import NavbarNew from './components/NavbarNew';
import BookingForm from './components/BookingForm';

// Páginas
import HomePage from './pages/HomePage';
import ExperiencePage from './pages/ExperiencePage';
import PackageInfoPage from './pages/PackageInfoPage';
import AboutUsPage from './pages/AboutUsPage';

// Datos
import { experiences } from './data/experiences';

// --- Modal de Cotización ---
const QuoteModal = ({ isOpen, onClose, initialInterest = "" }) => {
  const { t } = useTranslation('common');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "2",
    interest: initialInterest || t('quoteModal.customPlan'),
    notes: ""
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialInterest) {
        setFormData(prev => ({ ...prev, interest: initialInterest }));
      }
      setStep(1);
    }
  }, [isOpen, initialInterest]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => {
      onClose();
      setStep(1);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up">

        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{t('quoteModal.title')}</h3>
            <p className="text-emerald-100 text-sm">{t('quoteModal.step')} {step < 3 ? step : 2} {t('quoteModal.of')} 2</p>
          </div>
          <button onClick={onClose} className="hover:bg-emerald-700 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">{t('quoteModal.step1Title')}</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('quoteModal.interestLabel')}</label>
                <select
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                >
                  <option value="Personalizado">{t('quoteModal.customPlan')}</option>
                  {experiences.map(exp => <option key={exp.id} value={exp.title}>{exp.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('quoteModal.dateLabel')}</label>
                  <input type="month" className="w-full border border-slate-200 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('quoteModal.travelersLabel')}</label>
                  <select className="w-full border border-slate-200 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, "8+"].map(n => <option key={n} value={n}>{n} {t('labels.persons')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('quoteModal.notesLabel')}</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500 h-24"
                  placeholder={t('quoteModal.notesPlaceholder')}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 mt-4"
              >
                {t('buttons.next')} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">{t('quoteModal.step2Title')}</h4>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder={t('quoteModal.namePlaceholder')}
                  required
                  className="w-full pl-10 border border-slate-200 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder={t('quoteModal.emailPlaceholder')}
                  required
                  className="w-full pl-10 border border-slate-200 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="tel"
                  placeholder={t('quoteModal.phonePlaceholder')}
                  required
                  className="w-full pl-10 border border-slate-200 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {t('buttons.back')}
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  {t('buttons.submit')}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('quoteModal.successTitle')}</h3>
              <p className="text-slate-600">{t('quoteModal.successMessage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
      <div className="min-h-screen font-sans text-slate-900 bg-white">
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

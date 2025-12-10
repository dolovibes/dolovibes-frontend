import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mountain, Menu, X, ChevronDown } from 'lucide-react';
import { experiences } from '../data/experiences';

const NavbarNew = ({ onOpenQuote }) => {
    const { t } = useTranslation('common');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Páginas con fondo blanco que necesitan navbar oscuro desde el inicio
    const isWhiteBackgroundPage = location.pathname === '/about' ||
        location.pathname.startsWith('/experiencia/') ||
        location.pathname.startsWith('/paquete/');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsExperiencesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExperienceClick = (slug) => {
        setIsExperiencesOpen(false);
        setIsMenuOpen(false);
        navigate(`/experiencia/${slug}`);
    };

    // Usar estilo oscuro si scrolled O si estamos en página con fondo blanco
    const isDarkMode = scrolled || isWhiteBackgroundPage;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isDarkMode
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-5'
            }`}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 group"
                    >
                        <Mountain className={`w-8 h-8 transition-colors ${isDarkMode ? 'text-emerald-600' : 'text-emerald-400'
                            } group-hover:text-emerald-500`} />
                        <span className={`text-2xl font-bold tracking-tighter transition-colors ${isDarkMode ? 'text-slate-800' : 'text-white'
                            }`}>
                            DOLOVIBES
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Experiencias Dropdown */}
                        <div
                            ref={dropdownRef}
                            className="relative"
                            onMouseEnter={() => setIsExperiencesOpen(true)}
                            onMouseLeave={() => setIsExperiencesOpen(false)}
                        >
                            <button
                                className={`flex items-center gap-1 font-medium transition-colors px-3 py-2 rounded-lg ${isDarkMode
                                    ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {t('navbar.experiences')}
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExperiencesOpen ? 'rotate-180' : ''
                                    }`} />
                            </button>

                            {/* Dropdown Menu */}
                            <div className={`absolute top-full left-0 mt-2 transition-all duration-300 ${isExperiencesOpen
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'
                                }`}>
                                <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden p-5 min-w-[320px]">
                                    <div className="grid grid-cols-2 gap-8">
                                        {/* Verano */}
                                        <div>
                                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                ☀️ Verano
                                            </p>
                                            <ul className="space-y-2">
                                                {experiences.filter(exp => exp.season === 'verano').map((exp) => (
                                                    <li key={exp.id}>
                                                        <button
                                                            onClick={() => handleExperienceClick(exp.slug)}
                                                            className="text-slate-700 hover:text-emerald-600 font-medium text-sm transition-colors"
                                                        >
                                                            {exp.title}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {/* Invierno */}
                                        <div>
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                                                ❄️ Invierno
                                            </p>
                                            <ul className="space-y-2">
                                                {experiences.filter(exp => exp.season === 'invierno').map((exp) => (
                                                    <li key={exp.id}>
                                                        <button
                                                            onClick={() => handleExperienceClick(exp.slug)}
                                                            className="text-slate-700 hover:text-emerald-600 font-medium text-sm transition-colors"
                                                        >
                                                            {exp.title}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Us */}
                        <Link
                            to="/about"
                            className={`font-medium transition-colors px-3 py-2 rounded-lg ${isDarkMode
                                ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                                : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {t('navbar.aboutUs')}
                        </Link>

                        {/* Botón Cotizar */}
                        <button
                            onClick={onOpenQuote}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40"
                        >
                            {t('navbar.quote')}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                            }`}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}>
                <div className="container mx-auto px-6 py-4">
                    {/* Experiencias Accordion */}
                    <div className="border-b border-slate-100 pb-3 mb-3">
                        <button
                            onClick={() => setIsExperiencesOpen(!isExperiencesOpen)}
                            className="w-full flex items-center justify-between py-3 text-slate-800 font-medium"
                        >
                            <span>{t('navbar.experiences')}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${isExperiencesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${isExperiencesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                            <div className="pl-4 space-y-2 pb-2">
                                {experiences.map((exp) => (
                                    <button
                                        key={exp.id}
                                        onClick={() => handleExperienceClick(exp.slug)}
                                        className="w-full flex items-center gap-3 py-2 text-left text-slate-600 hover:text-emerald-600"
                                    >
                                        <img
                                            src={exp.image}
                                            alt={exp.title}
                                            className="w-10 h-8 object-cover rounded"
                                        />
                                        <span className="text-sm">{exp.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* About Us */}
                    <Link
                        to="/about"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-slate-800 font-medium border-b border-slate-100"
                    >
                        {t('navbar.aboutUs')}
                    </Link>

                    {/* Cotizar Button */}
                    <button
                        onClick={() => { setIsMenuOpen(false); onOpenQuote(); }}
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold mt-4"
                    >
                        {t('navbar.quote')}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavbarNew;

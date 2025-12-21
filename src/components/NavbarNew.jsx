import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mountain, Menu, X, ChevronDown } from 'lucide-react';
import { experiences } from '../data/experiences';
import LanguageSwitcher from './LanguageSwitcher';

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
                        <Mountain className={`w-8 h-8 transition-colors ${isDarkMode ? 'text-alpino' : 'text-bruma'
                            } group-hover:text-alpino`} />
                        <span className={`text-2xl font-bold tracking-tighter transition-colors ${isDarkMode ? 'text-grafito' : 'text-white'
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
                                    ? 'text-pizarra hover:text-alpino hover:bg-nieve'
                                    : 'text-white/90 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {t('navbar.experiences')}
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExperiencesOpen ? 'rotate-180' : ''
                                    }`} />
                            </button>

                            {/* Mega Dropdown Menu */}
                            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 transition-all duration-300 ${isExperiencesOpen
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'
                                }`}>
                                <div className="bg-white rounded-xl shadow-2xl border border-niebla overflow-hidden min-w-[480px]">
                                    {/* Header */}
                                    <div className="bg-nieve px-6 py-3">
                                        <h3 className="text-sm font-semibold text-pizarra uppercase tracking-wider">
                                            {t('navbar.ourExperiences')}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-2">
                                        {/* Verano */}
                                        <div className="p-5">
                                            <h4 className="text-xs font-bold text-niebla uppercase tracking-wider mb-4">
                                                {t('seasons.summer')}
                                            </h4>
                                            <ul className="space-y-1">
                                                {experiences.filter(exp => exp.season === 'verano').map((exp) => (
                                                    <li key={exp.id}>
                                                        <button
                                                            onClick={() => handleExperienceClick(exp.slug)}
                                                            className="w-full text-left px-3 py-2 text-pizarra hover:text-grafito hover:bg-nieve rounded-lg font-medium text-sm transition-colors"
                                                        >
                                                            {exp.title}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Invierno */}
                                        <div className="p-5">
                                            <h4 className="text-xs font-bold text-niebla uppercase tracking-wider mb-4">
                                                {t('seasons.winter')}
                                            </h4>
                                            <ul className="space-y-1">
                                                {experiences.filter(exp => exp.season === 'invierno').map((exp) => (
                                                    <li key={exp.id}>
                                                        <button
                                                            onClick={() => handleExperienceClick(exp.slug)}
                                                            className="w-full text-left px-3 py-2 text-pizarra hover:text-grafito hover:bg-nieve rounded-lg font-medium text-sm transition-colors"
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
                                ? 'text-pizarra hover:text-alpino hover:bg-nieve'
                                : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {t('navbar.aboutUs')}
                        </Link>

                        {/* Botón Cotizar */}
                        <button
                            onClick={onOpenQuote}
                            className="bg-alpino hover:bg-alpino text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-alpino/25 hover:shadow-alpino/40"
                        >
                            {t('navbar.quote')}
                        </button>

                        {/* Language Switcher */}
                        <LanguageSwitcher isDarkMode={isDarkMode} />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${isDarkMode ? 'text-grafito hover:bg-nieve' : 'text-white hover:bg-white/10'
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
                    <div className="border-b border-niebla pb-3 mb-3">
                        <button
                            onClick={() => setIsExperiencesOpen(!isExperiencesOpen)}
                            className="w-full flex items-center justify-between py-3 text-grafito font-medium"
                        >
                            <span>{t('navbar.experiences')}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform ${isExperiencesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${isExperiencesOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                            <div className="py-2">
                                {/* Verano */}
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-niebla uppercase tracking-wider px-3 py-2">
                                        {t('seasons.summer')}
                                    </p>
                                    {experiences.filter(exp => exp.season === 'verano').map((exp) => (
                                        <button
                                            key={exp.id}
                                            onClick={() => handleExperienceClick(exp.slug)}
                                            className="w-full text-left px-3 py-2 text-pizarra hover:text-grafito hover:bg-nieve rounded-lg text-sm font-medium"
                                        >
                                            {exp.title}
                                        </button>
                                    ))}
                                </div>
                                {/* Invierno */}
                                <div>
                                    <p className="text-xs font-bold text-niebla uppercase tracking-wider px-3 py-2">
                                        {t('seasons.winter')}
                                    </p>
                                    {experiences.filter(exp => exp.season === 'invierno').map((exp) => (
                                        <button
                                            key={exp.id}
                                            onClick={() => handleExperienceClick(exp.slug)}
                                            className="w-full text-left px-3 py-2 text-pizarra hover:text-grafito hover:bg-nieve rounded-lg text-sm font-medium"
                                        >
                                            {exp.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Us */}
                    <Link
                        to="/about"
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-3 text-grafito font-medium border-b border-niebla"
                    >
                        {t('navbar.aboutUs')}
                    </Link>

                    {/* Cotizar Button */}
                    <button
                        onClick={() => { setIsMenuOpen(false); onOpenQuote(); }}
                        className="w-full bg-alpino text-white py-3 rounded-xl font-bold mt-4"
                    >
                        {t('navbar.quote')}
                    </button>

                    {/* Language Switcher - Mobile */}
                    <div className="mt-4 pt-4 border-t border-niebla flex justify-center">
                        <LanguageSwitcher isDarkMode={true} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarNew;

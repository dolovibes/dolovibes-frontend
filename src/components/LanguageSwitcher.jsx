import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { convertPathToLocale } from '../utils/localizedRoutes';

/**
 * Componente de bandera usando SVG de flagcdn.com
 * Funciona en todos los navegadores (Windows Chrome no soporta emojis de banderas)
 */
const FlagIcon = ({ countryCode, className = "" }) => (
    <img
        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png 2x`}
        width="20"
        height="15"
        alt=""
        className={`inline-block rounded-sm ${className}`}
        loading="eager"
    />
);

const LanguageSwitcher = ({ isDarkMode = false, compact = false }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    // Usar códigos de país ISO 3166-1 alpha-2 para las banderas
    const languages = [
        { code: 'es', label: 'Español', countryCode: 'es' },  // España
        { code: 'en', label: 'English', countryCode: 'us' },  // USA
        { code: 'it', label: 'Italiano', countryCode: 'it' }, // Italia
        { code: 'de', label: 'Deutsch', countryCode: 'de' }   // Alemania
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Navegación por teclado
    const handleKeyDown = useCallback((event) => {
        if (!isOpen) {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        const currentIndex = languages.findIndex(l => l.code === i18n.language);

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = (currentIndex + 1) % languages.length;
                i18n.changeLanguage(languages[nextIndex].code);
                break;
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = (currentIndex - 1 + languages.length) % languages.length;
                i18n.changeLanguage(languages[prevIndex].code);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                setIsOpen(false);
                buttonRef.current?.focus();
                break;
            default:
                break;
        }
    }, [isOpen, i18n, languages]);

    const handleLanguageChange = (langCode) => {
        // Cambiar idioma en i18n
        i18n.changeLanguage(langCode);
        
        // Guardar preferencia en localStorage
        try {
            localStorage.setItem('preferredLanguage', langCode);
        } catch (e) {
            // localStorage no disponible
        }
        
        // Navegar a la misma página pero en el nuevo idioma
        const currentPath = location.pathname;
        const newPath = convertPathToLocale(currentPath, langCode);
        navigate(newPath, { replace: true });
        
        setIsOpen(false);
        buttonRef.current?.focus();
    };

    return (
        <div 
            ref={dropdownRef} 
            className="relative"
            onKeyDown={handleKeyDown}
        >
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors
                    focus:outline-none focus:ring-2 focus:ring-offset-1 ${isDarkMode
                    ? 'text-pizarra hover:text-alpino hover:bg-nieve focus:ring-amber-500'
                    : 'text-white/90 hover:text-white hover:bg-white/10 focus:ring-white/50'
                    }`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label={`Idioma actual: ${currentLanguage.label}. Haga clic para cambiar.`}
            >
                <FlagIcon
                    countryCode={currentLanguage.countryCode}
                    aria-hidden="true"
                />
                <span className={compact ? 'sr-only' : ''}>{currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <ul 
                    className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-niebla overflow-hidden min-w-[160px] z-50"
                    role="listbox"
                    aria-label="Seleccionar idioma"
                    tabIndex={-1}
                >
                    {languages.map((lang) => {
                        const isActive = currentLanguage.code === lang.code;
                        return (
                            <li key={lang.code}>
                                <button
                                    type="button"
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 
                                        hover:bg-amber-50 focus:bg-amber-50 focus:outline-none transition-colors ${
                                        isActive ? 'bg-amber-100 text-amber-700' : 'text-pizarra'
                                    }`}
                                    role="option"
                                    aria-selected={isActive}
                                >
                                    <FlagIcon
                                        countryCode={lang.countryCode}
                                        aria-hidden="true"
                                    />
                                    <span className="font-medium text-sm">{lang.label}</span>
                                    {isActive && (
                                        <svg 
                                            className="w-4 h-4 ml-auto text-amber-500" 
                                            fill="currentColor" 
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path 
                                                fillRule="evenodd" 
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                                clipRule="evenodd" 
                                            />
                                        </svg>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default LanguageSwitcher;

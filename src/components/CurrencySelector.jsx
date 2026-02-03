/**
 * Selector de Moneda
 *
 * Componente dropdown para seleccionar la moneda de visualización.
 * Compatible con navegadores antiguos y totalmente accesible (ARIA).
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { useCurrencyContext, SUPPORTED_CURRENCIES } from '../utils/currency';

/**
 * Componente de bandera usando imágenes de flagcdn.com
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

const CurrencySelector = ({
  isDarkMode = false,
  showFlag = true,
  showLabel = false,
  compact = false,
}) => {
  const { texts: siteTexts } = useSiteTextsContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const { currency, setCurrency, loading } = useCurrencyContext();

  const currentCurrency = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.EUR;

  // Convertir objeto a array para iterar
  const currencyList = Object.entries(SUPPORTED_CURRENCIES).map(([code, config]) => ({
    code,
    ...config,
  }));

  // Cerrar al hacer clic fuera
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

  // Manejo de teclado para navegación
  const handleKeyDown = useCallback((event) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const currentIndex = currencyList.findIndex(c => c.code === currency);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % currencyList.length;
        setCurrency(currencyList[nextIndex].code);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + currencyList.length) % currencyList.length;
        setCurrency(currencyList[prevIndex].code);
        break;
      case 'Home':
        event.preventDefault();
        setCurrency(currencyList[0].code);
        break;
      case 'End':
        event.preventDefault();
        setCurrency(currencyList[currencyList.length - 1].code);
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
  }, [isOpen, currency, currencyList, setCurrency]);

  const handleSelect = (code) => {
    setCurrency(code);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Estilos dinámicos basados en modo
  const baseButtonStyles = `
    flex items-center gap-1.5 px-2 py-1.5 rounded-md
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
    ${compact ? 'text-sm' : 'text-base'}
  `;

  const buttonStyles = isDarkMode
    ? `${baseButtonStyles} text-white hover:bg-white/10 focus:ring-white/50`
    : `${baseButtonStyles} text-gray-700 hover:bg-gray-100 focus:ring-amber-500`;

  const dropdownStyles = isDarkMode
    ? 'bg-gray-800 border-gray-700 shadow-xl'
    : 'bg-white border-gray-200 shadow-lg';

  const optionStyles = isDarkMode
    ? 'hover:bg-gray-700 focus:bg-gray-700'
    : 'hover:bg-amber-50 focus:bg-amber-50';

  const activeStyles = isDarkMode
    ? 'bg-amber-600/20 text-amber-400'
    : 'bg-amber-100 text-amber-700';

  if (loading) {
    return (
      <div
        className={`${baseButtonStyles} opacity-50 cursor-wait ${isDarkMode ? 'text-white' : 'text-gray-500'}`}
        aria-busy="true"
        aria-label={siteTexts.currency.loading}
      >
        <span className="animate-pulse">💱</span>
        <span className={compact ? 'hidden' : 'block'}>---</span>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onKeyDown={handleKeyDown}
    >
      {/* Botón del selector */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleOpen}
        className={buttonStyles}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={siteTexts.currency.currentLabel.replace(/\{\{?currency\}\}?/g, currentCurrency.name)}
      >
        {showFlag && currentCurrency.countryCode && (
          <FlagIcon
            countryCode={currentCurrency.countryCode}
            aria-hidden="true"
          />
        )}

        <span className={compact && !showLabel ? 'font-medium' : 'font-medium'}>
          {currency}
        </span>

        {showLabel && (
          <span className="hidden sm:inline text-sm opacity-75">
            {currentCurrency.nameShort}
          </span>
        )}

        {/* Flecha indicadora */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <ul
          className={`
            absolute right-0 mt-2 w-48 rounded-lg border overflow-hidden z-50
            ${dropdownStyles}
          `}
          role="listbox"
          aria-label={siteTexts.currency.selectLabel}
          tabIndex={-1}
        >
          {currencyList.map((curr) => {
            const isActive = curr.code === currency;

            return (
              <li key={curr.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={`
                    w-full px-4 py-2.5 flex items-center gap-3 text-left
                    transition-colors duration-150
                    ${optionStyles}
                    ${isActive ? activeStyles : isDarkMode ? 'text-gray-200' : 'text-gray-700'}
                  `}
                  role="option"
                  aria-selected={isActive}
                >
                  {curr.countryCode && (
                    <FlagIcon
                      countryCode={curr.countryCode}
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex flex-col">
                    <span className="font-medium">{curr.code}</span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {curr.name}
                    </span>
                  </div>

                  {isActive && (
                    <svg
                      className="w-5 h-5 ml-auto text-amber-500"
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

export default CurrencySelector;

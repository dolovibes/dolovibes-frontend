/**
 * CookieConsent — Banner de consentimiento compatible con GTM Consent Mode v2
 *
 * Estrategia geo-localizada:
 * ┌───────────────────────────────────────────────────────────────────┐
 * │  UE/EEE, Reino Unido y Brasil → BANNER OBLIGATORIO                │
 * │    • analytics_storage, ad_storage, ad_user_data = 'denied'      │
 * │      hasta opt-in explícito. Cumple GDPR, UK-GDPR, LGPD.        │
 * │                                                                   │
 * │  México / USA / Canadá / Resto del mundo → SIN BANNER            │
 * │    • Todos los consent signals = 'granted' automáticamente.      │
 * │    • CCPA (California) usa modelo opt-out, no opt-in.            │
 * └───────────────────────────────────────────────────────────────────┘
 *
 * Reutiliza detectUserLocation() de currency.jsx (ya cachea 7 días).
 * No hace un request extra si la geolocalización de moneda ya corrió.
 *
 * Flujo primera visita (UE):
 * 1. index.html aplica default denied POR REGIÓN (region: [EU/EEA/UK/BR]).
 * 2. CookieConsent detecta país → UE → muestra banner.
 * 3. Usuario acepta → gtag consent update ALL 'granted' (analytics + ads).
 * 4. Usuario rechaza → sigue en 'denied', GTM no recibe datos.
 *
 * Flujo primera visita (no-UE):
 * 1. index.html aplica default granted para TODO (analytics + ads).
 * 2. CookieConsent detecta país → no UE → refuerza auto-granted, sin banner.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { detectUserLocation } from '../utils/currency';

// Países donde el banner es legalmente obligatorio.
// UE/EEE completo, Reino Unido y Brasil (LGPD).
const CONSENT_REQUIRED_COUNTRIES = new Set([
  // Unión Europea
  'DE','FR','IT','ES','PT','NL','BE','AT','FI','SE','DK','PL','CZ','HU',
  'RO','BG','HR','SK','SI','EE','LV','LT','LU','MT','CY','IE','GR',
  // EEE (no UE)
  'NO','IS','LI',
  // Reino Unido
  'GB',
  // Brasil (LGPD)
  'BR',
]);

/**
 * Determina si el país del usuario requiere banner de consentimiento.
 * Devuelve true ante la duda (unknown → safe default = mostrar banner).
 */
const consentRequiredForCountry = (countryCode) => {
  if (!countryCode) return true; // desconocido → conservador
  return CONSENT_REQUIRED_COUNTRIES.has(countryCode.toUpperCase());
};

const CONSENT_KEY = 'dolovibes_consent_v1';
const CURRENCY_STORAGE_KEY = 'dolovibes_preferred_currency';

// Máximo tiempo (30 días) que una decisión auto-granted se considera válida
// antes de revalidar la jurisdicción. Las decisiones explícitas del usuario no expiran.
const AUTO_GRANT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

// Textos inline — sin depender de Strapi/namespaces para que el banner
// esté disponible incluso antes de que se carguen las traducciones.
const TEXTS = {
  es: {
    message: 'Usamos cookies analíticas y de publicidad para medir el rendimiento del sitio y mostrarte contenido relevante.',
    accept: 'Aceptar',
    reject: 'Rechazar',
    policy: 'Política de cookies',
  },
  en: {
    message: 'We use analytics and advertising cookies to measure site performance and show you relevant content.',
    accept: 'Accept',
    reject: 'Decline',
    policy: 'Cookie Policy',
  },
  it: {
    message: 'Utilizziamo cookie analitici e pubblicitari per misurare le prestazioni del sito e mostrarti contenuti pertinenti.',
    accept: 'Accetta',
    reject: 'Rifiuta',
    policy: 'Cookie Policy',
  },
  de: {
    message: 'Wir verwenden Analyse- und Werbe-Cookies, um die Website-Leistung zu messen und Ihnen relevante Inhalte zu zeigen.',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
    policy: 'Cookie-Richtlinie',
  },
};

// Slugs de la página de cookies en Strapi — ajustar si el slug real es distinto.
// Ruta esperada: /:lang/:legal-prefix/:slug
const LEGAL_ROUTES = {
  es: '/es/legales/politica-de-cookies',
  en: '/en/legal/cookie-policy',
  it: '/it/legale/cookie-policy',
  de: '/de/rechtliches/cookie-richtlinie',
};

/**
 * Llama a gtag('consent','update') a través de window.gtag expuesto en index.html.
 * Si GTM no está configurado (entorno dev sin VITE_GTM_ID), la función no existe y se ignora.
 */
function applyGtmConsent(analyticsGranted, options = {}) {
  const { emitEvent = false, eventMeta = {} } = options;
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') {
    const consentState = analyticsGranted ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      analytics_storage: consentState,
      ad_storage: consentState,
      ad_user_data: consentState,
      ad_personalization: consentState,
    });
  }
  // Emitir eventos solo en decisiones explícitas del usuario, no en rehidratación.
  if (emitEvent) {
    window.dataLayer.push({
      event: analyticsGranted ? 'cookie_consent_granted' : 'cookie_consent_denied',
      consent_status: analyticsGranted ? 'granted' : 'denied',
      consent_country: eventMeta.country || 'unknown',
      consent_language: eventMeta.language || 'unknown',
      consent_currency: eventMeta.currency || 'unknown',
      consent_source: eventMeta.source || 'banner',
      consent_mode_version: 'v2',
    });
  }
}

const CookieConsent = () => {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);

  useEffect(() => {
    const init = async () => {
      // 1. Leer decisión previa si existe.
      let saved = null;
      try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (raw) saved = JSON.parse(raw);
      } catch (_e) {
        // localStorage bloqueado — continúa con geo-detección.
      }

      // 2. Si el usuario aceptó/rechazó manualmente, respetar sin revalidar.
      if (saved && !saved.auto) {
        if (saved.country) setDetectedCountry(saved.country);
        applyGtmConsent(saved.analytics === true);
        return;
      }

      // 3. Si fue auto-granted, revalidar solo si el TTL expiró (30 días)
      //    o si no tiene timestamp (migración de formato anterior).
      if (saved && saved.auto) {
        const age = Date.now() - (saved.timestamp || 0);
        if (saved.timestamp && age < AUTO_GRANT_MAX_AGE_MS) {
          if (saved.country) setDetectedCountry(saved.country);
          applyGtmConsent(saved.analytics === true);
          return;
        }
        // TTL expirado → continuar a revalidar geolocalización.
      }

      // 4. Detectar país del usuario (usa cache de 7 días de currency.jsx, sin request extra).
      const location = await detectUserLocation();
      setDetectedCountry(location?.country || null);
      const requiresConsent = consentRequiredForCountry(location?.country);

      if (requiresConsent) {
        // País con obligación legal → mostrar banner. Consent sigue en 'denied' (default de index.html).
        // Si había un auto-grant previo de un país no UE, lo limpiamos.
        try { localStorage.removeItem(CONSENT_KEY); } catch (_e) { /* ok */ }
        setVisible(true);
      } else {
        // País sin obligación → auto-granted, no molestamos al usuario.
        applyGtmConsent(true);
        try {
          localStorage.setItem(
            CONSENT_KEY,
            JSON.stringify({ analytics: true, auto: true, country: location?.country, timestamp: Date.now() })
          );
        } catch (_e) { /* ok */ }
      }
    };

    init();
  }, []);

  const lang = (i18n.language || 'es').substring(0, 2);
  const t = TEXTS[lang] || TEXTS.es;
  const legalHref = LEGAL_ROUTES[lang] || LEGAL_ROUTES.es;

  const handleConsent = (granted) => {
    let preferredCurrency = null;
    try {
      preferredCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    } catch (_e) {
      // localStorage bloqueado
    }

    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ analytics: granted, country: detectedCountry || null, timestamp: Date.now() })
      );
    } catch (_e) {
      // No crítico — si falla el banner volverá a mostrarse en la siguiente visita.
    }
    applyGtmConsent(granted, {
      emitEvent: true,
      eventMeta: {
        country: detectedCountry,
        language: (i18n.language || 'es').substring(0, 2),
        currency: preferredCurrency,
        source: 'banner',
      },
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-t border-niebla shadow-2xl"
      role="dialog"
      aria-live="polite"
      aria-label={t.message}
    >
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm text-pizarra flex-1">
          {t.message}{' '}
          <a
            href={legalHref}
            className="underline hover:text-grafito transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.policy}
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleConsent(false)}
            className="px-4 py-2 text-sm font-medium text-pizarra border border-niebla rounded-lg hover:bg-nieve transition-colors focus:outline-none focus:ring-2 focus:ring-niebla"
          >
            {t.reject}
          </button>
          <button
            type="button"
            onClick={() => handleConsent(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-pizarra rounded-lg hover:bg-pizarra/90 transition-colors focus:outline-none focus:ring-2 focus:ring-pizarra"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

/**
 * Data Layer utility for Google Tag Manager
 *
 * Centralizes all dataLayer.push() calls so the analytics team
 * can map these events in GTM without touching the codebase.
 */

// Detección de dispositivo por evento: matchMedia(pointer:coarse) + viewport + UA fallback.
// Usar matchMedia es más fiable que UA puro (detecta iPadOS moderno que falsifica UA de Mac).
const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
  const w = window.innerWidth;
  if (/iPad|Tablet/i.test(ua) || (hasCoarsePointer && w >= 768)) return 'tablet';
  if (hasCoarsePointer || /Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
  return 'desktop';
};

// Contexto analítico global — se actualiza desde React vía setAnalyticsContext().
// Enriquece automáticamente todos los eventos sin necesitar pasar props manualmente.
let _context = { language: 'es', currency: 'EUR' };

/**
 * Sincroniza el contexto compartido de analytics con el estado de React.
 * Llamar desde App.jsx al cambiar idioma o moneda.
 */
export function setAnalyticsContext({ language, currency } = {}) {
  if (language !== undefined) _context.language = language;
  if (currency !== undefined) _context.currency = currency;
}

function sanitize(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/[<>"'&]/g, '');
}

function push(payload) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  const sanitized = Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, sanitize(v)])
  );
  // _context provee defaults de language/currency; el payload puede sobreescribirlos
  // (p.ej. trackPageView pasa language/currency explícitamente derivados de la URL).
  window.dataLayer.push({
    device_type: getDeviceType(),
    language: _context.language,
    currency: _context.currency,
    ...sanitized,
  });
}

// 1. Page view — fired on every route change
export function trackPageView({ pageType, language, currency }) {
  push({
    event: 'page_view',
    page_type: pageType,   // 'home' | 'experience' | 'package' | 'about' | 'legal'
    language,              // 'es' | 'en' | 'it' | 'de'
    currency,              // 'EUR' | 'USD' | 'MXN'
  });
}

// 2. Experience view
export function trackExperienceView({ title, slug }) {
  push({
    event: 'view_experience',
    experience_title: title,
    experience_slug: slug,
  });
}

// 3. Package view
// priceEUR    — precio base en EUR tal como viene del CMS (siempre presente).
// priceConverted — precio numérico en la moneda activa del usuario (puede coincidir con priceEUR si la moneda es EUR).
// displayCurrency — código ISO de la moneda que ve el usuario ('EUR' | 'USD' | 'MXN').
export function trackPackageView({ title, slug, priceEUR, priceConverted, displayCurrency, location, duration }) {
  push({
    event: 'view_package',
    package_title: title,
    package_slug: slug,
    package_price_eur: priceEUR,
    package_price_converted: priceConverted,
    package_price_currency: displayCurrency,
    package_location: location,
    package_duration: duration,
  });
}

// 4. General quote form — open
// cta_source: 'navbar' | 'package_page' | 'experience_page' | 'mobile_menu'
export function trackQuoteFormOpen({ interest, ctaSource }) {
  push({
    event: 'open_quote_form',
    form_type: 'general',
    interest: interest || '',
    cta_source: ctaSource || 'unknown',
  });
}

// 5. General quote form — submit
export function trackQuoteFormSubmit({ interest, guests, contactMethod }) {
  push({
    event: 'submit_quote_form',
    form_type: 'general',
    interest,
    guests,
    contact_method: contactMethod,
  });
}

// 6. Package quote form — open
export function trackPackageQuoteFormOpen({ packageTitle }) {
  push({
    event: 'open_quote_form',
    form_type: 'package',
    package_title: packageTitle,
  });
}

// 7. Package quote form — submit
export function trackPackageQuoteFormSubmit({ packageTitle, travelers, tripType, contactMethod }) {
  push({
    event: 'submit_quote_form',
    form_type: 'package',
    package_title: packageTitle,
    travelers,
    trip_type: tripType,
    contact_method: contactMethod,
  });
}

// 8. Form step navigation (general quote form funnel)
export function trackFormStep({ formType, step, stepName }) {
  push({
    event: 'form_step',
    form_type: formType,
    form_step: step,
    form_step_name: stepName,
  });
}

// 8b. Form errors (validation/API)
export function trackFormError({ formType, errorType, errorField }) {
  push({
    event: 'form_error',
    form_type: formType,
    form_error_type: errorType, // 'validation' | 'api'
    form_error_field: errorField || '',
  });
}

// 9. Language change
export function trackLanguageChange({ from, to }) {
  push({
    event: 'language_change',
    language_from: from,
    language_to: to,
  });
}

// 10. Currency change
export function trackCurrencyChange({ from, to }) {
  push({
    event: 'currency_change',
    currency_from: from,
    currency_to: to,
  });
}

// 11. Photo gallery open
export function trackGalleryOpen({ packageTitle, packageSlug, photoCount }) {
  push({
    event: 'open_gallery',
    package_title: packageTitle,
    package_slug: packageSlug,
    photo_count: photoCount,
  });
}

// 12. Photo gallery navigation — fired on each photo change
// method: 'button' | 'swipe' | 'keyboard'
// direction: 'next' | 'previous'
export function trackGalleryNavigate({ packageSlug, direction, method, photoIndex, totalPhotos }) {
  push({
    event: 'gallery_navigate',
    package_slug: packageSlug,
    gallery_direction: direction,    // 'next' | 'previous'
    gallery_nav_method: method,      // 'button' | 'swipe' | 'keyboard'
    gallery_photo_index: photoIndex, // 0-based index of destination photo
    gallery_total_photos: totalPhotos,
  });
}

// 13. Navbar experience click
// nav_type: 'desktop_dropdown' | 'mobile_menu'
export function trackNavExperienceClick({ title, slug, navType }) {
  push({
    event: 'nav_experience_click',
    experience_title: title,
    experience_slug: slug,
    nav_type: navType, // 'desktop_dropdown' | 'mobile_menu'
  });
}

// 14. Mobile nav menu toggle
export function trackNavMobileMenuToggle({ action }) {
  push({
    event: 'nav_mobile_menu',
    menu_action: action, // 'open' | 'close'
  });
}

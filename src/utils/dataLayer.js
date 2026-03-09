/**
 * Data Layer utility for Google Tag Manager
 *
 * Centralizes all dataLayer.push() calls so the analytics team
 * can map these events in GTM without touching the codebase.
 */

function push(payload) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
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
export function trackPackageView({ title, slug, priceEUR, location, duration }) {
  push({
    event: 'view_package',
    package_title: title,
    package_slug: slug,
    package_price_eur: priceEUR,
    package_location: location,
    package_duration: duration,
  });
}

// 4. General quote form — open
export function trackQuoteFormOpen({ interest }) {
  push({
    event: 'open_quote_form',
    form_type: 'general',
    interest: interest || '',
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

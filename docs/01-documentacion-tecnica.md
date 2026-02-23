# Documentación Técnica — Dolo Vibes

> **Versión:** 1.0
> **Fecha:** Febrero 2026
> **Audiencia:** Desarrolladores, consultorías o agencias de mantenimiento
> **Sitio web:** [www.dolo-vibes.com](https://www.dolo-vibes.com)
> **CMS Admin:** [api.dolo-vibes.com/admin](https://api.dolo-vibes.com/admin)

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Repositorios y Control de Versiones](#4-repositorios-y-control-de-versiones)
5. [Frontend — Detalle Técnico](#5-frontend--detalle-técnico)
6. [Backend (Strapi) — Detalle Técnico](#6-backend-strapi--detalle-técnico)
7. [Tipos de Contenido y Esquemas](#7-tipos-de-contenido-y-esquemas)
8. [Componentes Reutilizables (Strapi)](#8-componentes-reutilizables-strapi)
9. [APIs Personalizadas](#9-apis-personalizadas)
10. [Internacionalización (i18n)](#10-internacionalización-i18n)
11. [Sistema de Divisas](#11-sistema-de-divisas)
12. [Gestión de Medios (Cloudinary)](#12-gestión-de-medios-cloudinary)
13. [Sistema de Email (Resend)](#13-sistema-de-email-resend)
14. [Traducciones Automáticas (DeepL)](#14-traducciones-automáticas-deepl)
15. [SEO](#15-seo)
16. [Variables de Entorno](#16-variables-de-entorno)
17. [Configuración de Despliegue](#17-configuración-de-despliegue)
18. [Configuración de DNS y Dominios](#18-configuración-de-dns-y-dominios)
19. [Middlewares Personalizados](#19-middlewares-personalizados)
20. [Consideraciones de Mantenimiento](#20-consideraciones-de-mantenimiento)

---

## 1. Visión General del Proyecto

Dolo Vibes es un sitio web de turismo de aventura que ofrece experiencias y paquetes de senderismo, alpinismo y actividades de montaña. El sitio es multilingüe (4 idiomas) y soporta múltiples divisas.

**Modelo de negocio:** Los usuarios navegan experiencias y paquetes, y solicitan cotizaciones a través de formularios. No hay carrito de compras ni pasarela de pago — las reservas se gestionan manualmente por email/WhatsApp.

**Funcionalidades principales:**
- Catálogo de experiencias organizadas por temporada (verano/invierno)
- Paquetes con itinerarios detallados, galería de fotos, precios y fechas
- Formularios de cotización (general y por paquete)
- Soporte para 4 idiomas: Español, Inglés, Italiano, Alemán
- Conversión de precios en 3 divisas: EUR, USD, MXN
- Traducción automática del contenido CMS vía DeepL
- Cuestionario interactivo de nivel de senderismo
- Páginas legales dinámicas desde el CMS

---

## 2. Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USUARIO                                    │
│                      (Navegador Web)                                 │
└──────────────┬───────────────────────────────────┬───────────────────┘
               │                                   │
               ▼                                   ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│     VERCEL (Frontend)    │         │   exchangerate-api.com   │
│     www.dolo-vibes.com   │         │   (Conversión divisas)   │
│                          │         └──────────────────────────┘
│  React 19 + Vite + TW   │
│  React Router v7         │
│  React Query v5          │
│  i18next (4 idiomas)     │
└──────────────┬───────────┘
               │ API REST (Axios)
               ▼
┌──────────────────────────┐       ┌──────────────────────────┐
│   RAILWAY (Backend)      │──────▶│     CLOUDINARY           │
│   api.dolo-vibes.com     │       │  (Imágenes y videos)     │
│                          │       │  Cloud: dn8pprext        │
│  Strapi v5.35            │       └──────────────────────────┘
│  Node.js 20.11           │
│  TypeScript              │       ┌──────────────────────────┐
│                          │──────▶│     RESEND               │
│  ┌────────────────────┐  │       │  (Emails transaccionales)│
│  │ PostgreSQL (Railway)│  │       └──────────────────────────┘
│  │ Base de datos       │  │
│  └────────────────────┘  │       ┌──────────────────────────┐
│                          │──────▶│     DeepL API            │
└──────────────────────────┘       │  (Traducción automática) │
                                   └──────────────────────────┘
```

**Flujo de datos:**
1. El usuario accede a `www.dolo-vibes.com` → Vercel sirve la SPA (React)
2. El frontend hace peticiones REST a `api.dolo-vibes.com/api/*` → Railway (Strapi)
3. Strapi consulta PostgreSQL y devuelve contenido JSON
4. Las imágenes se sirven desde Cloudinary (en producción)
5. Los formularios de cotización se envían al backend → Strapi envía emails vía Resend
6. Desde el admin, el botón "Traducir" invoca DeepL para traducir contenido automáticamente
7. La conversión de divisas se hace en el frontend directamente contra exchangerate-api.com

---

## 3. Stack Tecnológico

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.2.3 | Framework UI |
| Vite | 7.2.4 | Build tool y dev server |
| React Router | 7.10.1 | Enrutamiento con prefijo de idioma |
| React Query (TanStack) | 5.90.16 | Estado del servidor, caché y fetching |
| Axios | 1.13.2 | Cliente HTTP para la API de Strapi |
| i18next | 25.7.2 | Internacionalización de la UI |
| Tailwind CSS | 3.4.1 | Framework de estilos |
| Lucide React | 0.555.0 | Iconografía |
| Terser | 5.46.0 | Minificación de producción |

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Strapi | 5.35.0 | CMS headless |
| Node.js | 20.11.0 | Runtime (definido en `.nvmrc`) |
| TypeScript | 5.x | Tipado del backend |
| PostgreSQL | — | Base de datos (producción en Railway) |
| SQLite | — | Base de datos (desarrollo local) |
| Sharp | 0.34.5 | Procesamiento de imágenes |
| deepl-node | 1.24.0 | SDK de DeepL para traducciones |
| Resend | 6.9.1 | SDK para envío de emails |

---

## 4. Repositorios y Control de Versiones

**Plataforma:** GitHub
**Organización:** [github.com/dolovibes](https://github.com/dolovibes)
**Cuenta:** info@dolo-vibes.com

| Repositorio | Contenido |
|---|---|
| `dolovibes-frontend` | Aplicación React (SPA) |
| `dolovibes-backend` | Strapi CMS + APIs personalizadas |

**Ramas principales:**
- `main` — Rama de producción. Los despliegues en Vercel y Railway se disparan automáticamente al hacer push a esta rama.
- `integracion-strapi` — Rama de desarrollo/integración activa.

---

## 5. Frontend — Detalle Técnico

### Estructura del proyecto

```
dolovibes-frontend/
├── public/
│   ├── locales/           # Archivos de traducción JSON (es, en, it, de)
│   │   ├── es/            # 8 namespaces: common, home, about, experiences, etc.
│   │   ├── en/
│   │   ├── it/
│   │   └── de/
│   ├── videos/            # Videos estáticos (hero)
│   └── favicon/
├── src/
│   ├── assets/            # Imágenes estáticas
│   ├── components/        # Componentes reutilizables (~15 componentes)
│   ├── contexts/          # React Contexts (Currency, SiteTexts)
│   ├── hooks/             # Hooks personalizados (usePageMeta, etc.)
│   ├── locales/           # Archivos i18n auxiliares
│   ├── pages/             # 5 páginas principales
│   ├── services/          # API client, hooks de datos, Strapi client
│   ├── utils/             # Utilidades (currency, rutas localizadas, etc.)
│   ├── App.jsx            # Componente raíz con rutas
│   ├── main.jsx           # Punto de entrada (Vite)
│   ├── i18n.js            # Configuración de i18next
│   └── index.css          # Estilos globales + Tailwind
├── tailwind.config.js     # Paleta de colores y tipografía personalizada
├── vite.config.js         # Build, chunking y compresión
├── vercel.json            # Rewrites, headers y caché
└── package.json
```

### Páginas y Rutas

Todas las rutas usan prefijo de idioma: `/:lang/...`

| Página | Ruta (ES) | Ruta (EN) | Ruta (IT) | Ruta (DE) | Componente |
|---|---|---|---|---|---|
| Inicio | `/:lang/` | `/:lang/` | `/:lang/` | `/:lang/` | `HomePage.jsx` |
| Experiencia | `/es/experiencias/:slug` | `/en/experiences/:slug` | `/it/esperienze/:slug` | `/de/erlebnisse/:slug` | `ExperiencePage.jsx` |
| Paquete | `/es/paquetes/:slug` | `/en/packages/:slug` | `/it/pacchetti/:slug` | `/de/pakete/:slug` | `PackageInfoPage.jsx` |
| Nosotros | `/es/nosotros` | `/en/about` | `/it/chi-siamo` | `/de/ueber-uns` | `AboutUsPage.jsx` |
| Legal | `/es/legales/:slug` | `/en/legal/:slug` | `/it/legale/:slug` | `/de/rechtliches/:slug` | `DynamicLegalPage.jsx` |

**Nota:** Las URLs legacy sin prefijo de idioma (ej: `/experiencias/senderismo`) redirigen automáticamente a la versión con prefijo (`/es/experiencias/senderismo`).

### Componentes principales

| Componente | Descripción |
|---|---|
| `NavbarNew.jsx` | Barra de navegación con logo, selectores de idioma/divisa |
| `Footer.jsx` | Pie de página con links, legal, contacto, redes sociales |
| `VideoHero.jsx` | Hero con video en desktop, imagen estática en móvil |
| `ExperienceSelector.jsx` | Selector de experiencias en el home |
| `PackageCard.jsx` | Tarjeta de paquete con galería, precio, CTA |
| `PackageRecommendations.jsx` | Sección de paquetes destacados con filtros |
| `QuoteModal.jsx` | Formulario de cotización general (2 pasos) |
| `PackageQuoteModal.jsx` | Formulario de cotización específico de paquete |
| `PhotoGalleryModal.jsx` | Lightbox para galerías de fotos |
| `HikingLevelModal.jsx` | Quiz interactivo de nivel de senderismo |
| `OptimizedImage.jsx` | Imagen con lazy loading, prevención de CLS, reintentos |
| `LanguageSwitcher.jsx` | Selector de idioma con banderas |
| `CurrencySelector.jsx` | Selector de divisa (EUR, USD, MXN) |
| `Hreflang.jsx` | Tags meta para SEO internacional |
| `ErrorBoundary.jsx` | Fallback de errores React |

### Integración con Strapi (API Client)

**Archivo:** `src/services/strapiClient.js`

```javascript
// Cliente Axios configurado para Strapi
const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  timeout: 30000,
  paramsSerializer: params => qs.stringify(params, { encode: false })
});
```

**Archivo:** `src/services/api.js` — Funciones de consulta:

| Función | Endpoint Strapi | Descripción |
|---|---|---|
| `getExperiences(season?)` | `/experiences` | Lista de experiencias, filtro opcional por temporada |
| `getExperienceBySlug(slug)` | `/experiences?filters[slug]` | Experiencia por slug |
| `getPackages(filters?)` | `/packages` | Lista de paquetes |
| `getPackageBySlug(slug)` | `/packages?filters[slug]` | Paquete por slug (incluye relaciones) |
| `getFeaturedPackages()` | `/packages?filters[showInHome]` | Paquetes destacados para el home |
| `getHeroSection()` | `/hero-section` | Contenido del hero (single type) |
| `getAboutPage()` | `/about-page` | Contenido de "Nosotros" (single type) |
| `getSiteSettings()` | `/site-setting` | Configuración global del sitio |
| `getSiteTexts()` | `/site-text` | Textos editables de la UI |
| `getLegalPageBySlug(slug)` | `/legal-pages?filters[slug]` | Página legal por slug |

**Archivo:** `src/services/hooks.js` — React Query hooks:

Cada función de `api.js` tiene su hook correspondiente (`useExperiences`, `usePackage`, etc.) con:
- **staleTime:** 5 minutos (general), 30 segundos (single types)
- **gcTime:** 30 minutos (general), 2 minutos (single types)
- **retry:** 2 intentos (general), 0 (single types)
- **Fallback i18n:** Si el contenido no existe en el idioma solicitado, se usa español como fallback

### Paleta de colores (Tailwind)

```javascript
// tailwind.config.js
colors: {
  'grafito': '#1C1C1C',   // Negro principal
  'pizarra': '#374257',   // Azul oscuro secundario
  'alpino':  '#66806C',   // Verde oscuro (acento)
  'bruma':   '#A9BFA7',   // Verde claro (acento)
  'niebla':  '#A3B5B6',   // Azul claro
  'nieve':   '#EFEFE6',   // Fondo claro
}
```

### Tipografía

```javascript
fontFamily: {
  'heading': ['Poppins Bold', 'sans-serif'],  // Títulos
  'body':    ['Poppins', 'sans-serif'],        // Texto general
  'mono':    ['IBM Plex Mono', 'monospace'],   // Citas, meta
}
```

---

## 6. Backend (Strapi) — Detalle Técnico

### Estructura del proyecto

```
dolovibes-backend/
├── config/
│   ├── admin.ts           # JWT, tokens, encriptación
│   ├── database.ts        # Soporte multi-DB (SQLite/PostgreSQL/MySQL)
│   ├── middlewares.ts      # CORS, seguridad, compresión, caché
│   ├── plugins.ts          # i18n, upload (Cloudinary)
│   └── server.ts           # Host, puerto, URL pública
├── src/
│   ├── admin/
│   │   ├── app.tsx         # Personalización del panel admin
│   │   └── components/
│   │       └── TranslateButton.tsx  # Botón de traducción automática
│   ├── api/
│   │   ├── experience/     # Collection Type: Experiencias
│   │   ├── package/        # Collection Type: Paquetes
│   │   ├── legal-page/     # Collection Type: Páginas legales
│   │   ├── site-setting/   # Single Type: Configuración del sitio
│   │   ├── hero-section/   # Single Type: Sección hero
│   │   ├── about-page/     # Single Type: Página "Nosotros"
│   │   ├── site-text/      # Single Type: Textos de la UI
│   │   ├── auto-translate/ # API personalizada: Traducción automática
│   │   └── quote-request/  # API personalizada: Cotizaciones por email
│   ├── components/
│   │   ├── package/        # Componentes de paquete (itinerario, galería, etc.)
│   │   └── shared/         # Componentes compartidos (SEO, tags, text-block)
│   └── middlewares/
│       ├── cache-control.ts  # Caché HTTP por tipo de recurso
│       └── compression.ts    # Compresión gzip/deflate
├── .env                    # Variables de entorno (NO commitear)
├── .env.example            # Plantilla de variables
└── package.json
```

### Configuración de la base de datos

**Archivo:** `config/database.ts`

- **Producción:** PostgreSQL en Railway (`nozomi.proxy.rlwy.net`)
- **Desarrollo:** SQLite local (`.tmp/data.db`)
- Pool de conexiones: min 2, max 10
- Soporte SSL configurable

### Configuración de plugins

**Archivo:** `config/plugins.ts`

**i18n:**
- Locales: `es` (default), `en`, `it`, `de`

**Upload (Cloudinary):**
- Proveedor dinámico: Cloudinary en producción, local en desarrollo
- Límite de archivo: 250 MB (para videos grandes)
- Breakpoints responsivos: xlarge (1920), large (1000), medium (750), small (500), xsmall (64)

---

## 7. Tipos de Contenido y Esquemas

### Collection Types

#### Experiencia (`api::experience.experience`)

Representa una actividad o categoría de aventura (ej: Senderismo, Alpinismo).

| Campo | Tipo | Requerido | Localizado | Notas |
|---|---|---|---|---|
| `title` | String | Sí | Sí | Nombre de la experiencia |
| `slug` | UID | Sí | Sí | Generado desde `title` |
| `season` | Enum | Sí | No | `"summer"` o `"winter"` |
| `thumbnail` | Media (imagen) | Sí | No | Imagen para tarjetas |
| `heroImage` | Media (imagen) | No | No | Imagen de fondo hero |
| `longDescription` | Blocks | Sí | Sí | Descripción rica |
| `packages` | Relación | — | — | oneToMany → Package |
| `seo` | Componente | — | Sí | `shared.seo` |
| `displayOrder` | Integer | — | No | Orden de visualización |
| `footerDisplayOrder` | Integer | — | No | Orden en el footer |
| `showInFooter` | Boolean | — | No | Default: `true` |

#### Paquete (`api::package.package`)

Representa un paquete turístico con itinerario, precios y detalles completos.

| Campo | Tipo | Requerido | Localizado | Notas |
|---|---|---|---|---|
| `title` | String | Sí | Sí | Nombre del paquete |
| `slug` | UID | Sí | Sí | Generado desde `title` |
| `experience` | Relación | — | — | manyToOne → Experience |
| `thumbnail` | Media (imagen) | Sí | No | Imagen de tarjeta |
| `heroImage` | Media (imagen) | No | No | Imagen hero |
| `description` | Blocks | Sí | Sí | Descripción rica |
| `location` | String | Sí | Sí | Ubicación |
| `duration` | String | Sí | Sí | Duración (ej: "3 días / 2 noches") |
| `difficulty` | String | No | Sí | Nivel de dificultad |
| `groupSize` | String | No | Sí | Tamaño del grupo |
| `guideType` | String | No | Sí | Tipo de guía |
| `availableDates` | String | No | Sí | Fechas disponibles |
| `season` | Enum | Sí | No | `"summer"` o `"winter"` |
| `priceAmount` | Integer | Sí | No | Precio en EUR (min: 0) |
| `originalPriceAmount` | Integer | No | No | Precio original (para descuentos) |
| `hasDiscount` | Boolean | — | No | Default: `false` |
| `rating` | Decimal | — | No | 0–5, default: 5 |
| `tags` | Componente[] | — | Sí | Repetible: `shared.tag` |
| `itinerary` | Componente[] | Sí | Sí | Repetible: `package.itinerary-day` |
| `includes` | Componente[] | — | Sí | Repetible: `package.whats-included` |
| `notIncludes` | Componente[] | — | Sí | Repetible: `package.whats-not-included` |
| `additionalInfo` | Componente[] | — | Sí | Repetible: `package.additional-info-item` |
| `additionalServices` | Componente[] | — | Sí | Repetible: `package.additional-service-item` |
| `gallery` | Componente[] | — | Sí | Repetible: `package.gallery-image` |
| `mapImage` | Media (imagen) | No | No | Mapa del paquete |
| `startDates` | Componente[] | — | No | Repetible: `package.start-date` |
| `seo` | Componente | — | Sí | `shared.seo` |
| `showInHome` | Boolean | — | No | Mostrar en home. Default: `false` |
| `homeDisplayOrder` | Integer | — | No | Orden en el home |
| `displayOrder` | Integer | — | No | Orden general |

#### Página Legal (`api::legal-page.legal-page`)

Páginas legales dinámicas (privacidad, términos, etc.).

| Campo | Tipo | Requerido | Localizado | Notas |
|---|---|---|---|---|
| `title` | String | Sí | Sí | Título de la página |
| `slug` | UID | Sí | Sí | Generado desde `title` |
| `content` | Blocks | Sí | Sí | Contenido legal |
| `showInFooter` | Boolean | — | No | Mostrar en footer. Default: `false` |
| `footerDisplayOrder` | Integer | — | No | Orden en el footer |

### Single Types

#### Configuración del Sitio (`api::site-setting.site-setting`)

| Campo | Tipo | Localizado | Notas |
|---|---|---|---|
| `siteName` | String | No | Default: "Dolovibes" |
| `logo` / `logoDark` / `favicon` | Media | No | Imágenes de marca |
| `location` | String | Sí | Ubicación de la empresa |
| `phone` / `email` / `whatsappNumber` | String | No | Datos de contacto |
| `instagramUrl` / `facebookUrl` / `tiktokUrl` | String | No | Redes sociales |
| `footerDescription` | Text | Sí | Descripción del footer |
| `copyrightText` | String | Sí | Texto de copyright |
| `enableLanguageEn` / `enableLanguageIt` / `enableLanguageDe` | Boolean | No | Toggle de idiomas |
| `enableCurrencyUsd` / `enableCurrencyMxn` | Boolean | No | Toggle de divisas |

#### Hero Section (`api::hero-section.hero-section`)

| Campo | Tipo | Localizado | Notas |
|---|---|---|---|
| `title` | String | Sí | Título principal |
| `titleHighlight` | String | Sí | Texto destacado del título |
| `subtitle` | Text | Sí | Subtítulo |
| `videoDesktop` | Media (video) | No | Video del hero (desktop) |
| `imageMobile` | Media (imagen) | No | Imagen hero (móvil) |

#### About Page (`api::about-page.about-page`)

| Campo | Tipo | Localizado | Notas |
|---|---|---|---|
| `pageTitle` | String | Sí | Título de la página |
| `mainPhoto` | Media | No | Foto principal |
| `photoAlt` | String | Sí | Alt text de la foto |
| `origin` / `essence` / `vision` / `mission` | Componente | Sí | `shared.text-block` |
| `seo` | Componente | Sí | `shared.seo` |

#### Site Texts (`api::site-text.site-text`)

Single type con **150+ campos de texto** que controlan toda la interfaz del sitio: navegación, footer, formularios, modales, etiquetas de paquetes, cuestionario de nivel, etc. Todos localizados.

---

## 8. Componentes Reutilizables (Strapi)

### Componentes compartidos (`src/components/shared/`)

| Componente | Campos | Uso |
|---|---|---|
| `shared.seo` | `metaTitle` (string, max 60), `metaDescription` (text, max 160), `shareImage` (media), `keywords` (string) | Meta tags SEO en cada página |
| `shared.text-block` | `title` (string), `content` (blocks) | Secciones de texto en About page |
| `shared.tag` | `name` (string) | Etiquetas de paquetes |

### Componentes de paquete (`src/components/package/`)

| Componente | Campos | Uso |
|---|---|---|
| `package.itinerary-day` | `day` (int), `title` (string), `description` (blocks), `image` (media) | Días del itinerario |
| `package.whats-included` | `label` (string), `detail` (blocks) | Lista "qué incluye" |
| `package.whats-not-included` | `label` (string), `detail` (blocks) | Lista "qué no incluye" |
| `package.additional-info-item` | `label` (string), `detail` (blocks) | Información adicional |
| `package.additional-service-item` | `label` (string), `detail` (blocks) | Servicios adicionales |
| `package.gallery-image` | `image` (media), `caption` (string, localizado) | Imágenes de galería |
| `package.start-date` | `date` (date), `displayText` (string), `available` (boolean) | Fechas de salida |

---

## 9. APIs Personalizadas

### Auto-Translate API

**Ruta:** `POST /api/auto-translate`
**Autenticación:** JWT de admin (verificación manual del token)

**Parámetros del body:**

```json
{
  "contentType": "api::package.package",  // UID del content type (requerido)
  "documentId": "abc123",                 // ID del documento (opcional para single types)
  "sourceLocale": "es",                   // Idioma origen (default: "es")
  "targetLocales": ["en", "it", "de"],    // Idiomas destino (opcional, todos si se omite)
  "autoPublish": true,                    // Publicar tras traducir
  "fields": ["title", "description"]      // Campos específicos (opcional, todos si se omite)
}
```

**Comportamiento:**
- Extrae recursivamente texto de campos string, blocks, componentes y zonas dinámicas
- Preserva campos de media (extrae IDs de archivos para mantener las imágenes)
- Genera slugs automáticos desde títulos traducidos
- Mapeo de locales DeepL: `es` → `es`, `en` → `en-US`, `it` → `it`, `de` → `de`
- Devuelve estado éxito/error por cada locale

**Integración UI:** Botón "Traducir" en el panel admin (solo visible para documentos existentes en español). Archivo: `src/admin/components/TranslateButton.tsx`

### Quote Request API

**Ruta:** `POST /api/quote-request`
**Autenticación:** Ninguna (endpoint público)

**Parámetros del body:**

```json
{
  "type": "quote" | "package",
  "data": {
    "fullName": "string",
    "email": "string (validado)",
    "phone": "string",
    "contactMethod": "whatsapp" | "telefono" | "correo",
    // ... campos adicionales según type
  }
}
```

**Comportamiento:**
- Valida email, longitud de strings y valores de enums
- Sanitiza inputs (HTML escaping)
- Genera email HTML con template profesional
- Envía email vía Resend al destinatario configurado en Site Settings (o fallback a `EMAIL_RECIPIENT` env)
- Dos templates: cotización general y cotización de paquete

---

## 10. Internacionalización (i18n)

### Backend (Strapi)

- Plugin `i18n` habilitado con 4 locales: `es` (default), `en`, `it`, `de`
- Los campos marcados como "localized" tienen versiones independientes por idioma
- Los campos no localizados se comparten entre idiomas

### Frontend

- **Librería:** i18next + react-i18next
- **Detección de idioma:** URL prefix → localStorage → navigator.language → fallback `es`
- **Archivos de traducción:** `/public/locales/{lang}/{namespace}.json`
- **8 namespaces:** common, home, about, experiences, packageInfo, quoteForm, hikingLevel, legal

**Prioridad de textos:**
1. Strapi (Site Texts) — editable desde el CMS
2. i18next (JSON) — fallback hardcoded

**Fallback de contenido:** Si un contenido no existe en el idioma solicitado, el frontend obtiene automáticamente la versión en español y la enriquece con las imágenes de la versión española.

---

## 11. Sistema de Divisas

**Archivo principal:** `src/utils/currency.jsx`

| Divisa | Símbolo | Posición | Locale de formato |
|---|---|---|---|
| EUR | € | Después | de-DE |
| USD | $ | Antes | en-US |
| MXN | $ | Antes | es-MX |

**Fuente de tipos de cambio:** [exchangerate-api.com](https://exchangerate-api.com)
**Endpoint:** `https://v6.exchangerate-api.com/v6/{KEY}/latest/EUR`

**Caché por capas:**
1. Memoria: 6 horas
2. localStorage: 24 horas
3. Fallback hardcoded: `{ EUR: 1, USD: 1.04, MXN: 20.85 }`

**Auto-detección de divisa:**
1. Preferencia guardada del usuario
2. Geolocalización por IP (ipapi.co, caché 7 días)
3. Idioma del navegador
4. Default: EUR

---

## 12. Gestión de Medios (Cloudinary)

**Proveedor:** Cloudinary
**Cloud name:** `dn8pprext`
**Cuenta:** info@dolo-vibes.com

**Configuración en Strapi (`config/plugins.ts`):**
- Solo activo en producción (`NODE_ENV === 'production'`)
- En desarrollo se usa almacenamiento local
- Breakpoints responsivos generados automáticamente: 1920, 1000, 750, 500, 64px
- Límite de subida: 250 MB

**En el frontend:**
- Las URLs de Cloudinary se consumen directamente desde los campos de media de Strapi
- El componente `OptimizedImage.jsx` maneja lazy loading, prevención de CLS y reintentos

---

## 13. Sistema de Email (Resend)

**Proveedor:** [Resend](https://resend.com)
**Cuenta:** info@dolo-vibes.com

**Uso:** Envío de emails de cotización (quote requests) cuando un usuario llena el formulario del sitio.

**Configuración:**
- `RESEND_API_KEY` — API key de Resend
- `EMAIL_FROM` — Dirección del remitente
- `EMAIL_RECIPIENT` — Dirección del destinatario (fallback si no está en Site Settings)

**Templates:**
1. **Cotización general:** Nombre, email, teléfono, interés, fecha, huéspedes, notas, método de contacto preferido
2. **Cotización de paquete:** Nombre, ubicación, email, teléfono, mes de viaje, viajeros, tipo de viaje, título del paquete, servicios adicionales

---

## 14. Traducciones Automáticas (DeepL)

**Proveedor:** [DeepL](https://www.deepl.com)
**Cuenta:** info@dolo-vibes.com
**SDK:** `deepl-node` v1.24.0

**Flujo:**
1. El administrador crea/edita contenido en español en el panel admin
2. Hace clic en el botón "Traducir" (visible solo en locale ES)
3. El sistema traduce automáticamente a EN, IT y DE vía DeepL API
4. Los campos de media se preservan (no se traducen)
5. Los slugs se generan automáticamente desde los títulos traducidos
6. El contenido traducido se publica automáticamente
7. La página del admin se recarga tras 1.5 segundos

**Archivo del botón:** `src/admin/components/TranslateButton.tsx`
**Archivo del servicio:** `src/api/auto-translate/services/auto-translate.ts`

---

## 15. SEO

### Frontend

- **Meta tags dinámicos:** Hook `usePageMeta(title, description)` actualiza `<title>` y `<meta description>`
- **Formato de título:** `{título de página} | DoloVibes`
- **Hreflang:** Componente `Hreflang.jsx` genera tags `<link rel="alternate">` para cada idioma + `x-default`
- **Canonical:** Tag `<link rel="canonical">` para la URL actual
- **SEO por contenido:** Cada experiencia, paquete y página legal tiene un componente SEO (`shared.seo`) con metaTitle, metaDescription, shareImage y keywords

### Pendiente

- No hay `robots.txt` en el repositorio frontend (se recomienda agregar)
- No hay generación automática de `sitemap.xml` (se recomienda implementar)

---

## 16. Variables de Entorno

### Backend (`.env`)

#### Seguridad y autenticación
| Variable | Descripción |
|---|---|
| `ADMIN_JWT_SECRET` | Secreto JWT para autenticación del admin |
| `API_TOKEN_SALT` | Salt para generación de API tokens |
| `APP_KEYS` | Claves de encriptación (separadas por coma) |
| `JWT_SECRET` | Secreto para firma JWT |
| `TRANSFER_TOKEN_SALT` | Salt para tokens de transferencia de datos |
| `ENCRYPTION_KEY` | Clave de encriptación general |

#### Base de datos
| Variable | Descripción |
|---|---|
| `DATABASE_CLIENT` | Cliente de BD: `sqlite`, `postgres`, `mysql` |
| `DATABASE_HOST` | Host del servidor de BD |
| `DATABASE_PORT` | Puerto de la BD |
| `DATABASE_NAME` | Nombre de la BD |
| `DATABASE_USERNAME` | Usuario de la BD |
| `DATABASE_PASSWORD` | Contraseña de la BD |
| `DATABASE_SSL` | Habilitar SSL: `true` / `false` |

#### Servidor
| Variable | Descripción |
|---|---|
| `HOST` | Host del servidor (default: `0.0.0.0`) |
| `PORT` | Puerto del servidor (default: `1337`) |
| `NODE_ENV` | Entorno: `development` / `production` |
| `PUBLIC_URL` | URL pública del backend |
| `FRONTEND_URL` | URL del frontend (para CORS) |

#### Servicios externos
| Variable | Descripción |
|---|---|
| `CLOUDINARY_NAME` | Cloud name de Cloudinary |
| `CLOUDINARY_KEY` | API key de Cloudinary |
| `CLOUDINARY_SECRET` | API secret de Cloudinary |
| `RESEND_API_KEY` | API key de Resend |
| `EMAIL_FROM` | Email del remitente |
| `EMAIL_RECIPIENT` | Email del destinatario de cotizaciones |
| `DEEPL_API_KEY` | API key de DeepL |

### Frontend (`.env.local`)

| Variable | Descripción |
|---|---|
| `NODE_ENV` | Entorno: `development` / `production` |
| `VITE_STRAPI_URL` | URL del backend Strapi |
| `VITE_USE_STRAPI` | Habilitar integración con Strapi: `true` / `false` |
| `VITE_EXCHANGE_RATE_API_KEY` | API key de ExchangeRate API |

---

## 17. Configuración de Despliegue

### Frontend → Vercel

**Archivo:** `vercel.json`

- **SPA Rewrite:** Todas las rutas redirigen a `/index.html` (React Router maneja el routing)
- **Caché de assets:** 1 año, immutable (archivos con hash en el nombre)
- **Caché de locales (i18n):** 1 hora
- **Caché de videos:** 7 días
- **Headers de seguridad:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`

**Build:**
- Vite genera chunks optimizados con code splitting manual:
  - `react-vendor` (React + ReactDOM)
  - `router` (React Router)
  - `query` (React Query)
  - `i18n` (i18next)
  - `icons` (Lucide React)
- Compresión gzip + brotli habilitada
- Minificación con Terser
- Target: ES2020
- Sin sourcemaps en producción

**Despliegue automático:** Push a `main` → Vercel detecta el cambio y despliega automáticamente.

### Backend → Railway

- **No se encontró `Dockerfile` ni `railway.toml`** en el repositorio — Railway detecta automáticamente el proyecto Node.js
- **Base de datos:** PostgreSQL provisto por Railway en el mismo proyecto
- **Host interno:** `nozomi.proxy.rlwy.net` (Railway proxy)
- **Despliegue automático:** Push a `main` → Railway detecta y despliega

---

## 18. Configuración de DNS y Dominios

**Registrador:** GoDaddy
**Dominio:** `dolo-vibes.com`
**Cuenta:** info@dolo-vibes.com

| Registro | Tipo | Apunta a | Propósito |
|---|---|---|---|
| `www.dolo-vibes.com` | CNAME | Vercel | Frontend |
| `api.dolo-vibes.com` | CNAME | Railway | Backend / CMS |

**Nota importante:** La renovación del dominio en GoDaddy es crítica. Si el dominio expira, tanto el frontend como el backend dejan de ser accesibles.

---

## 19. Middlewares Personalizados

### Cache Control (`src/middlewares/cache-control.ts`)

Establece headers HTTP de caché según el tipo de recurso:

| Recurso | Cache-Control |
|---|---|
| Panel admin | `no-store, no-cache, must-revalidate` |
| Uploads/media | `public, max-age=31536000, immutable` (1 año) |
| Single types (hero, about, settings, texts) | `max-age=60, stale-while-revalidate=300` |
| Collections (experiences, packages) | `max-age=120, stale-while-revalidate=600` |
| Otros endpoints API | `max-age=30, stale-while-revalidate=120` |
| Assets estáticos (.js, .css, fonts, .svg) | `max-age=31536000, immutable` |

### Compression (`src/middlewares/compression.ts`)

- Compresión gzip/deflate usando zlib
- Solo para GET/HEAD con respuestas 2xx
- Tipos comprimibles: JSON, HTML, CSS, JS, XML, SVG, texto plano
- Tamaño mínimo: 1 KB

### CORS (`config/middlewares.ts`)

Orígenes permitidos:
- `http://localhost:5173` (desarrollo)
- `http://localhost:3000` (desarrollo alternativo)
- `https://dolovibes.vercel.app` (Vercel)
- URL de preview de Vercel (dinámica)

Métodos: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
Credenciales: habilitadas

---

## 20. Consideraciones de Mantenimiento

### Backups

- **Base de datos:** Railway ofrece backups automáticos en planes de pago. En el plan gratuito, se recomienda hacer backups manuales periódicos con `pg_dump`.
- **Medios:** Las imágenes en Cloudinary son persistentes y tienen su propio sistema de redundancia.
- **Código:** Versionado en GitHub — el historial de commits funciona como backup del código.

### Renovación de API Keys

| Servicio | Vencimiento | Acción |
|---|---|---|
| DeepL | Depende del plan | Verificar uso mensual en dashboard |
| Resend | Sin vencimiento automático | Verificar que los emails sigan enviándose |
| ExchangeRate API | Plan gratuito: 1,500 req/mes | Monitorear consumo |
| Cloudinary | Plan gratuito: 25 créditos/mes | Monitorear almacenamiento |

### Actualizaciones

- **Strapi:** Revisar la guía de actualización oficial antes de actualizar versiones mayores. Las actualizaciones de Strapi v5 requieren atención especial en migraciones de base de datos.
- **Node.js:** El proyecto requiere Node 20.11.0 (especificado en `.nvmrc`). Mantener dentro de la rama LTS 20.x.
- **Dependencias frontend:** Ejecutar `npm audit` periódicamente para parches de seguridad.

### Escalabilidad

- **Railway:** El plan gratuito tiene límites de CPU, RAM y horas de ejecución. Si el sitio experimenta tráfico alto o lentitud, se debe considerar un plan de pago.
- **Cloudinary:** El plan gratuito permite 25 créditos mensuales. Si se suben muchas imágenes/videos, considerar un plan de pago.
- **ExchangeRate API:** 1,500 peticiones/mes en el plan gratuito. Con caché de 24h en el frontend, esto debería ser suficiente para tráfico moderado.

### Seguridad

- Los headers de seguridad están configurados tanto en Vercel (`vercel.json`) como en Strapi (`middlewares.ts`)
- CSP configurado para permitir imágenes solo de Cloudinary y dominios de Strapi
- CORS restringido a dominios conocidos
- Los formularios sanitizan HTML en inputs del usuario
- Las API keys y secretos **nunca** deben commitarse al repositorio — usar variables de entorno

---

*Documento generado el 22 de febrero de 2026 — Basado en revisión exhaustiva de los repositorios `dolovibes-frontend` y `dolovibes-backend`.*

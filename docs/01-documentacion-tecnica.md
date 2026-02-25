# 📘 Documentación Técnica — Dolo Vibes

> **Versión:** 1.0 &nbsp;|&nbsp; **Fecha:** Febrero 2026 &nbsp;|&nbsp; **Audiencia:** Desarrolladores y consultorías de mantenimiento

| | |
|---|---|
| **Sitio web** | [www.dolo-vibes.com](https://www.dolo-vibes.com) |
| **CMS Admin** | [api.dolo-vibes.com/admin](https://api.dolo-vibes.com/admin) |
| **Repositorios** | [github.com/dolovibes](https://github.com/dolovibes) |

---

## 📑 Tabla de Contenidos

| # | Sección | Página |
|---|---------|--------|
| 1 | [Visión General del Proyecto](#1--visión-general-del-proyecto) | — |
| 2 | [Arquitectura del Sistema](#2--arquitectura-del-sistema) | — |
| 3 | [Stack Tecnológico](#3--stack-tecnológico) | — |
| 4 | [Repositorios y Control de Versiones](#4--repositorios-y-control-de-versiones) | — |
| 5 | [Frontend — Detalle Técnico](#5--frontend--detalle-técnico) | — |
| 6 | [Backend (Strapi) — Detalle Técnico](#6--backend-strapi--detalle-técnico) | — |
| 7 | [Tipos de Contenido y Esquemas](#7--tipos-de-contenido-y-esquemas) | — |
| 8 | [Componentes Reutilizables (Strapi)](#8--componentes-reutilizables-strapi) | — |
| 9 | [APIs Personalizadas](#9--apis-personalizadas) | — |
| 10 | [Internacionalización (i18n)](#10--internacionalización-i18n) | — |
| 11 | [Sistema de Divisas](#11--sistema-de-divisas) | — |
| 12 | [Gestión de Medios (Cloudinary)](#12--gestión-de-medios-cloudinary) | — |
| 13 | [Sistema de Email (Resend)](#13--sistema-de-email-resend) | — |
| 14 | [Traducciones Automáticas (DeepL)](#14--traducciones-automáticas-deepl) | — |
| 15 | [SEO](#15--seo) | — |
| 16 | [Variables de Entorno](#16--variables-de-entorno) | — |
| 17 | [Configuración de Despliegue](#17--configuración-de-despliegue) | — |
| 18 | [Configuración de DNS y Dominios](#18--configuración-de-dns-y-dominios) | — |
| 19 | [Middlewares Personalizados](#19--middlewares-personalizados) | — |
| 20 | [Consideraciones de Mantenimiento](#20--consideraciones-de-mantenimiento) | — |

---

## 1. 🌐 Visión General del Proyecto

Dolo Vibes es un sitio web de **turismo de aventura** que ofrece experiencias y paquetes de senderismo, alpinismo y actividades de montaña.

### Características principales

| Característica | Detalle |
|---|---|
| Idiomas soportados | Español (base), Inglés, Italiano, Alemán |
| Divisas soportadas | EUR (base), USD, MXN |
| Traducción automática | DeepL API desde el panel admin |
| Email transaccional | Resend (cotizaciones) |
| Almacenamiento de medios | Cloudinary |
| Modelo de negocio | Cotizaciones por formulario — sin carrito ni pasarela de pago |

### Funcionalidades implementadas

- ✅ Catálogo de experiencias por temporada (verano/invierno)
- ✅ Paquetes con itinerarios, galería, precios y fechas
- ✅ Formularios de cotización (general + por paquete)
- ✅ Cuestionario interactivo de nivel de senderismo
- ✅ Páginas legales dinámicas desde el CMS
- ✅ SEO internacional (hreflang, meta tags, URLs localizadas)
- ✅ Compresión gzip/brotli y code splitting

### No implementado

- ❌ Autenticación / Login de usuarios
- ❌ Carrito de compras / Checkout
- ❌ Pasarela de pago
- ❌ Cuentas de usuario

---

## 2. 🏗️ Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USUARIO                                    │
│                      (Navegador Web)                                 │
└──────────────┬───────────────────────────────────┬───────────────────┘
               │                                   │
               ▼                                   ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│   ☁️  VERCEL (Frontend)   │         │  💱 exchangerate-api.com  │
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
│   🚂 RAILWAY (Backend)   │──────▶│  🖼️  CLOUDINARY           │
│   api.dolo-vibes.com     │       │  (Imágenes y videos)     │
│                          │       │  Cloud: dn8pprext        │
│  Strapi v5.35            │       └──────────────────────────┘
│  Node.js 20.11           │
│  TypeScript              │       ┌──────────────────────────┐
│                          │──────▶│  📧 RESEND               │
│  ┌────────────────────┐  │       │  (Emails transaccionales)│
│  │ 🐘 PostgreSQL      │  │       └──────────────────────────┘
│  │ (Railway)          │  │
│  └────────────────────┘  │       ┌──────────────────────────┐
│                          │──────▶│  🌍 DeepL API            │
└──────────────────────────┘       │  (Traducción automática) │
                                   └──────────────────────────┘
```

### Flujo de datos

| # | Paso | Detalle |
|---|------|---------|
| 1 | Usuario accede al sitio | `www.dolo-vibes.com` → Vercel sirve la SPA (React) |
| 2 | Frontend consulta contenido | Peticiones REST a `api.dolo-vibes.com/api/*` → Strapi |
| 3 | Strapi responde | Consulta PostgreSQL y devuelve JSON |
| 4 | Imágenes se sirven | Desde Cloudinary (producción) |
| 5 | Cotizaciones | Formulario → Backend → Email vía Resend |
| 6 | Traducciones | Botón "Traducir" en admin → DeepL API |
| 7 | Conversión de divisas | Frontend directo contra exchangerate-api.com |

---

## 3. ⚙️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | 19.2.3 | Framework UI |
| **Vite** | 7.2.4 | Build tool y dev server |
| **React Router** | 7.10.1 | Enrutamiento con prefijo de idioma |
| **React Query** (TanStack) | 5.90.16 | Estado del servidor, caché y fetching |
| **Axios** | 1.13.2 | Cliente HTTP para la API de Strapi |
| **i18next** | 25.7.2 | Internacionalización de la UI |
| **Tailwind CSS** | 3.4.1 | Framework de estilos |
| **Lucide React** | 0.555.0 | Iconografía |
| **Terser** | 5.46.0 | Minificación de producción |

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| **Strapi** | 5.35.0 | CMS headless |
| **Node.js** | 20.11.0 | Runtime (definido en `.nvmrc`) |
| **TypeScript** | 5.x | Tipado del backend |
| **PostgreSQL** | — | Base de datos (producción) |
| **SQLite** | — | Base de datos (desarrollo) |
| **Sharp** | 0.34.5 | Procesamiento de imágenes |
| **deepl-node** | 1.24.0 | SDK de DeepL para traducciones |
| **Resend** | 6.9.1 | SDK para envío de emails |

---

## 4. 📂 Repositorios y Control de Versiones

| Campo | Detalle |
|---|---|
| **Plataforma** | GitHub |
| **Organización** | [github.com/dolovibes](https://github.com/dolovibes) |
| **Cuenta** | info@dolo-vibes.com |

| Repositorio | Contenido |
|---|---|
| `dolovibes-frontend` | Aplicación React (SPA) |
| `dolovibes-backend` | Strapi CMS + APIs personalizadas |

**Ramas principales:**
- `main` — Producción. Despliegues automáticos en Vercel y Railway al hacer push.
- `integracion-strapi` — Desarrollo/integración activa.

---

## 5. 🖥️ Frontend — Detalle Técnico

### Estructura del proyecto

```
dolovibes-frontend/
├── 📁 public/
│   ├── 📁 locales/           ← Archivos de traducción JSON (es, en, it, de)
│   │   ├── es/               ← 8 namespaces por idioma
│   │   ├── en/
│   │   ├── it/
│   │   └── de/
│   ├── 📁 videos/            ← Videos estáticos (hero)
│   └── 📁 favicon/
├── 📁 src/
│   ├── 📁 assets/            ← Imágenes estáticas
│   ├── 📁 components/        ← ~15 componentes reutilizables
│   ├── 📁 contexts/          ← React Contexts (Currency, SiteTexts)
│   ├── 📁 hooks/             ← Hooks personalizados
│   ├── 📁 locales/           ← Archivos i18n auxiliares
│   ├── 📁 pages/             ← 5 páginas principales
│   ├── 📁 services/          ← API client, hooks de datos
│   ├── 📁 utils/             ← Utilidades (currency, rutas, etc.)
│   ├── App.jsx               ← Componente raíz con rutas
│   ├── main.jsx              ← Punto de entrada (Vite)
│   ├── i18n.js               ← Configuración de i18next
│   └── index.css             ← Estilos globales + Tailwind
├── tailwind.config.js        ← Paleta de colores y tipografía
├── vite.config.js            ← Build, chunking y compresión
├── vercel.json               ← Rewrites, headers y caché
└── package.json
```

### Páginas y Rutas

> ℹ️ **NOTA:** Todas las rutas usan prefijo de idioma: `/:lang/...`

| Página | ES | EN | IT | DE | Componente |
|---|---|---|---|---|---|
| **Inicio** | `/:lang/` | `/:lang/` | `/:lang/` | `/:lang/` | `HomePage.jsx` |
| **Experiencia** | `/es/experiencias/:slug` | `/en/experiences/:slug` | `/it/esperienze/:slug` | `/de/erlebnisse/:slug` | `ExperiencePage.jsx` |
| **Paquete** | `/es/paquetes/:slug` | `/en/packages/:slug` | `/it/pacchetti/:slug` | `/de/pakete/:slug` | `PackageInfoPage.jsx` |
| **Nosotros** | `/es/nosotros` | `/en/about` | `/it/chi-siamo` | `/de/ueber-uns` | `AboutUsPage.jsx` |
| **Legal** | `/es/legales/:slug` | `/en/legal/:slug` | `/it/legale/:slug` | `/de/rechtliches/:slug` | `DynamicLegalPage.jsx` |

> ℹ️ **NOTA:** Las URLs legacy sin prefijo de idioma redirigen automáticamente a la versión con prefijo.

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
const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  timeout: 30000,
  paramsSerializer: params => qs.stringify(params, { encode: false })
});
```

**Archivo:** `src/services/api.js`

| Función | Endpoint | Descripción |
|---|---|---|
| `getExperiences(season?)` | `/experiences` | Lista de experiencias |
| `getExperienceBySlug(slug)` | `/experiences?filters[slug]` | Experiencia por slug |
| `getPackages(filters?)` | `/packages` | Lista de paquetes |
| `getPackageBySlug(slug)` | `/packages?filters[slug]` | Paquete por slug |
| `getFeaturedPackages()` | `/packages?filters[showInHome]` | Paquetes destacados |
| `getHeroSection()` | `/hero-section` | Contenido del hero |
| `getAboutPage()` | `/about-page` | Contenido de "Nosotros" |
| `getSiteSettings()` | `/site-setting` | Configuración global |
| `getSiteTexts()` | `/site-text` | Textos editables de la UI |
| `getLegalPageBySlug(slug)` | `/legal-pages?filters[slug]` | Página legal por slug |

**Archivo:** `src/services/hooks.js` — React Query hooks con caché:

| Configuración | General | Single Types |
|---|---|---|
| **staleTime** | 5 minutos | 30 segundos |
| **gcTime** | 30 minutos | 2 minutos |
| **retry** | 2 intentos | 0 |
| **refetchOnWindowFocus** | false | true |

### Paleta de colores y tipografía

| Color | Hex | Nombre | Uso |
|---|---|---|---|
| ⬛ | `#1C1C1C` | Grafito | Negro principal |
| 🔵 | `#374257` | Pizarra | Azul oscuro secundario |
| 🟢 | `#66806C` | Alpino | Verde oscuro (acento) |
| 🟩 | `#A9BFA7` | Bruma | Verde claro (acento) |
| 🔷 | `#A3B5B6` | Niebla | Azul claro |
| ⬜ | `#EFEFE6` | Nieve | Fondo claro |

| Fuente | Familia | Uso |
|---|---|---|
| **Poppins Bold** | sans-serif | Títulos (h1, h2, h3) |
| **Poppins** | sans-serif | Texto general |
| **IBM Plex Mono** | monospace | Citas, meta |

---

## 6. 🗄️ Backend (Strapi) — Detalle Técnico

### Estructura del proyecto

```
dolovibes-backend/
├── 📁 config/
│   ├── admin.ts              ← JWT, tokens, encriptación
│   ├── database.ts           ← Soporte multi-DB (SQLite/PostgreSQL/MySQL)
│   ├── middlewares.ts         ← CORS, seguridad, compresión, caché
│   ├── plugins.ts             ← i18n, upload (Cloudinary)
│   └── server.ts              ← Host, puerto, URL pública
├── 📁 src/
│   ├── 📁 admin/
│   │   ├── app.tsx            ← Personalización del panel admin
│   │   └── 📁 components/
│   │       └── TranslateButton.tsx  ← Botón de traducción automática
│   ├── 📁 api/
│   │   ├── 📁 experience/     ← Collection Type: Experiencias
│   │   ├── 📁 package/        ← Collection Type: Paquetes
│   │   ├── 📁 legal-page/     ← Collection Type: Páginas legales
│   │   ├── 📁 site-setting/   ← Single Type: Configuración
│   │   ├── 📁 hero-section/   ← Single Type: Sección hero
│   │   ├── 📁 about-page/     ← Single Type: Página "Nosotros"
│   │   ├── 📁 site-text/      ← Single Type: Textos de la UI
│   │   ├── 📁 auto-translate/ ← API custom: Traducción automática
│   │   └── 📁 quote-request/  ← API custom: Cotizaciones por email
│   ├── 📁 components/
│   │   ├── 📁 package/        ← Componentes de paquete
│   │   └── 📁 shared/         ← Componentes compartidos (SEO, tags)
│   └── 📁 middlewares/
│       ├── cache-control.ts   ← Caché HTTP por tipo de recurso
│       └── compression.ts     ← Compresión gzip/deflate
├── .env                       ← Variables de entorno (NO commitear)
├── .env.example               ← Plantilla de variables
└── package.json
```

### Configuración de la base de datos

| Entorno | Motor | Detalle |
|---|---|---|
| **Producción** | PostgreSQL | Railway (`nozomi.proxy.rlwy.net`), pool min 2 / max 10 |
| **Desarrollo** | SQLite | Local (`.tmp/data.db`) |

### Plugins configurados

| Plugin | Configuración |
|---|---|
| **i18n** | Locales: `es` (default), `en`, `it`, `de` |
| **Upload** | Cloudinary en producción, local en desarrollo. Límite: 250 MB. Breakpoints: 1920, 1000, 750, 500, 64px |

---

## 7. 📋 Tipos de Contenido y Esquemas

### Collection Types

#### 🏔️ Experiencia (`api::experience.experience`)

> Categoría de actividad de aventura (ej: Senderismo, Alpinismo).

| Campo | Tipo | Req. | Loc. | Notas |
|---|---|:---:|:---:|---|
| `title` | String | ✅ | ✅ | Nombre de la experiencia |
| `slug` | UID | ✅ | ✅ | Generado desde `title` |
| `season` | Enum | ✅ | — | `"summer"` \| `"winter"` |
| `thumbnail` | Media (img) | ✅ | — | Imagen para tarjetas |
| `heroImage` | Media (img) | — | — | Imagen de fondo hero |
| `longDescription` | Blocks | ✅ | ✅ | Descripción rica |
| `packages` | Relación | — | — | oneToMany → Package |
| `seo` | Componente | — | ✅ | `shared.seo` |
| `displayOrder` | Integer | — | — | Orden de visualización |
| `footerDisplayOrder` | Integer | — | — | Orden en el footer |
| `showInFooter` | Boolean | — | — | Default: `true` |

---

#### 📦 Paquete (`api::package.package`)

> Paquete turístico con itinerario, precios y detalles completos.

| Campo | Tipo | Req. | Loc. | Notas |
|---|---|:---:|:---:|---|
| `title` | String | ✅ | ✅ | Nombre del paquete |
| `slug` | UID | ✅ | ✅ | Generado desde `title` |
| `experience` | Relación | — | — | manyToOne → Experience |
| `thumbnail` | Media (img) | ✅ | — | Imagen de tarjeta |
| `heroImage` | Media (img) | — | — | Imagen hero |
| `description` | Blocks | ✅ | ✅ | Descripción rica |
| `location` | String | ✅ | ✅ | Ubicación |
| `duration` | String | ✅ | ✅ | Ej: "3 días / 2 noches" |
| `difficulty` | String | — | ✅ | Nivel de dificultad |
| `groupSize` | String | — | ✅ | Tamaño del grupo |
| `guideType` | String | — | ✅ | Tipo de guía |
| `availableDates` | String | — | ✅ | Fechas disponibles |
| `season` | Enum | ✅ | — | `"summer"` \| `"winter"` |
| `priceAmount` | Integer | ✅ | — | Precio en EUR (min: 0) |
| `originalPriceAmount` | Integer | — | — | Precio original (descuentos) |
| `hasDiscount` | Boolean | — | — | Default: `false` |
| `rating` | Decimal | — | — | 0–5, default: 5 |
| `tags` | Comp.[] | — | ✅ | `shared.tag` |
| `itinerary` | Comp.[] | ✅ | ✅ | `package.itinerary-day` |
| `includes` | Comp.[] | — | ✅ | `package.whats-included` |
| `notIncludes` | Comp.[] | — | ✅ | `package.whats-not-included` |
| `additionalInfo` | Comp.[] | — | ✅ | `package.additional-info-item` |
| `additionalServices` | Comp.[] | — | ✅ | `package.additional-service-item` |
| `gallery` | Comp.[] | — | ✅ | `package.gallery-image` |
| `mapImage` | Media (img) | — | — | Mapa del paquete |
| `startDates` | Comp.[] | — | — | `package.start-date` |
| `seo` | Componente | — | ✅ | `shared.seo` |
| `showInHome` | Boolean | — | — | Default: `false` |
| `homeDisplayOrder` | Integer | — | — | Orden en el home |
| `displayOrder` | Integer | — | — | Orden general |

---

#### ⚖️ Página Legal (`api::legal-page.legal-page`)

| Campo | Tipo | Req. | Loc. | Notas |
|---|---|:---:|:---:|---|
| `title` | String | ✅ | ✅ | Título de la página |
| `slug` | UID | ✅ | ✅ | Generado desde `title` |
| `content` | Blocks | ✅ | ✅ | Contenido legal |
| `showInFooter` | Boolean | — | — | Default: `false` |
| `footerDisplayOrder` | Integer | — | — | Orden en el footer |

---

### Single Types

#### ⚙️ Configuración del Sitio (`api::site-setting.site-setting`)

| Campo | Tipo | Loc. | Notas |
|---|---|:---:|---|
| `siteName` | String | — | Default: "Dolovibes" |
| `logo` / `logoDark` / `favicon` | Media | — | Imágenes de marca |
| `location` | String | ✅ | Ubicación de la empresa |
| `phone` / `email` / `whatsappNumber` | String | — | Datos de contacto |
| `instagramUrl` / `facebookUrl` / `tiktokUrl` | String | — | Redes sociales |
| `footerDescription` | Text | ✅ | Descripción del footer |
| `copyrightText` | String | ✅ | Texto de copyright |
| `enableLanguageEn` / `It` / `De` | Boolean | — | Toggle de idiomas |
| `enableCurrencyUsd` / `Mxn` | Boolean | — | Toggle de divisas |

#### 🎬 Hero Section (`api::hero-section.hero-section`)

| Campo | Tipo | Loc. | Notas |
|---|---|:---:|---|
| `title` | String | ✅ | Título principal |
| `titleHighlight` | String | ✅ | Texto destacado |
| `subtitle` | Text | ✅ | Subtítulo |
| `videoDesktop` | Media (video) | — | Video del hero (desktop) |
| `imageMobile` | Media (img) | — | Imagen hero (móvil) |

#### 📖 About Page (`api::about-page.about-page`)

| Campo | Tipo | Loc. | Notas |
|---|---|:---:|---|
| `pageTitle` | String | ✅ | Título de la página |
| `mainPhoto` | Media | — | Foto principal |
| `photoAlt` | String | ✅ | Alt text |
| `origin` / `essence` / `vision` / `mission` | Comp. | ✅ | `shared.text-block` |
| `seo` | Componente | ✅ | `shared.seo` |

#### 📝 Site Texts (`api::site-text.site-text`)

> **150+ campos de texto** que controlan toda la interfaz: navegación, footer, formularios, modales, etiquetas, cuestionario de nivel, etc. Todos localizados.

---

## 8. 🧩 Componentes Reutilizables (Strapi)

### Compartidos (`src/components/shared/`)

| Componente | Campos | Uso |
|---|---|---|
| **`shared.seo`** | `metaTitle` (max 60), `metaDescription` (max 160), `shareImage`, `keywords` | Meta tags SEO |
| **`shared.text-block`** | `title`, `content` (blocks) | Secciones de texto en About |
| **`shared.tag`** | `name` | Etiquetas de paquetes |

### De paquete (`src/components/package/`)

| Componente | Campos | Uso |
|---|---|---|
| **`itinerary-day`** | `day` (int), `title`, `description` (blocks), `image` | Días del itinerario |
| **`whats-included`** | `label`, `detail` (blocks) | Lista "qué incluye" |
| **`whats-not-included`** | `label`, `detail` (blocks) | Lista "qué no incluye" |
| **`additional-info-item`** | `label`, `detail` (blocks) | Información adicional |
| **`additional-service-item`** | `label`, `detail` (blocks) | Servicios adicionales |
| **`gallery-image`** | `image`, `caption` (loc.) | Imágenes de galería |
| **`start-date`** | `date`, `displayText`, `available` (bool) | Fechas de salida |

---

## 9. 🔌 APIs Personalizadas

### 🌍 Auto-Translate API

| | |
|---|---|
| **Ruta** | `POST /api/auto-translate` |
| **Auth** | JWT de admin (verificación manual) |
| **Archivo controller** | `src/api/auto-translate/controllers/auto-translate.ts` |
| **Archivo servicio** | `src/api/auto-translate/services/auto-translate.ts` |

**Parámetros:**

```json
{
  "contentType": "api::package.package",
  "documentId": "abc123",
  "sourceLocale": "es",
  "targetLocales": ["en", "it", "de"],
  "autoPublish": true,
  "fields": ["title", "description"]
}
```

**Comportamiento:**
- Extrae recursivamente texto de campos string, blocks, componentes y zonas dinámicas
- Preserva campos de media (mantiene imágenes originales)
- Genera slugs automáticos desde títulos traducidos
- Mapeo DeepL: `es` → `es`, `en` → `en-US`, `it` → `it`, `de` → `de`

**Integración UI:** Botón "Traducir" en `src/admin/components/TranslateButton.tsx`

---

### 📧 Quote Request API

| | |
|---|---|
| **Ruta** | `POST /api/quote-request` |
| **Auth** | Ninguna (público) |
| **Archivo controller** | `src/api/quote-request/controllers/quote-request.ts` |
| **Archivo servicio** | `src/api/quote-request/services/quote-request.ts` |

**Parámetros:**

```json
{
  "type": "quote | package",
  "data": {
    "fullName": "string",
    "email": "string (validado)",
    "phone": "string",
    "contactMethod": "whatsapp | telefono | correo"
  }
}
```

**Comportamiento:**
- Valida email, longitud de strings y valores de enums
- Sanitiza inputs (HTML escaping)
- Envía email HTML vía Resend al destinatario en Site Settings
- Dos templates: cotización general y cotización de paquete

---

## 10. 🌐 Internacionalización (i18n)

### Backend (Strapi)

| Configuración | Valor |
|---|---|
| Plugin | `i18n` habilitado |
| Locales | `es` (default), `en`, `it`, `de` |
| Campos localizados | Versiones independientes por idioma |
| Campos no localizados | Compartidos entre idiomas |

### Frontend (i18next)

| Configuración | Valor |
|---|---|
| Detección de idioma | URL prefix → localStorage → navigator.language → `es` |
| Archivos | `/public/locales/{lang}/{namespace}.json` |
| Namespaces (8) | common, home, about, experiences, packageInfo, quoteForm, hikingLevel, legal |

**Prioridad de textos:**

| Prioridad | Fuente | Editable desde |
|---|---|---|
| 1 (alta) | Strapi (Site Texts) | Panel admin CMS |
| 2 (fallback) | i18next (JSON) | Código fuente |

> ⚠️ **IMPORTANTE:** Si un contenido no existe en el idioma solicitado, el frontend obtiene automáticamente la versión en español como fallback.

---

## 11. 💱 Sistema de Divisas

| Configuración | Valor |
|---|---|
| **Archivo principal** | `src/utils/currency.jsx` |
| **Moneda base** | EUR (almacenada en Strapi) |
| **API** | exchangerate-api.com |
| **Endpoint** | `https://v6.exchangerate-api.com/v6/{KEY}/latest/EUR` |

| Divisa | Símbolo | Posición | Locale |
|---|---|---|---|
| EUR | € | Después | de-DE |
| USD | $ | Antes | en-US |
| MXN | $ | Antes | es-MX |

**Caché por capas:**

| Capa | TTL |
|---|---|
| Memoria | 6 horas |
| localStorage | 24 horas |
| Fallback hardcoded | `{ EUR: 1, USD: 1.04, MXN: 20.85 }` |

**Auto-detección:** Preferencia guardada → Geolocalización IP (ipapi.co) → Idioma del navegador → EUR

---

## 12. 🖼️ Gestión de Medios (Cloudinary)

| Configuración | Valor |
|---|---|
| **Proveedor** | Cloudinary |
| **Cloud name** | `dn8pprext` |
| **Entorno** | Solo producción (desarrollo usa local) |
| **Límite de subida** | 250 MB |
| **Breakpoints** | 1920, 1000, 750, 500, 64px |

> ℹ️ **NOTA:** En el frontend, `OptimizedImage.jsx` maneja lazy loading, prevención de CLS y reintentos de carga.

---

## 13. 📧 Sistema de Email (Resend)

| Configuración | Valor |
|---|---|
| **Proveedor** | Resend |
| **Uso** | Emails de cotización |
| **Variables** | `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_RECIPIENT` |

**Templates disponibles:**

| Template | Campos |
|---|---|
| **Cotización general** | Nombre, email, teléfono, interés, fecha, huéspedes, notas, contacto preferido |
| **Cotización de paquete** | Nombre, ubicación, email, teléfono, mes, viajeros, tipo de viaje, paquete, servicios |

---

## 14. 🌍 Traducciones Automáticas (DeepL)

| Configuración | Valor |
|---|---|
| **Proveedor** | DeepL |
| **SDK** | `deepl-node` v1.24.0 |
| **Variable** | `DEEPL_API_KEY` |

**Flujo completo:**

| # | Paso |
|---|------|
| 1 | Admin crea/edita contenido en español |
| 2 | Clic en botón "Traducir" (solo visible en locale ES) |
| 3 | Sistema traduce a EN, IT, DE vía DeepL |
| 4 | Campos de media se preservan |
| 5 | Slugs se generan desde títulos traducidos |
| 6 | Contenido se publica automáticamente |
| 7 | Página admin se recarga tras 1.5s |

---

## 15. 🔍 SEO

### Implementado

| Característica | Detalle |
|---|---|
| **Meta tags dinámicos** | `usePageMeta(title, description)` → `<title>{page} \| DoloVibes</title>` |
| **Hreflang** | `Hreflang.jsx` genera alternates para cada idioma + `x-default` |
| **Canonical** | `<link rel="canonical">` para la URL actual |
| **SEO por contenido** | Componente `shared.seo` con metaTitle, metaDescription, shareImage, keywords |
| **URLs localizadas** | Rutas en el idioma local (ej: `/it/esperienze/`) |

### Pendiente

| Elemento | Estado |
|---|---|
| `robots.txt` | ❌ No existe — se recomienda agregar |
| `sitemap.xml` | ❌ No existe — se recomienda generar dinámicamente |

---

## 16. 🔐 Variables de Entorno

### Backend (`.env`)

#### Seguridad y autenticación

| Variable | Descripción |
|---|---|
| `ADMIN_JWT_SECRET` | Secreto JWT para autenticación del admin |
| `API_TOKEN_SALT` | Salt para generación de API tokens |
| `APP_KEYS` | Claves de encriptación (separadas por coma) |
| `JWT_SECRET` | Secreto para firma JWT |
| `TRANSFER_TOKEN_SALT` | Salt para tokens de transferencia |
| `ENCRYPTION_KEY` | Clave de encriptación general |

#### Base de datos

| Variable | Descripción |
|---|---|
| `DATABASE_CLIENT` | `sqlite` \| `postgres` \| `mysql` |
| `DATABASE_HOST` | Host del servidor |
| `DATABASE_PORT` | Puerto |
| `DATABASE_NAME` | Nombre de la BD |
| `DATABASE_USERNAME` | Usuario |
| `DATABASE_PASSWORD` | Contraseña |
| `DATABASE_SSL` | `true` \| `false` |

#### Servidor

| Variable | Descripción |
|---|---|
| `HOST` | Default: `0.0.0.0` |
| `PORT` | Default: `1337` |
| `NODE_ENV` | `development` \| `production` |
| `PUBLIC_URL` | URL pública del backend |
| `FRONTEND_URL` | URL del frontend (CORS) |

#### Servicios externos

| Variable | Servicio |
|---|---|
| `CLOUDINARY_NAME` / `KEY` / `SECRET` | Cloudinary |
| `RESEND_API_KEY` | Resend |
| `EMAIL_FROM` / `EMAIL_RECIPIENT` | Configuración de email |
| `DEEPL_API_KEY` | DeepL |

### Frontend (`.env.local`)

| Variable | Descripción |
|---|---|
| `NODE_ENV` | `development` \| `production` |
| `VITE_STRAPI_URL` | URL del backend Strapi |
| `VITE_USE_STRAPI` | `true` \| `false` |
| `VITE_EXCHANGE_RATE_API_KEY` | API key de ExchangeRate |

---

## 17. 🚀 Configuración de Despliegue

### Frontend → Vercel

| Configuración | Valor |
|---|---|
| **Archivo** | `vercel.json` |
| **SPA Rewrite** | Todas las rutas → `/index.html` |
| **Caché assets** | 1 año, immutable |
| **Caché locales** | 1 hora |
| **Caché videos** | 7 días |
| **Seguridad** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1` |

**Code splitting (Vite):**

| Chunk | Contenido |
|---|---|
| `react-vendor` | React + ReactDOM |
| `router` | React Router |
| `query` | React Query |
| `i18n` | i18next |
| `icons` | Lucide React |

> ℹ️ Compresión gzip + brotli habilitada. Minificación con Terser. Target ES2020. Sin sourcemaps en producción.

### Backend → Railway

| Configuración | Valor |
|---|---|
| **Detección** | Automática (Node.js) |
| **BD** | PostgreSQL en el mismo proyecto |
| **Host interno** | `nozomi.proxy.rlwy.net` |
| **Despliegue** | Push a `main` → deploy automático |

> ⚠️ **IMPORTANTE:** No se encontró `Dockerfile` ni `railway.toml` — Railway detecta automáticamente el proyecto.

---

## 18. 🌐 Configuración de DNS y Dominios

| Registro | Tipo | Apunta a | Propósito |
|---|---|---|---|
| `www.dolo-vibes.com` | CNAME | Vercel | Frontend |
| `api.dolo-vibes.com` | CNAME | Railway | Backend / CMS |

| Campo | Valor |
|---|---|
| **Registrador** | GoDaddy |
| **Dominio** | `dolo-vibes.com` |
| **Cuenta** | info@dolo-vibes.com |

> 🔴 **CRÍTICO:** Si el dominio expira en GoDaddy, tanto el frontend como el backend dejan de ser accesibles.

---

## 19. 🔧 Middlewares Personalizados

### Cache Control (`src/middlewares/cache-control.ts`)

| Recurso | Cache-Control |
|---|---|
| Panel admin | `no-store, no-cache, must-revalidate` |
| Uploads/media | `public, max-age=31536000, immutable` (1 año) |
| Single types | `max-age=60, stale-while-revalidate=300` |
| Collections | `max-age=120, stale-while-revalidate=600` |
| Otros API | `max-age=30, stale-while-revalidate=120` |
| Assets estáticos | `max-age=31536000, immutable` |

### Compression (`src/middlewares/compression.ts`)

| Configuración | Valor |
|---|---|
| Algoritmos | gzip, deflate |
| Métodos | Solo GET/HEAD con respuestas 2xx |
| Tipos | JSON, HTML, CSS, JS, XML, SVG, texto plano |
| Tamaño mínimo | 1 KB |

### CORS (`config/middlewares.ts`)

| Orígenes permitidos |
|---|
| `http://localhost:5173` (desarrollo) |
| `http://localhost:3000` (desarrollo alternativo) |
| `https://dolovibes.vercel.app` (Vercel) |
| URL de preview de Vercel (dinámica) |

---

## 20. 🛠️ Consideraciones de Mantenimiento

### Backups

| Recurso | Estrategia |
|---|---|
| **Base de datos** | Railway: backups automáticos en planes de pago. Plan gratuito: `pg_dump` manual periódico. |
| **Medios** | Cloudinary: persistentes con redundancia propia. |
| **Código** | GitHub: historial de commits como backup. |

### Renovación de API Keys

| Servicio | Vencimiento | Monitorear |
|---|---|---|
| DeepL | Depende del plan | Uso mensual en dashboard |
| Resend | Sin vencimiento auto | Que los emails sigan enviándose |
| ExchangeRate API | Gratuito: 1,500 req/mes | Consumo mensual |
| Cloudinary | Gratuito: 25 créditos/mes | Almacenamiento |

### Actualizaciones

| Componente | Consideración |
|---|---|
| **Strapi** | Revisar guía oficial antes de actualizar. Migraciones de BD en versiones mayores. |
| **Node.js** | Requiere 20.11.0 (`.nvmrc`). Mantener en rama LTS 20.x. |
| **Dependencias** | Ejecutar `npm audit` periódicamente. |

### Escalabilidad

| Servicio | Límite actual | Acción si se excede |
|---|---|---|
| **Railway** | Plan gratuito (CPU/RAM/horas) | Upgrade a plan Hobby ($5-15/mes) |
| **Cloudinary** | 25 créditos/mes | Upgrade plan Plus |
| **ExchangeRate** | 1,500 req/mes | Caché de 24h mitiga el consumo |

### Seguridad

- ✅ Headers de seguridad en Vercel y Strapi
- ✅ CSP para imágenes de Cloudinary
- ✅ CORS restringido a dominios conocidos
- ✅ Sanitización de HTML en formularios
- ✅ API keys en variables de entorno (nunca en código)

---

> 📘 **Documento generado el 24 de febrero de 2026** — Basado en revisión exhaustiva de los repositorios `dolovibes-frontend` y `dolovibes-backend`.

| Equipo de desarrollo | Email |
|---|---|
| **Jesús Garza** | jesus.garza.gro@gmail.com |
| **Armando Ochoa** | armaochoa99@gmail.com |

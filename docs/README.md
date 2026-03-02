# 🏔️ Dolovibes Frontend - React + Vite

Frontend del sitio web de Dolovibes, agencia de viajes especializada en experiencias en los Dolomitas. Construido con React 19, Vite 7, React Router y i18next.

---

## 📋 Requisitos Previos

- Node.js 20+ LTS
- npm o yarn
- Backend Strapi corriendo en `http://localhost:1337` (ver dolovibes-backend)

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd dolovibes

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Editar .env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=tu-token-de-strapi

# 5. Ejecutar en desarrollo
npm run dev
# Abre http://localhost:5173
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# URL del backend Strapi (sin trailing slash)
VITE_STRAPI_URL=http://localhost:1337

# Token de API de Strapi (generado en Settings → API Tokens)
VITE_STRAPI_API_TOKEN=tu-token-aqui
```

### Obtener el API Token de Strapi
1. Inicia sesión en Strapi Admin: http://localhost:1337/admin
2. Settings → API Tokens → Create new API Token
3. Name: `Frontend Token`, Type: `Full access`
4. Copia el token al archivo `.env`

## 📝 Scripts Disponibles

```bash
npm run dev         # Servidor de desarrollo con hot-reload
npm run build       # Compilar para producción
npm run preview     # Preview de build de producción
npm run lint        # Ejecutar ESLint
```

## 🌍 Internacionalización (i18n)

### Idiomas Soportados
- 🇪🇸 Español (es) - Default
- 🇬🇧 Inglés (en)
- 🇮🇹 Italiano (it)
- 🇩🇪 Alemán (de)

### Agregar un Nuevo Idioma

1. **Crear archivos de traducción** en `public/locales/<idioma>/`:
   ```
   public/locales/ja/
   ├── common.json
   ├── home.json
   ├── experiences.json
   ├── packageInfo.json
   ├── about.json
   ├── quoteForm.json
   ├── hikingLevel.json
   └── legal.json
   ```

2. **Copiar contenido** de un idioma existente (ej: `en/`) y traducir

3. **No se necesita registrar manualmente en `i18n.js`**: El proyecto usa `i18next-http-backend`, que carga los archivos automáticamente desde `public/locales/{idioma}/{namespace}.json`

4. **Agregar a LanguageSwitcher** (`src/components/LanguageSwitcher.jsx`):
   ```jsx
   { value: 'ja', label: '日本語', flag: '🇯🇵' }
   ```

5. **Configurar locale en Strapi**: El backend debe tener el nuevo locale habilitado (Settings → Internationalization) y contenido traducido. Las imágenes usan fallback automático al contenido en español

### Fallback de Imágenes

El frontend usa `enrichWithSpanishMedia()` en `src/services/api.js`:
- Si un Package/Experience no tiene imagen en EN/IT/DE
- Busca el mismo `documentId` en español (ES)
- Copia `thumbnail` y `heroImage` del contenido español
- Garantiza que siempre haya imágenes aunque la traducción esté incompleta

## 📂 Estructura del Proyecto

```
dolovibes/
├── public/
│   ├── locales/         # Traducciones i18next (carga automática)
│   │   ├── es/          # 8 namespaces por idioma
│   │   ├── en/
│   │   ├── it/
│   │   └── de/
│   └── videos/          # Videos para VideoHero
├── src/
│   ├── components/      # Componentes React
│   │   ├── NavbarNew.jsx
│   │   ├── Footer.jsx
│   │   ├── VideoHero.jsx
│   │   ├── PackageCard.jsx
│   │   ├── ExperienceSelector.jsx
│   │   ├── QuoteModal.jsx
│   │   ├── PackageQuoteModal.jsx
│   │   ├── PhotoGalleryModal.jsx
│   │   ├── HikingLevelModal.jsx
│   │   ├── CurrencySelector.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── OptimizedImage.jsx
│   │   ├── PackageRecommendations.jsx
│   │   ├── Hreflang.jsx
│   │   └── ErrorBoundary.jsx
│   ├── pages/           # Páginas (React Router)
│   │   ├── HomePage.jsx
│   │   ├── ExperiencePage.jsx
│   │   ├── PackageInfoPage.jsx
│   │   ├── AboutUsPage.jsx
│   │   └── DynamicLegalPage.jsx
│   ├── services/        # Servicios API
│   │   ├── strapiClient.js   # Cliente HTTP (axios)
│   │   ├── api.js            # Endpoints + transforms + enrich
│   │   └── hooks.js          # React Query hooks (usePackages, useExperiences, etc.)
│   ├── contexts/        # React Context providers
│   │   ├── SiteTextsContext.jsx
│   │   └── LanguageTransitionContext.jsx
│   ├── hooks/           # Custom hooks
│   │   ├── useAlternateUrls.js
│   │   ├── useFocusTrap.js
│   │   └── usePageMeta.js
│   ├── utils/           # Utilidades
│   │   ├── currency.jsx
│   │   ├── localizedRoutes.js
│   │   ├── BlocksRenderer.jsx
│   │   └── dataPrefetch.js
│   ├── i18n.js          # Configuración i18next
│   ├── App.jsx          # Router principal
│   └── main.jsx         # Entry point
├── .env                 # Variables de entorno (NO COMMITEAR)
├── .env.example         # Template de .env
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind CSS
├── vercel.json          # Configuración de despliegue Vercel
└── package.json
```

## 🔄 Flujo de Datos

### Cómo funciona la conexión con Strapi

1. **Componente solicita datos** usando custom hooks:
   ```jsx
   const { packages, loading, error } = usePackages();
   ```

2. **Hook llama a servicio API**:
   ```js
   // src/services/hooks.js
   const packages = await api.getPackages(locale);
   ```

3. **API fetch transforma y enriquece**:
   ```js
   // src/services/api.js
   const data = await fetchFromStrapi(`/packages?locale=${locale}`);
   // 1. Transforma (agrega documentId)
   // 2. Enriquece con imágenes de español si faltan
   ```

4. **Renderiza en componente**:
   ```jsx
   {packages.map(pkg => <PackageCard key={pkg.id} package={pkg} />)}
   ```

### Transformaciones de Datos

**fetchFromStrapi()** realiza:
1. **Fetch**: Obtiene datos raw de Strapi
2. **Transform**: Agrega `documentId` a cada item
3. **Enrich**: Copia imágenes de español si faltan (via `documentId`)

Ejemplo:
```js
// Raw de Strapi
{ id: 123, locale: 'it', documentId: 'abc', thumbnail: null }

// Después de transform
{ id: 123, locale: 'it', documentId: 'abc', thumbnail: null }

// Después de enrich (busca ES con documentId 'abc')
{ id: 123, locale: 'it', documentId: 'abc', thumbnail: { url: '/uploads/...' } }
```

## 🎨 Estilos y UI

### Tecnologías
- **Tailwind CSS**: Utility-first CSS framework
- **lucide-react**: Librería de iconos

### Personalización de Tema

Ver `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      'grafito': '#1C1C1C',   // Primary Dark (Negro Grafito)
      'pizarra': '#374257',   // Secondary Blue (Azul Pizarra)
      'alpino': '#66806C',    // Accent Green Dark (Verde Alpino)
      'bruma': '#A9BFA7',     // Accent Green Light (Verde Bruma)
      'niebla': '#A3B5B6',    // Accent Blue Light (Azul Niebla)
      'nieve': '#EFEFE6',     // Background Light (Nieve Suave)
    },
    fontFamily: {
      'heading': ['Poppins Bold', 'sans-serif'],
      'body': ['Poppins', 'sans-serif'],
      'mono': ['IBM Plex Mono', 'monospace'],
    }
  }
}
```

## 🐛 Troubleshooting

### Error: "Network Error" o "CORS"
- Verifica que el backend esté corriendo en `http://localhost:1337`
- Verifica que `VITE_STRAPI_URL` en `.env` sea correcto
- Reinicia el servidor frontend después de cambiar `.env`

### Las imágenes no cargan
1. Verifica en Strapi Admin que las imágenes existan
2. Verifica permisos públicos: Settings → Roles → Public
3. Ejecuta `node scripts/upload-images.js` en el backend

### Traducciones no aparecen
1. Verifica que el archivo JSON existe en `public/locales/<idioma>/`
2. Verifica que el nombre del archivo coincide con un namespace válido (common, home, experiences, packageInfo, about, quoteForm, hikingLevel, legal)
3. Usa `t('namespace:key')` en el componente:
   ```jsx
   const { t } = useTranslation(['home', 'common']);
   <h1>{t('home:hero.title')}</h1>
   ```

### Contenido no aparece en un idioma
1. Verifica que Strapi tiene contenido en ese locale
2. Verifica que el contenido tiene el mismo `documentId` que español
3. El fallback de imágenes solo funciona si comparten `documentId`

## 🚀 Deployment

### Build para Producción
```bash
npm run build
# Output en dist/
```

### Variables de Entorno en Producción
```env
VITE_STRAPI_URL=https://api.dolo-vibes.com
VITE_STRAPI_API_TOKEN=<produccion-token>
```

### Hosting
El proyecto está desplegado en **Vercel** (configurado en `vercel.json`). Para desplegar:
1. Importar el proyecto en Vercel
2. Configurar variables de entorno en el dashboard
3. Los deploys se ejecutan automáticamente al hacer push

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [i18next](https://www.i18next.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contribuir

1. Crear branch desde `main`
2. Hacer cambios y commit
3. Verificar que build funciona: `npm run build`
4. Push y crear Pull Request

## 📄 Licencia

Ver `LICENSE`

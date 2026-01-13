# 🏔️ Dolovibes Frontend - React + Vite

Frontend del sitio web de Dolovibes, agencia de viajes especializada en experiencias en los Dolomitas. Construido con React 18, Vite 7, React Router y i18next.

---

## 🚀 ¿Primera vez configurando el proyecto completo?

**👉 Lee la [Guía de Setup Completa](./SETUP.md)** - Incluye configuración de Frontend + Backend paso a paso.

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
- 🇫🇷 Francés (fr)
- 🇵🇹 Portugués (pt)

### Agregar un Nuevo Idioma

1. **Crear archivos de traducción** en `src/locales/<idioma>/`:
   ```
   src/locales/ja/
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

3. **Registrar en i18n** (`src/i18n.js`):
   ```js
   import jaCommon from './locales/ja/common.json';
   import jaHome from './locales/ja/home.json';
   // ... otros imports
   
   const resources = {
     // ... otros idiomas
     ja: {
       common: jaCommon,
       home: jaHome,
       // ...
     }
   };
   ```

4. **Agregar a LanguageSwitcher** (`src/components/LanguageSwitcher.jsx`):
   ```jsx
   { value: 'ja', label: '日本語', flag: '🇯🇵' }
   ```

5. **Verificar fallback** en Strapi: El backend debe tener contenido en el nuevo idioma o usar imagen fallback de español

### Fallback de Imágenes

El frontend usa `enrichWithSpanishMedia()` en `src/services/api.js`:
- Si un Package/Experience no tiene imagen en IT/DE/FR/PT
- Busca el mismo `documentId` en español (ES)
- Copia `thumbnail` y `heroImage` del contenido español
- Garantiza que siempre haya imágenes aunque la traducción esté incompleta

## 📂 Estructura del Proyecto

```
dolovibes/
├── public/
│   └── videos/           # Videos para VideoHero
├── src/
│   ├── components/       # Componentes React
│   │   ├── NavbarNew.jsx
│   │   ├── Footer.jsx
│   │   ├── PackageCard.jsx
│   │   ├── ExperienceSelector.jsx
│   │   ├── BookingForm.jsx
│   │   ├── QuoteModal.jsx
│   │   └── ...
│   ├── pages/           # Páginas (React Router)
│   │   ├── HomePage.jsx
│   │   ├── ExperiencePage.jsx
│   │   ├── PackageInfoPage.jsx
│   │   ├── AboutUsPage.jsx
│   │   └── ...
│   ├── services/        # Servicios API
│   │   ├── strapiClient.js   # Cliente HTTP
│   │   ├── api.js            # Endpoints + transforms + enrich
│   │   └── hooks.js          # Custom hooks (usePackages, useExperiences)
│   ├── locales/         # Traducciones i18next
│   │   ├── es/
│   │   ├── en/
│   │   ├── it/
│   │   ├── de/
│   │   ├── fr/
│   │   └── pt/
│   ├── utils/           # Utilidades
│   │   └── currency.jsx
│   ├── i18n.js          # Configuración i18next
│   ├── App.jsx          # Router principal
│   └── main.jsx         # Entry point
├── .env                 # Variables de entorno (NO COMMITEAR)
├── .env.example         # Template de .env
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind CSS
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
- **Headless UI**: Componentes accesibles (Modal, Disclosure, etc)
- **React Icons**: Iconos (FaPhone, FaEnvelope, etc)

### Personalización de Tema

Ver `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#1E3A8A',    // Azul Dolomitas
      secondary: '#10B981',  // Verde alpino
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
1. Verifica que el archivo JSON existe en `src/locales/<idioma>/`
2. Verifica que el namespace está registrado en `src/i18n.js`
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
VITE_STRAPI_URL=https://api.dolovibes.com
VITE_STRAPI_API_TOKEN=<produccion-token>
```

### Hosting Recomendados
- **Netlify**: Conectar repo, auto-deploy
- **Vercel**: Importar proyecto, configurar env vars
- **Cloudflare Pages**: Push a repo, configurar build

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [i18next](https://www.i18next.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contribuir

1. Crear branch desde `integracion-strapi`
2. Hacer cambios y commit
3. Verificar que build funciona: `npm run build`
4. Push y crear Pull Request

## 📄 Licencia

Ver `LICENSE`

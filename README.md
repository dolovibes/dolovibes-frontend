# Dolo Vibes — Frontend

Sitio web de [www.dolo-vibes.com](https://www.dolo-vibes.com), una agencia de viajes especializada en experiencias de lujo en los Dolomitas, Italia.

## Stack

- **React 19** + **Vite**
- **Tailwind CSS**
- **React Router v7**
- **TanStack Query** (fetching y caché)
- **i18next** (multiidioma: ES, EN, IT, DE)
- **Strapi** (CMS — repositorio separado)

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```
VITE_API_URL=https://api.dolo-vibes.com
```

## Comandos

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción (incluye lint)
npm run preview    # Vista previa del build
npm run lint       # Linter
```

## Despliegue

El sitio se despliega automáticamente en **Vercel** al hacer push a la rama `main`.

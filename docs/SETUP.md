# 🏔️ Dolovibes - Guía de Configuración Completa

Guía paso a paso para configurar el proyecto completo (Frontend + Backend) en tu equipo local.

---

## 📋 Requisitos Previos

- **Node.js** 20+ LTS
- **npm** o yarn
- **Git**

---

## 🚀 Instalación Completa

### 1️⃣ Clonar los Repositorios

```bash
# Frontend
git clone <repo-dolovibes-url>
cd dolovibes
npm install

# Backend (en otra terminal o carpeta)
git clone <repo-dolovibes-backend-url>
cd dolovibes-backend
npm install
```

---

### 2️⃣ Configurar Backend (Strapi)

#### Opción A: Instalación Guiada (Recomendado)

```bash
cd dolovibes-backend
./scripts/fresh-install.sh
```

El script te guiará paso a paso. Sigue las instrucciones en pantalla.

#### Opción B: Configuración Manual

1. **Crear archivo `.env`**
   ```bash
   cp .env.example .env
   ```

2. **Iniciar Strapi**
   ```bash
   npm run develop
   ```

3. **Crear usuario admin**
   - Abre http://localhost:1337/admin
   - Crea tu cuenta de administrador

4. **Generar API Token**
   - Settings → API Tokens → Create new API Token
   - Name: `Frontend Token`
   - Token type: `Full access`
   - Copia el token y agrégalo al `.env`:
     ```
     STRAPI_API_TOKEN=tu_token_aqui
     ```

5. **Configurar Locales (i18n)**
   - Settings → Internationalization → Add new locale
   - Agregar: `en`, `it`, `de`
   - Verificar que `es` sea default

6. **Configurar Permisos Públicos**
   - Settings → Users & Permissions → Roles → Public
   - Habilitar `find` y `findOne` para:
     - Experience
     - Package
     - Hero Section
     - About Page

7. **Poblar Contenido**
   ```bash
   node scripts/seed-all.js
   ```

8. **Verificar**
   ```bash
   node scripts/verify-completion.js
   ```

---

### 3️⃣ Configurar Frontend (React + Vite)

1. **Crear archivo `.env`** (si no existe)
   ```bash
   cd dolovibes
   touch .env
   ```

2. **Configurar variables de entorno**
   ```env
   VITE_STRAPI_URL=http://localhost:1337
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

---

## 🎯 Ejecución Diaria

Una vez configurado, para trabajar diariamente:

### Terminal 1 - Backend
```bash
cd dolovibes-backend
npm run develop
```
- Admin: http://localhost:1337/admin
- API: http://localhost:1337/api

### Terminal 2 - Frontend
```bash
cd dolovibes
npm run dev
```
- App: http://localhost:5173

---

## 📊 Verificar que Todo Funciona

### Backend
```bash
cd dolovibes-backend
node scripts/verify-completion.js
```

Deberías ver:
```
┌─────────────────┬─────┬─────┬─────┬─────┬──────────┐
│ Content Type    │  ES │  EN │  IT │  DE │ Estado   │
├─────────────────┼─────┼─────┼─────┼─────┼──────────┤
│ Packages        │  7  │  7  │  7  │  7  │  ✅ 100% │
│ Experiences     │  6  │  6  │  6  │  6  │  ✅ 100% │
│ Hero Section    │  1  │  1  │  1  │  1  │  ✅ 100% │
└─────────────────┴─────┴─────┴─────┴─────┴──────────┘
```

### Frontend
- Abre http://localhost:5173
- Deberías ver la página principal con paquetes y experiencias

---

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar puerto 1337 libre
lsof -ti:1337 | xargs kill -9

# Reiniciar
npm run develop
```

### Frontend no muestra datos
1. Verificar que backend esté corriendo en http://localhost:1337
2. Verificar permisos públicos en Strapi Admin
3. Verificar `.env` del frontend tenga `VITE_STRAPI_URL=http://localhost:1337`

### Imágenes no se ven
```bash
cd dolovibes-backend
node scripts/upload-images.js
```

### Contenido faltante
```bash
cd dolovibes-backend
node scripts/seed-all.js
```

---

## 📚 Documentación Adicional

- [Backend README](../dolovibes-backend/README.md)
- [Scripts README](../dolovibes-backend/scripts/README.md)
- [Strapi Docs](https://docs.strapi.io)

---

## 🔄 Actualizar Contenido

Si necesitas repoblar o actualizar el contenido:

```bash
cd dolovibes-backend

# Todo el contenido
node scripts/seed-all.js

# Solo un idioma
node scripts/seed-all.js --lang=it

# Ver qué haría sin ejecutar
node scripts/seed-all.js --dry-run
```

---

## 🎨 Estructura del Proyecto

```
dolovibes/                    # Frontend (React + Vite)
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
└── .env

dolovibes-backend/            # Backend (Strapi CMS)
├── src/api/                  # Content Types
├── scripts/                  # Scripts de instalación
│   ├── fresh-install.sh      # ⭐ Instalación guiada
│   └── seed-all.js           # Poblar contenido
├── downloads/                # Imágenes para subir
└── .env
```

---

## ✅ Checklist de Instalación

- [ ] Node.js 20+ instalado
- [ ] Repositorios clonados
- [ ] `npm install` en ambos proyectos
- [ ] Backend: `.env` configurado con `STRAPI_API_TOKEN`
- [ ] Backend: Usuario admin creado
- [ ] Backend: Locales configurados (es, en, it, de)
- [ ] Backend: Permisos públicos habilitados
- [ ] Backend: Contenido poblado (`seed-all.js`)
- [ ] Frontend: `.env` configurado con `VITE_STRAPI_URL`
- [ ] Backend corriendo en http://localhost:1337
- [ ] Frontend corriendo en http://localhost:5173
- [ ] Verificación exitosa (`verify-completion.js`)

---

¡Listo! Si tienes problemas, revisa la sección de Troubleshooting o consulta la documentación adicional.

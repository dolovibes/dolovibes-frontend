# 📗 Manual de Usuario — Dolo Vibes

> **Versión:** 1.0 &nbsp;|&nbsp; **Fecha:** Febrero 2026 &nbsp;|&nbsp; **Nivel técnico requerido:** Ninguno

| | |
|---|---|
| **Sitio público** | [www.dolo-vibes.com](https://www.dolo-vibes.com) |
| **Panel de administración** | [api.dolo-vibes.com/admin](https://api.dolo-vibes.com/admin) |
| **Email de acceso** | info@dolo-vibes.com |

---

## 👋 Bienvenido/a

Este manual te explica paso a paso cómo administrar el contenido de tu sitio web. No necesitas saber de programación ni de tecnología para usarlo.

Tu sitio web tiene dos partes:

| Parte | Dirección | Para qué sirve |
|---|---|---|
| **Sitio público** | www.dolo-vibes.com | Lo que ven tus clientes |
| **Panel de administración** | api.dolo-vibes.com/admin | Donde tú editas el contenido |

> 💡 **TIP:** Piensa en el panel de administración como el "detrás de escena" de tu sitio. Todo lo que cambies ahí se reflejará en el sitio público.

---

## 📑 Tabla de Contenidos

| # | Sección |
|---|---------|
| 1 | [Cómo acceder al panel de administración](#1--cómo-acceder-al-panel-de-administración) |
| 2 | [Conociendo el panel: las secciones principales](#2--conociendo-el-panel-las-secciones-principales) |
| 3 | [Administrar Experiencias](#3--administrar-experiencias) |
| 4 | [Administrar Paquetes](#4--administrar-paquetes) |
| 5 | [Editar la página de inicio (Hero)](#5--editar-la-página-de-inicio-hero) |
| 6 | [Editar la página "Nosotros"](#6--editar-la-página-nosotros) |
| 7 | [Editar textos del sitio](#7--editar-textos-del-sitio) |
| 8 | [Configuración general del sitio](#8--configuración-general-del-sitio) |
| 9 | [Páginas legales](#9--páginas-legales) |
| 10 | [Subir y gestionar imágenes](#10--subir-y-gestionar-imágenes) |
| 11 | [Traducir contenido automáticamente](#11--traducir-contenido-automáticamente) |
| 12 | [Publicar y despublicar contenido](#12--publicar-y-despublicar-contenido) |
| 13 | [Qué NO tocar](#13--qué-no-tocar) |
| 14 | [Solución de problemas comunes](#14--solución-de-problemas-comunes) |
| 15 | [Glosario](#15--glosario) |

---

## 1. 🔑 Cómo acceder al panel de administración

### Pasos para entrar

| Paso | Acción |
|:---:|---|
| 1 | Abre tu navegador (Chrome, Safari, Firefox, etc.) |
| 2 | Escribe en la barra de direcciones: **api.dolo-vibes.com/admin** |
| 3 | Verás una pantalla de inicio de sesión |
| 4 | Ingresa tu email: **info@dolo-vibes.com** |
| 5 | Ingresa tu contraseña |
| 6 | Haz clic en **"Login"** (Iniciar sesión) |

### Si olvidaste tu contraseña

| Paso | Acción |
|:---:|---|
| 1 | En la pantalla de login, haz clic en **"Forgot your password?"** |
| 2 | Ingresa tu email: **info@dolo-vibes.com** |
| 3 | Revisa tu bandeja de entrada (y la carpeta de spam) |
| 4 | Haz clic en el enlace del email y crea una nueva contraseña |

> ⚠️ **IMPORTANTE:** Si no recibes el email para restablecer la contraseña, contacta a tu equipo de desarrollo. Es posible que el servicio de email necesite revisión.

---

## 2. 🧭 Conociendo el panel: las secciones principales

Al entrar al panel, verás un menú en el lado izquierdo con estas secciones:

### 📁 Gestor de Contenido (Content Manager)

Es la sección principal. Aquí encuentras todo el contenido organizado en dos categorías:

> ℹ️ **NOTA:** En las tablas de este manual, la columna **"Campo"** muestra el nombre técnico del campo y la columna **"Label en el panel"** muestra el texto que realmente ves en el panel de administración. Estos labels están definidos en los archivos de traducción del backend (`src/admin/translations/es.json` y `en.json`) y se muestran según el idioma configurado en tu panel.

**Colecciones** — pueden tener muchas entradas:

| Nombre en el panel | Qué es | Ejemplo |
|---|---|---|
| 🏔️ Experience | Las experiencias/actividades que ofreces | Senderismo, Alpinismo, Escalada |
| 📦 Package | Los paquetes turísticos con detalles y precios | "Volcán Nevado de Colima 3 días" |
| ⚖️ Legal Page | Páginas de texto legal | Política de privacidad, Términos |

**Tipos Únicos** — solo existe uno de cada:

| Nombre en el panel | Qué es |
|---|---|
| 🎬 Hero Section | Lo primero que se ve al entrar al sitio (video/foto grande con título) |
| 📖 About Page | El contenido de la página "Nosotros" |
| ⚙️ Site Setting | Configuración general: teléfono, email, redes sociales, logo |
| 📝 Site Text | Todos los textos pequeños del sitio: botones, etiquetas, mensajes |

### 🖼️ Biblioteca de Medios (Media Library)

Aquí se guardan todas las fotos y videos que has subido. Es como una carpeta de archivos en la nube.

---

## 3. 🏔️ Administrar Experiencias

Las **experiencias** son las categorías principales de actividades que ofreces (por ejemplo: Senderismo, Alpinismo). Cada experiencia puede tener varios paquetes asociados.

### Ver las experiencias existentes

| Paso | Acción |
|:---:|---|
| 1 | En el menú izquierdo, haz clic en **Content Manager** |
| 2 | Selecciona **Experience** en la lista |
| 3 | Verás una tabla con todas tus experiencias |

### Crear una nueva experiencia

Haz clic en el botón **"Create new entry"** (esquina superior derecha) y llena:

| Campo | Label en el panel | Qué poner | Ejemplo | ¿Obligatorio? |
|---|---|---|---|:---:|
| `title` | _Título de la experiencia_ | Nombre de la experiencia | "Senderismo" | ✅ |
| `slug` | _URL amigable_ | Se genera solo a partir del título | "senderismo" | ✅ (auto) |
| `season` | _Temporada_ | Temporada: verano o invierno | "summer" | ✅ |
| `thumbnail` | _Imagen miniatura_ | Foto para la tarjeta/miniatura | Una foto representativa | ✅ |
| `heroImage` | _Imagen hero_ | Foto grande de fondo (encabezado) | Una foto panorámica | — |
| `longDescription` | _Descripción completa_ | Descripción detallada de la experiencia | Texto con formato | ✅ |
| `displayOrder` | _Orden de lista (General)_ | Número que controla el orden (menor = primero) | 1, 2, 3... | — |
| `showInFooter` | _Mostrar en Footer_ | ¿Mostrar en el pie de página del sitio? | Sí/No | — |

Luego:
1. Haz clic en **"Save"** (Guardar) → se crea como borrador
2. Haz clic en **"Publish"** (Publicar) → aparecerá en el sitio público

### Editar una experiencia

| Paso | Acción |
|:---:|---|
| 1 | Haz clic sobre la experiencia que quieras modificar |
| 2 | Cambia los campos que necesites |
| 3 | Haz clic en **"Save"** |

### Ordenar experiencias

> 💡 **TIP:** Para cambiar el orden en que aparecen en el sitio, modifica el campo **displayOrder** de cada experiencia. El número más bajo aparece primero.

---

## 4. 📦 Administrar Paquetes

Los **paquetes** son los productos/servicios específicos que vendes. Son la parte más completa del sitio.

### Crear un nuevo paquete

Haz clic en **"Create new entry"** y llena los campos por secciones:

---

#### Sección 1: Información básica

| Campo | Label en el panel | Qué poner | Ejemplo |
|---|---|---|---|
| `title` | _Título del paquete_ | Nombre del paquete | "Volcán Nevado de Colima" |
| `slug` | _URL amigable (slug)_ | Se genera automáticamente | "volcan-nevado-de-colima" |
| `experience` | _Experiencia relacionada_ | Selecciona la experiencia a la que pertenece | "Senderismo" |
| `season` | _Temporada_ | Temporada | "summer" |
| `thumbnail` | _Imagen miniatura_ | Foto para la tarjeta | Foto representativa |
| `heroImage` | _Imagen hero (grande)_ | Foto grande de encabezado | Foto panorámica |
| `description` | _Descripción del paquete_ | Descripción detallada con formato | Texto enriquecido |

---

#### Sección 2: Detalles del paquete

| Campo | Label en el panel | Qué poner | Ejemplo |
|---|---|---|---|
| `location` | _Ubicación_ | Ubicación | "Jalisco, México" |
| `duration` | _Duración del viaje_ | Duración | "3 días / 2 noches" |
| `difficulty` | _Nivel de dificultad_ | Nivel de dificultad | "Moderado" |
| `groupSize` | _Tamaño del grupo_ | Tamaño del grupo | "4-12 personas" |
| `guideType` | _Tipo de guía_ | Tipo de guía | "Guía certificado" |
| `availableDates` | _Fechas disponibles_ | Fechas disponibles | "Todo el año" |

---

#### Sección 3: Precios

| Campo | Label en el panel | Qué poner | Ejemplo |
|---|---|---|---|
| `priceAmount` | _Precio actual (EUR)_ | Precio en euros (solo números) | 350 |
| `originalPriceAmount` | _Precio original (EUR - Antes del descuento)_ | Precio original (si hay descuento) | 450 |
| `hasDiscount` | _¿Tiene descuento?_ | ¿Tiene descuento activo? | Sí/No |
| `rating` | _Calificación (0-5)_ | Calificación (0 a 5) | 4.8 |

> ℹ️ **NOTA:** Los precios siempre se ponen en **euros (EUR)**. El sitio automáticamente los convierte a dólares (USD) y pesos mexicanos (MXN) para los visitantes.

---

#### Sección 4: Itinerario (día por día)

Para agregar los días del itinerario:

| Paso | Acción |
|:---:|---|
| 1 | Busca la sección **itinerary** |
| 2 | Haz clic en **"Add an entry"** para cada día |
| 3 | Para cada día, llena los campos de abajo |

| Campo | Label en el panel | Qué poner | Ejemplo |
|---|---|---|---|
| `day` | _Número de día_ | Número del día | 1 |
| `title` | _Título del día_ | Título del día | "Llegada y aclimatación" |
| `description` | _Descripción de actividades_ | Actividades detalladas | Texto con formato |
| `image` | _Imagen del día_ | Foto del día (opcional) | Foto de la actividad |

---

#### Sección 5: Qué incluye / Qué no incluye

| Paso | Acción |
|:---:|---|
| 1 | Busca la sección **includes** (_¿Qué incluye?_) o **notIncludes** (_¿Qué NO incluye?_) |
| 2 | Haz clic en **"Add an entry"** para cada elemento |
| 3 | Llena `label` (_Nombre del servicio incluido_) y opcionalmente `detail` (_Detalle o descripción_) |

**Ejemplos de "Qué incluye":**

| Label | Detail |
|---|---|
| Transporte | Desde el hotel hasta el punto de inicio |
| Alimentos | Desayuno y comida durante la excursión |
| Equipo | Casco, cuerdas y arnés incluidos |

---

#### Sección 6: Galería de fotos

| Paso | Acción |
|:---:|---|
| 1 | Busca la sección **gallery** (_Galería de fotos_) |
| 2 | Haz clic en **"Add an entry"** para cada foto |
| 3 | Sube la **image** (_Imagen de galería_) y opcionalmente agrega un **caption** (_Pie de foto_) |

---

#### Sección 7: Fechas de salida

| Campo | Label en el panel | Qué poner | Ejemplo |
|---|---|---|---|
| `date` | _Fecha de salida_ | La fecha de salida | 2026-04-15 |
| `spots` | _Lugares disponibles_ | Número de lugares disponibles | 12 |
| `available` | _¿Disponible?_ | ¿Está disponible? | Sí/No |

---

#### Sección 8: Visibilidad y orden

| Campo | Label en el panel | Qué controla |
|---|---|---|
| `showInHome` | _Mostrar en Recomendaciones del Home_ | ¿Mostrar este paquete en la página de inicio? |
| `homeDisplayOrder` | _Orden en Home_ | Orden en el que aparece en el home (menor = primero) |
| `displayOrder` | _Orden de lista (General)_ | Orden general en la lista de paquetes |

---

#### Sección 9: SEO (opcional pero recomendado)

| Campo | Label en el panel | Qué poner | Límite |
|---|---|---|---|
| `metaTitle` | _Título SEO (máx. 60 caracteres)_ | Título que aparece en Google | Máx. 60 caracteres |
| `metaDescription` | _Descripción SEO (máx. 160 caracteres)_ | Descripción para Google | Máx. 160 caracteres |
| `keywords` | _Palabras clave (separadas por coma)_ | Palabras clave separadas por comas | — |
| `shareImage` | _Imagen para compartir en redes_ | Imagen al compartir en redes sociales | — |

> 💡 **TIP:** El SEO ayuda a que tu paquete aparezca en los resultados de Google. Vale la pena llenarlo para los paquetes más importantes.

---

## 5. 🎬 Editar la página de inicio (Hero)

La sección "Hero" es lo primero que ven los visitantes — el video/foto grande con el título principal.

| Paso | Acción |
|:---:|---|
| 1 | En **Content Manager**, selecciona **Hero Section** (Single Types) |
| 2 | Edita los campos |
| 3 | Guarda y publica |

| Campo | Label en el panel | Qué es | Ejemplo |
|---|---|---|---|
| `title` | _Título principal_ | Título principal | "Descubre la aventura" |
| `titleHighlight` | _Título destacado_ | Parte del título que se resalta | "aventura" |
| `subtitle` | _Subtítulo_ | Texto debajo del título | "Experiencias únicas en la montaña" |
| `videoDesktop` | _Video (escritorio)_ | Video de fondo (solo computadoras) | Archivo MP4 |
| `videoMobile` | _Video (móvil)_ | Video para celulares | Archivo MP4 |
| `fallbackImage` | _Imagen alternativa_ | Imagen estática si no carga el video | Foto JPG/PNG |
| `badge` | _Etiqueta/Distintivo_ | Etiqueta visible sobre el hero | "Nuevo" |

> 💡 **TIP:** El video de fondo solo se reproduce en computadoras. En celulares se muestra la imagen estática para que cargue rápido.

---

## 6. 📖 Editar la página "Nosotros"

| Paso | Acción |
|:---:|---|
| 1 | En **Content Manager**, selecciona **About Page** |
| 2 | Edita los campos |
| 3 | Guarda y publica |

| Campo | Label en el panel | Qué es |
|---|---|---|
| `pageTitle` | _Título de la página_ | Título de la página |
| `mainPhoto` | _Foto principal_ | Foto principal de la sección |
| `photoAlt` | _Texto alternativo (foto)_ | Descripción de la foto (para accesibilidad) |

Cada sección de contenido tiene dos partes:

| Sección | Label en el panel | `title` (título) | `content` (texto) |
|---|---|---|---|
| **Origin** | _Nuestro origen_ | Ej: "Nuestro Origen" | Historia de la empresa |
| **Essence** | _Nuestra esencia_ | Ej: "Nuestra Esencia" | Qué los hace únicos |
| **Vision** | _Visión_ | Ej: "Nuestra Visión" | Hacia dónde van |
| **Mission** | _Misión_ | Ej: "Nuestra Misión" | Qué hacen y para quién |
| **Team** | _Equipo_ | Ej: "Nuestro Equipo" | Información del equipo |
| **Values** | _Valores_ | Ej: "Nuestros Valores" | Lo que los guía |

---

## 7. 📝 Editar textos del sitio

La sección **Site Text** contiene **todos los textos pequeños** que aparecen en el sitio.

| Paso | Acción |
|:---:|---|
| 1 | En **Content Manager**, selecciona **Site Text** |
| 2 | Busca el texto que quieras cambiar |
| 3 | Modifícalo, guarda y publica |

**Ejemplos de textos que puedes cambiar:**

| Campo | Label en el panel | Dónde aparece en el sitio |
|---|---|---|
| `navbarExperiences` | _Texto nav: Experiencias_ | Menú de navegación → "Experiencias" |
| `navbarAboutUs` | _Texto nav: Nosotros_ | Menú de navegación → "Nosotros" |
| `navbarQuote` | _Texto nav: Cotizar_ | Menú de navegación → "Cotizar" |
| `footerContact` | _Footer: Título sección Contacto_ | Título de contacto en el footer |
| `footerExperiences` | _Footer: Título sección Experiencias_ | Título de experiencias en el footer |
| `quoteModalTitle` | _Modal cotización: Título principal_ | Título del formulario de cotización |
| `buttonsSubmit` | _Botón: Enviar_ | Botón "Enviar" en formularios |
| `packageInfoQuote` | _Paquete: Solicitar cotización (botón)_ | Botón "Cotizar" en los paquetes |

> 💡 **TIP:** Si no estás seguro de qué campo controla qué texto, cambia uno, guarda, y revisa el sitio. Siempre puedes revertirlo.

---

## 8. ⚙️ Configuración general del sitio

La sección **Site Setting** controla información que aparece en todo el sitio.

### Información de la empresa

| Campo | Label en el panel | Qué es | Ejemplo |
|---|---|---|---|
| `siteName` | _Nombre del sitio_ | Nombre del sitio | "Dolovibes" |
| `location` | _Ubicación_ | Ubicación de la empresa | "Guadalajara, Jalisco" |
| `phone` | _Teléfono_ | Teléfono de contacto | "+52 33 1234 5678" |
| `email` | _Correo electrónico_ | Email de contacto | "info@dolo-vibes.com" |
| `whatsappNumber` | _WhatsApp_ | Número de WhatsApp | "+523312345678" |

### Redes sociales

| Campo | Label en el panel | Qué poner |
|---|---|---|
| `instagramUrl` | _Instagram_ | Link completo a tu perfil de Instagram |
| `facebookUrl` | _Facebook_ | Link completo a tu página de Facebook |
| `tiktokUrl` | _TikTok_ | Link completo a tu perfil de TikTok |

### Imágenes de marca

| Campo | Label en el panel | Qué es |
|---|---|---|
| `logo` | _Logo principal_ | Logo principal (fondo claro) |
| `logoDark` | _Logo oscuro_ | Logo para fondos oscuros |
| `favicon` | _Favicon_ | Icono pequeño en la pestaña del navegador |

### Activar/desactivar idiomas y divisas

| Campo | Label en el panel | Qué controla |
|---|---|---|
| `enableLanguageEn` | _Habilitar idioma: Inglés (EN)_ | ¿Mostrar inglés? |
| `enableLanguageIt` | _Habilitar idioma: Italiano (IT)_ | ¿Mostrar italiano? |
| `enableLanguageDe` | _Habilitar idioma: Alemán (DE)_ | ¿Mostrar alemán? |
| `enableCurrencyUsd` | _Habilitar moneda: USD (Dólar americano)_ | ¿Mostrar precios en dólares (USD)? |
| `enableCurrencyMxn` | _Habilitar moneda: MXN (Peso mexicano)_ | ¿Mostrar precios en pesos (MXN)? |

> ℹ️ **NOTA:** El español y el euro siempre están activos — son la base del sitio y no se pueden desactivar.

---

## 9. ⚖️ Páginas legales

### Crear una página legal

| Paso | Acción |
|:---:|---|
| 1 | En **Content Manager**, selecciona **Legal Page** |
| 2 | Haz clic en **"Create new entry"** |
| 3 | Llena los campos (ver abajo) |
| 4 | Guarda y publica |

| Campo | Label en el panel | Qué poner | Ejemplo |
|---|---|---|---|
| `title` | _Título de la página_ | Título de la página | "Política de Privacidad" |
| `slug` | _URL amigable (slug)_ | Se genera automáticamente | "politica-de-privacidad" |
| `content` | _Contenido de la página_ | El contenido legal con formato | Texto legal |
| `showInFooter` | _Mostrar en Footer_ | ¿Mostrar enlace en el pie de página? | Sí/No |
| `footerDisplayOrder` | _Orden en Footer_ | Orden en el footer | 1, 2, 3... |

---

## 10. 🖼️ Subir y gestionar imágenes

### Subir una imagen al editar contenido

Cuando un campo requiere una imagen:

| Paso | Acción |
|:---:|---|
| 1 | Haz clic en el campo de imagen |
| 2a | **Subir nueva:** Arrastra y suelta, o haz clic para seleccionar desde tu computadora |
| 2b | **Usar existente:** Busca entre las imágenes ya subidas |

### Gestionar la biblioteca de medios

| Paso | Acción |
|:---:|---|
| 1 | En el menú izquierdo, haz clic en **Media Library** |
| 2 | Puedes ver, buscar, organizar en carpetas y eliminar archivos |

### Recomendaciones para imágenes

| Tipo de imagen | Tamaño recomendado | Formato |
|---|---|---|
| Thumbnail (miniatura) | 800 x 600 px | JPG o WebP |
| Hero (encabezado) | 1920 x 1080 px | JPG o WebP |
| Galería de paquete | 1200 x 800 px | JPG o WebP |
| Logo | 300 x 100 px | PNG (fondo transparente) |
| Favicon | 32 x 32 px | PNG o ICO |

> 💡 **TIP:** Las fotos se redimensionan automáticamente para celulares, tablets y computadoras. Entre más grande y buena calidad sea la foto original, mejor se verá.

> ℹ️ **NOTA:** Puedes subir archivos de hasta **250 MB** (útil para videos).

---

## 11. 🌍 Traducir contenido automáticamente

Tu sitio soporta **4 idiomas**: Español, Inglés, Italiano y Alemán. No necesitas traducir manualmente — el sistema lo hace automáticamente.

### Cómo funciona (resumen)

| # | Paso |
|:---:|---|
| 1 | Creas o editas contenido **en español** (idioma principal) |
| 2 | Guardas y publicas el contenido en español |
| 3 | Haces clic en el botón **"Traducir"** (panel lateral derecho) |
| 4 | El sistema traduce a todos los demás idiomas |
| 5 | La página se recarga automáticamente al terminar |

### Paso a paso detallado

| # | Acción |
|:---:|---|
| 1 | Abre cualquier experiencia, paquete, página legal, etc. |
| 2 | Asegúrate de estar en **Español (ES)** en el selector de idioma |
| 3 | Edita el contenido como necesites |
| 4 | **Guarda** y **Publica** |
| 5 | En el panel derecho, busca el botón **"Traducir"** |
| 6 | Aparecerá una confirmación → haz clic en **"Confirmar"** |
| 7 | Espera a que termine (la página se recargará) |
| 8 | Verás una notificación verde de éxito |

### Cosas importantes

| Regla | Detalle |
|---|---|
| 🔤 **Solo desde español** | El botón "Traducir" solo aparece cuando ves el contenido en español |
| 🖼️ **Imágenes intactas** | Las fotos y videos se mantienen iguales en todos los idiomas |
| ✏️ **Puedes editar** | Si una traducción no te convence, cámbiala manualmente en ese idioma |
| 📋 **Traduce todo** | Títulos, descripciones, itinerarios, "qué incluye", etc. |

---

## 12. 📤 Publicar y despublicar contenido

El contenido puede estar en dos estados:

| Estado | Significado | Indicador |
|---|---|---|
| 📝 **Borrador** (Draft) | Solo visible en el panel admin. Los visitantes **NO** lo ven. | Punto azul |
| ✅ **Publicado** (Published) | Visible en el sitio público. Los visitantes **SÍ** lo ven. | Punto verde |

### Acciones

| Acción | Cómo |
|---|---|
| **Publicar** | Abre el contenido → clic en **"Publish"** (esquina superior derecha) |
| **Despublicar** | Abre el contenido publicado → clic en **"Unpublish"** |
| **Eliminar** | En la lista, selecciona la casilla → clic en **"Delete"** → confirmar |

> 🔴 **ADVERTENCIA:** Eliminar contenido es **permanente**. Si no estás seguro, mejor despublícalo en lugar de eliminarlo.

---

## 13. 🚫 Qué NO tocar

Para evitar que el sitio deje de funcionar, **evita** lo siguiente:

### En el panel de administración

| ❌ No hagas esto | Por qué |
|---|---|
| Eliminar los Single Types (Hero, About, Settings, Texts) | Partes del sitio dejarán de funcionar |
| Cambiar nombres de campos o estructura | La programación depende de esos nombres exactos |
| Modificar la sección "Settings" (engranaje) | Controla permisos y configuraciones técnicas |
| Crear nuevos tipos de contenido | Requiere cambios en la programación |
| Eliminar/renombrar campos desde Content-Types Builder | Romperá la conexión con el sitio |

### Sobre las imágenes

| ❌ No hagas esto | Por qué |
|---|---|
| Eliminar imágenes de la biblioteca que estén en uso | Aparecerán espacios vacíos en el sitio |
| Subir imágenes sin antes verificar que no exista duplicado | Se acumula espacio innecesario |

### Sobre los idiomas

| ❌ No hagas esto | Por qué |
|---|---|
| Editar en otro idioma antes que en español | Las traducciones automáticas parten del español |
| Cambiar el idioma predeterminado del sistema | Romperá el flujo de traducción |

---

## 14. 🔧 Solución de problemas comunes

### "El sitio no carga" o "se ve una página en blanco"

| # | Qué hacer |
|:---:|---|
| 1 | Verifica tu conexión a internet |
| 2 | Intenta desde otro navegador o dispositivo |
| 3 | Espera 5 minutos y vuelve a intentar |
| 4 | Si persiste → contacta al equipo de desarrollo |

---

### "No puedo entrar al panel de administración"

| # | Qué hacer |
|:---:|---|
| 1 | Verifica que la URL sea exactamente **api.dolo-vibes.com/admin** |
| 2 | Intenta restablecer tu contraseña (ver sección 1) |
| 3 | Limpia la caché: Chrome → `Ctrl+Shift+Delete` → "Imágenes y archivos en caché" → Borrar |
| 4 | Si no funciona → contacta al equipo de desarrollo |

---

### "Hice un cambio pero no se ve en el sitio"

| # | Qué hacer |
|:---:|---|
| 1 | ¿Publicaste el contenido? Revisa que no esté en "borrador" |
| 2 | Limpia la caché del navegador (`Ctrl+Shift+Delete`) |
| 3 | Espera 2-5 minutos |
| 4 | Prueba en ventana de incógnito (`Ctrl+Shift+N`) |

---

### "Las imágenes no se ven en el sitio"

| # | Qué hacer |
|:---:|---|
| 1 | Verifica que las imágenes estén asignadas en el panel admin |
| 2 | No elimines imágenes de la biblioteca si están en uso |
| 3 | Prueba subir en otro formato (JPG en lugar de PNG) |
| 4 | Si persiste → contacta al equipo de desarrollo |

---

### "El botón Traducir no aparece"

| # | Qué verificar |
|:---:|---|
| 1 | Que estés viendo el contenido en **Español (ES)** |
| 2 | Que el contenido esté **guardado y publicado** |
| 3 | Que sea un tipo de contenido que soporte traducción |

---

### "La traducción salió mal"

| # | Qué hacer |
|:---:|---|
| 1 | Cambia al idioma donde salió mal (usando el selector) |
| 2 | Edita manualmente el texto |
| 3 | Guarda y publica |

---

### "El sitio está muy lento"

| # | Qué hacer |
|:---:|---|
| 1 | Puede ser el plan gratuito de Railway bajo mucho tráfico |
| 2 | Espera unos minutos y prueba de nuevo |
| 3 | Si pasa frecuentemente → contacta al equipo de desarrollo para evaluar un upgrade |

---

### "Me llegó un email de un proveedor que no entiendo"

> 🔴 **IMPORTANTE:** No ignores emails de GoDaddy, Vercel, Railway, Cloudinary, Resend o DeepL. Si es sobre renovación o vencimiento, contacta al equipo de desarrollo inmediatamente. Guarda los emails en una carpeta aparte.

---

## 15. 📚 Glosario

| Término | Significado |
|---|---|
| **Publicar** (Publish) | Hacer visible un contenido en el sitio público |
| **Borrador** (Draft) | Contenido guardado pero que aún no se ve en el sitio |
| **Despublicar** (Unpublish) | Ocultar contenido del sitio sin eliminarlo |
| **Entrada** (Entry) | Un elemento individual: una experiencia, un paquete, etc. |
| **Colección** (Collection) | Un grupo de entradas del mismo tipo |
| **Tipo Único** (Single Type) | Contenido que solo existe una vez (ej: la configuración) |
| **Slug** | La parte de la dirección web que identifica al contenido. En `dolo-vibes.com/es/paquetes/volcan-nevado`, el slug es "volcan-nevado" |
| **Media** | Cualquier archivo multimedia: fotos, videos, documentos |
| **Locale / Idioma** | La versión en un idioma específico del contenido |
| **Bloque** (Block) | Editor de texto con formato: negritas, listas, encabezados |
| **Componente** | Un grupo de campos que se repite (ej: cada día del itinerario) |
| **Repetible** | Un componente que puede tener muchas instancias |
| **SEO** | Información que ayuda a que tu sitio aparezca en Google |
| **metaTitle** | El título que aparece en los resultados de Google |
| **metaDescription** | La descripción corta debajo del título en Google |
| **CTA** (Call to Action) | Botón que invita al usuario a hacer algo ("Reservar", "Cotizar") |
| **Hero** | La sección grande y visual al inicio de una página |
| **Footer** | El pie de página del sitio (links y datos de contacto) |
| **Thumbnail** | Imagen pequeña/miniatura en listas y tarjetas |
| **Caché** | Información que tu navegador guarda temporalmente. A veces hay que borrarla para ver cambios. |

---

> 📗 **Documento generado el 24 de febrero de 2026.**

| Equipo de desarrollo | Email |
|---|---|
| **Jesús Garza** | jesus.garza.gro@gmail.com |
| **Armando Ochoa** | armaochoa99@gmail.com |

# Manual de Usuario — Dolo Vibes

> **Versión:** 1.0
> **Fecha:** Febrero 2026
> **Para:** Administrador del sitio Dolo Vibes
> **Nivel técnico requerido:** Ninguno

---

## Bienvenido/a

Este manual te explica paso a paso cómo administrar el contenido de tu sitio web **www.dolo-vibes.com**. No necesitas saber de programación ni de tecnología para usarlo.

Tu sitio web tiene dos partes:
- **El sitio público** (lo que ven tus clientes): [www.dolo-vibes.com](https://www.dolo-vibes.com)
- **El panel de administración** (donde tú editas el contenido): [api.dolo-vibes.com/admin](https://api.dolo-vibes.com/admin)

Piensa en el panel de administración como el "detrás de escena" de tu sitio. Todo lo que cambies ahí se reflejará en el sitio público.

---

## Tabla de Contenidos

1. [Cómo acceder al panel de administración](#1-cómo-acceder-al-panel-de-administración)
2. [Conociendo el panel: las secciones principales](#2-conociendo-el-panel-las-secciones-principales)
3. [Administrar Experiencias](#3-administrar-experiencias)
4. [Administrar Paquetes](#4-administrar-paquetes)
5. [Editar la página de inicio (Hero)](#5-editar-la-página-de-inicio-hero)
6. [Editar la página "Nosotros"](#6-editar-la-página-nosotros)
7. [Editar textos del sitio](#7-editar-textos-del-sitio)
8. [Configuración general del sitio](#8-configuración-general-del-sitio)
9. [Páginas legales](#9-páginas-legales)
10. [Subir y gestionar imágenes](#10-subir-y-gestionar-imágenes)
11. [Traducir contenido automáticamente](#11-traducir-contenido-automáticamente)
12. [Publicar y despublicar contenido](#12-publicar-y-despublicar-contenido)
13. [Qué NO tocar](#13-qué-no-tocar)
14. [Solución de problemas comunes](#14-solución-de-problemas-comunes)
15. [Glosario](#15-glosario)

---

## 1. Cómo acceder al panel de administración

### Pasos para entrar

1. Abre tu navegador (Chrome, Safari, Firefox, etc.)
2. Escribe en la barra de direcciones: **api.dolo-vibes.com/admin**
3. Verás una pantalla de inicio de sesión
4. Ingresa tu email: **info@dolo-vibes.com**
5. Ingresa tu contraseña
6. Haz clic en **"Login"** (Iniciar sesión)

### Si olvidaste tu contraseña

1. En la pantalla de login, haz clic en **"Forgot your password?"** (¿Olvidaste tu contraseña?)
2. Ingresa tu email: **info@dolo-vibes.com**
3. Revisa tu bandeja de entrada (y la carpeta de spam) — recibirás un enlace para restablecer tu contraseña
4. Haz clic en el enlace y crea una nueva contraseña

**Importante:** Si no recibes el email, contacta a tu desarrollador. Es posible que el servicio de email (Resend) necesite revisión.

---

## 2. Conociendo el panel: las secciones principales

Al entrar al panel, verás un menú en el lado izquierdo. Estas son las secciones que usarás:

### Gestor de Contenido (Content Manager)

Es la sección principal. Aquí encuentras todo el contenido de tu sitio organizado en dos categorías:

**Colecciones** (pueden tener muchas entradas):
| Nombre en el panel | Qué es | Ejemplo |
|---|---|---|
| Experience | Las experiencias/actividades que ofreces | Senderismo, Alpinismo, Escalada |
| Package | Los paquetes turísticos con detalles y precios | "Volcán Nevado de Colima 3 días" |
| Legal Page | Páginas de texto legal | Política de privacidad, Términos y condiciones |

**Tipos Únicos** (solo existe uno de cada):
| Nombre en el panel | Qué es |
|---|---|
| Hero Section | Lo primero que se ve al entrar al sitio (el video/foto grande con título) |
| About Page | El contenido de la página "Nosotros" |
| Site Setting | Configuración general: teléfono, email, redes sociales, logo |
| Site Text | Todos los textos pequeños del sitio: botones, etiquetas, mensajes |

### Biblioteca de Medios (Media Library)

Aquí se guardan todas las fotos y videos que has subido. Es como una carpeta de archivos en la nube.

---

## 3. Administrar Experiencias

Las **experiencias** son las categorías principales de actividades que ofreces (por ejemplo: Senderismo, Alpinismo, etc.). Cada experiencia puede tener varios paquetes asociados.

### Ver las experiencias existentes

1. En el menú izquierdo, haz clic en **Content Manager**
2. Selecciona **Experience** en la lista
3. Verás una tabla con todas tus experiencias

### Crear una nueva experiencia

1. Haz clic en el botón **"Create new entry"** (Crear nueva entrada) en la esquina superior derecha
2. Llena los campos:

| Campo | Qué poner | Ejemplo | Obligatorio |
|---|---|---|---|
| title | Nombre de la experiencia | "Senderismo" | Sí |
| slug | Se genera solo a partir del título | "senderismo" | Sí (automático) |
| season | Temporada: verano (summer) o invierno (winter) | "summer" | Sí |
| thumbnail | Foto para la tarjeta/miniatura | Una foto representativa | Sí |
| heroImage | Foto grande de fondo (encabezado) | Una foto panorámica | No |
| longDescription | Descripción detallada de la experiencia | Texto con formato | Sí |
| displayOrder | Número que controla el orden (menor = primero) | 1, 2, 3... | No |
| showInFooter | ¿Mostrar en el pie de página del sitio? | Sí/No | No |

3. Haz clic en **"Save"** (Guardar) para crear un borrador
4. Haz clic en **"Publish"** (Publicar) para que aparezca en el sitio público

### Editar una experiencia

1. Haz clic sobre la experiencia que quieras modificar en la lista
2. Cambia los campos que necesites
3. Haz clic en **"Save"** para guardar los cambios
4. Si la experiencia ya estaba publicada, los cambios se verán en el sitio en unos minutos

### Ordenar experiencias

Para cambiar el orden en que aparecen en el sitio:
- Modifica el campo **displayOrder** de cada experiencia
- El número más bajo aparece primero
- Ejemplo: si quieres que "Senderismo" aparezca primero, ponle `1`; si "Alpinismo" va segundo, ponle `2`

---

## 4. Administrar Paquetes

Los **paquetes** son los productos/servicios específicos que vendes (por ejemplo: "Volcán Nevado de Colima - 3 días"). Son la parte más completa del sitio.

### Ver paquetes existentes

1. En **Content Manager**, selecciona **Package**
2. Verás la lista de todos tus paquetes

### Crear un nuevo paquete

1. Haz clic en **"Create new entry"**
2. Llena los campos paso a paso:

**Información básica:**

| Campo | Qué poner | Ejemplo |
|---|---|---|
| title | Nombre del paquete | "Volcán Nevado de Colima" |
| slug | Se genera automáticamente | "volcan-nevado-de-colima" |
| experience | Selecciona la experiencia a la que pertenece | "Senderismo" |
| season | Temporada: summer o winter | "summer" |
| thumbnail | Foto para la tarjeta del paquete | Foto representativa |
| heroImage | Foto grande de encabezado | Foto panorámica |
| description | Descripción detallada con formato | Texto enriquecido |

**Detalles del paquete:**

| Campo | Qué poner | Ejemplo |
|---|---|---|
| location | Ubicación del paquete | "Jalisco, México" |
| duration | Duración | "3 días / 2 noches" |
| difficulty | Nivel de dificultad | "Moderado" |
| groupSize | Tamaño del grupo | "4-12 personas" |
| guideType | Tipo de guía | "Guía certificado" |
| availableDates | Fechas disponibles | "Todo el año" |

**Precios:**

| Campo | Qué poner | Ejemplo |
|---|---|---|
| priceAmount | Precio en euros (solo números) | 350 |
| originalPriceAmount | Precio original (si hay descuento) | 450 |
| hasDiscount | ¿Tiene descuento activo? | Sí/No |
| rating | Calificación (0 a 5) | 4.8 |

> **Nota sobre precios:** Los precios siempre se ponen en **euros (EUR)**. El sitio automáticamente los convierte a dólares (USD) y pesos mexicanos (MXN) para los visitantes.

**Itinerario (día por día):**

Para agregar los días del itinerario:
1. Busca la sección **itinerary**
2. Haz clic en **"Add an entry"** (Agregar entrada) para cada día
3. Para cada día, llena:
   - **day**: Número del día (1, 2, 3...)
   - **title**: Título del día ("Llegada y aclimatación")
   - **description**: Descripción detallada de las actividades
   - **image**: Foto del día (opcional)

**Qué incluye / Qué no incluye:**

1. Busca la sección **includes** (qué incluye)
2. Haz clic en **"Add an entry"** para cada elemento
3. Llena el **label** (nombre) y opcionalmente un **detail** (detalle)
4. Repite lo mismo para **notIncludes** (qué no incluye)

Ejemplo de "Qué incluye":
- Label: "Transporte" / Detail: "Desde el hotel hasta el punto de inicio"
- Label: "Alimentos" / Detail: "Desayuno y comida durante la excursión"

**Galería de fotos:**

1. Busca la sección **gallery**
2. Haz clic en **"Add an entry"** para cada foto
3. Sube la **image** y opcionalmente agrega un **caption** (pie de foto)

**Fechas de salida:**

1. Busca la sección **startDates**
2. Agrega cada fecha con:
   - **date**: La fecha de salida
   - **displayText**: Texto que se mostrará (opcional, ej: "Semana Santa")
   - **available**: ¿Está disponible? Sí/No

**Visibilidad en el Home:**

| Campo | Qué poner |
|---|---|
| showInHome | ¿Mostrar este paquete en la página de inicio? |
| homeDisplayOrder | Orden en el que aparece en el home (menor = primero) |
| displayOrder | Orden general en la lista de paquetes |

**SEO (opcional pero recomendado):**

1. Busca la sección **seo**
2. Llena:
   - **metaTitle**: Título que aparece en Google (máximo 60 caracteres)
   - **metaDescription**: Descripción para Google (máximo 160 caracteres)
   - **keywords**: Palabras clave separadas por comas
   - **shareImage**: Imagen que aparece al compartir en redes sociales

3. **Guarda** y **Publica** cuando todo esté listo

---

## 5. Editar la página de inicio (Hero)

La sección "Hero" es lo primero que ven los visitantes al entrar al sitio — el video/foto grande con el título principal.

1. En **Content Manager**, selecciona **Hero Section** (en la sección de "Single Types")
2. Edita los campos:

| Campo | Qué es | Ejemplo |
|---|---|---|
| title | Título principal | "Descubre la aventura" |
| titleHighlight | Parte del título que se resalta | "aventura" |
| subtitle | Texto debajo del título | "Experiencias únicas en la montaña" |
| videoDesktop | Video que se reproduce de fondo (solo en computadoras) | Archivo MP4 |
| imageMobile | Imagen que se muestra en celulares (en lugar del video) | Foto JPG/PNG |

3. Guarda y publica

> **Tip:** El video de fondo solo se reproduce en computadoras de escritorio. En celulares se muestra la imagen estática para que la página cargue rápido.

---

## 6. Editar la página "Nosotros"

1. En **Content Manager**, selecciona **About Page**
2. Edita los campos:

| Campo | Qué es |
|---|---|
| pageTitle | Título de la página |
| mainPhoto | Foto principal de la sección |
| photoAlt | Descripción de la foto (para accesibilidad) |
| origin | Sección "Origen": título + contenido |
| essence | Sección "Esencia": título + contenido |
| vision | Sección "Visión": título + contenido |
| mission | Sección "Misión": título + contenido |

Cada sección (origin, essence, vision, mission) tiene dos partes:
- **title**: El título de la sección (ej: "Nuestra Historia")
- **content**: El texto con formato de esa sección

3. Guarda y publica

---

## 7. Editar textos del sitio

La sección **Site Text** contiene **todos los textos pequeños** que aparecen en el sitio: botones, etiquetas, mensajes, preguntas del cuestionario, etc.

1. En **Content Manager**, selecciona **Site Text**
2. Verás una lista larga de campos de texto
3. Busca el texto que quieras cambiar y modifícalo
4. Guarda y publica

**Algunos ejemplos de textos que puedes cambiar:**

| Campo en el panel | Dónde aparece en el sitio |
|---|---|
| `navExperiences` | Texto del menú de navegación para "Experiencias" |
| `navAbout` | Texto del menú para "Nosotros" |
| `heroCtaButton` | Texto del botón principal del hero |
| `footerContact` | Título de la sección de contacto en el footer |
| `quoteModalTitle` | Título del formulario de cotización |
| `packageBookButton` | Texto del botón "Reservar" en los paquetes |

> **Tip:** Si no estás seguro de qué campo controla qué texto, cambia uno, guarda, y revisa el sitio para ver dónde apareció el cambio. Siempre puedes revertirlo.

---

## 8. Configuración general del sitio

La sección **Site Setting** controla información general que aparece en todo el sitio.

1. En **Content Manager**, selecciona **Site Setting**
2. Edita los campos:

**Información de la empresa:**

| Campo | Qué es | Ejemplo |
|---|---|---|
| siteName | Nombre del sitio | "Dolovibes" |
| location | Ubicación de la empresa | "Guadalajara, Jalisco, México" |
| phone | Teléfono de contacto | "+52 33 1234 5678" |
| email | Email de contacto | "info@dolo-vibes.com" |
| whatsappNumber | Número de WhatsApp | "+523312345678" |

**Redes sociales:**

| Campo | Qué poner |
|---|---|
| instagramUrl | Link completo a tu perfil de Instagram |
| facebookUrl | Link completo a tu página de Facebook |
| tiktokUrl | Link completo a tu perfil de TikTok |

**Imágenes de marca:**

| Campo | Qué es |
|---|---|
| logo | Logo principal (fondo claro) |
| logoDark | Logo para fondos oscuros |
| favicon | Icono pequeño que aparece en la pestaña del navegador |

**Activar/desactivar idiomas y divisas:**

Puedes controlar qué idiomas y divisas están disponibles para los visitantes:

| Campo | Qué controla |
|---|---|
| enableLanguageEn | ¿Mostrar inglés como opción? |
| enableLanguageIt | ¿Mostrar italiano como opción? |
| enableLanguageDe | ¿Mostrar alemán como opción? |
| enableCurrencyUsd | ¿Mostrar precios en dólares (USD)? |
| enableCurrencyMxn | ¿Mostrar precios en pesos mexicanos (MXN)? |

> **Nota:** El español (ES) y el euro (EUR) siempre están activos y no se pueden desactivar, ya que son los idiomas y divisas base del sitio.

3. Guarda y publica

---

## 9. Páginas legales

Las páginas legales (como política de privacidad, términos y condiciones, etc.) se administran como cualquier otro contenido.

### Crear una página legal

1. En **Content Manager**, selecciona **Legal Page**
2. Haz clic en **"Create new entry"**
3. Llena:
   - **title**: Título de la página (ej: "Política de Privacidad")
   - **slug**: Se genera automáticamente
   - **content**: El contenido legal con formato
   - **showInFooter**: ¿Mostrar el enlace en el pie de página?
   - **footerDisplayOrder**: Orden en el footer

4. Guarda y publica

---

## 10. Subir y gestionar imágenes

### Subir una imagen al editar contenido

Cuando un campo requiere una imagen (como `thumbnail` o `heroImage`):

1. Haz clic en el campo de imagen
2. Puedes:
   - **Subir una nueva**: Arrastra y suelta la imagen, o haz clic para seleccionar desde tu computadora
   - **Seleccionar una existente**: Busca entre las imágenes que ya has subido anteriormente

### Gestionar la biblioteca de medios

1. En el menú izquierdo, haz clic en **Media Library** (Biblioteca de medios)
2. Aquí puedes:
   - Ver todas las imágenes y videos subidos
   - Buscar archivos por nombre
   - Crear carpetas para organizar tus archivos
   - Eliminar archivos que ya no uses

### Recomendaciones para imágenes

| Tipo de imagen | Tamaño recomendado | Formato |
|---|---|---|
| Thumbnail (miniatura) | 800 x 600 px | JPG o WebP |
| Hero (encabezado) | 1920 x 1080 px | JPG o WebP |
| Galería de paquete | 1200 x 800 px | JPG o WebP |
| Logo | 300 x 100 px | PNG (fondo transparente) |
| Favicon | 32 x 32 px | PNG o ICO |

> **Tip:** Las fotos se redimensionan automáticamente para diferentes dispositivos (celular, tablet, computadora), pero entre más grande y buena calidad sea la foto original, mejor se verá.

> **Límite de archivo:** Puedes subir archivos de hasta 250 MB (útil para videos).

---

## 11. Traducir contenido automáticamente

Tu sitio soporta 4 idiomas: **Español, Inglés, Italiano y Alemán**. No necesitas traducir manualmente cada texto — el sistema puede hacerlo automáticamente.

### Cómo funciona

1. Tú creas o editas el contenido **en español** (es el idioma principal)
2. Guardas y publicas el contenido en español
3. Haces clic en el botón **"Traducir"** que aparece en el panel lateral derecho
4. El sistema traduce automáticamente el contenido a todos los demás idiomas disponibles
5. Espera unos segundos — la página se recargará automáticamente cuando termine

### Paso a paso

1. Abre cualquier experiencia, paquete, página legal, etc.
2. Asegúrate de estar en el idioma **Español (ES)** — puedes verlo en el selector de idioma del panel
3. Edita el contenido como necesites
4. **Guarda** y **Publica** el contenido en español
5. En el panel derecho, busca el botón **"Traducir"**
6. Aparecerá un mensaje de confirmación — haz clic en **"Confirmar"**
7. Espera a que termine (la página se recargará)
8. Verás una notificación verde indicando que las traducciones fueron exitosas

### Cosas importantes sobre las traducciones

- **Solo funciona desde español:** El botón "Traducir" solo aparece cuando estás viendo el contenido en español
- **Las imágenes no se traducen:** Las fotos y videos se mantienen iguales en todos los idiomas
- **Puedes revisar las traducciones:** Cambia el idioma en el selector del panel para ver cómo quedó cada traducción
- **Puedes editar traducciones manualmente:** Si una traducción automática no te convence, puedes cambiar a ese idioma y editarla directamente
- **Traduce todo automáticamente:** Traduce títulos, descripciones, itinerarios, textos de "qué incluye", etc.

---

## 12. Publicar y despublicar contenido

En Strapi, el contenido puede estar en dos estados:

| Estado | Significado | Icono |
|---|---|---|
| **Borrador** (Draft) | Solo visible en el panel admin. Los visitantes NO lo ven. | Punto azul |
| **Publicado** (Published) | Visible en el sitio público. Los visitantes SÍ lo ven. | Punto verde |

### Publicar contenido

1. Abre el contenido que quieras publicar
2. Haz clic en el botón **"Publish"** (Publicar) en la esquina superior derecha
3. El contenido será visible en el sitio público en unos minutos

### Despublicar contenido

Si quieres **ocultar** temporalmente algo del sitio sin borrarlo:

1. Abre el contenido publicado
2. Haz clic en **"Unpublish"** (Despublicar)
3. El contenido volverá a ser un borrador y desaparecerá del sitio público
4. Puedes volver a publicarlo cuando quieras

### Eliminar contenido

1. En la lista de contenido, selecciona la casilla del elemento que quieras eliminar
2. Haz clic en **"Delete"** (Eliminar)
3. Confirma la eliminación

> **Precaución:** Eliminar contenido es **permanente**. Si no estás seguro, mejor despublícalo en lugar de eliminarlo.

---

## 13. Qué NO tocar

Para evitar que el sitio deje de funcionar correctamente, **evita hacer** lo siguiente:

### En el panel de administración

- **No elimines los Single Types** (Hero Section, About Page, Site Setting, Site Text). Si los borras, partes del sitio dejarán de funcionar.
- **No cambies los nombres de los campos** ni la estructura del contenido. La programación del sitio depende de esos nombres exactos.
- **No modifiques la sección "Settings"** del panel (engranaje en el menú lateral) a menos que tu desarrollador te lo indique. Esta sección controla permisos y configuraciones técnicas.
- **No crees nuevos tipos de contenido**. Agregar nuevas colecciones o single types requiere cambios en la programación del sitio.
- **No elimines ni renombres campos de los tipos de contenido existentes** desde Settings > Content-Types Builder.

### Sobre las imágenes

- **No elimines imágenes de la biblioteca de medios** que estén siendo usadas en algún contenido. Esto causará que se vean espacios vacíos en el sitio.
- Si necesitas cambiar una imagen, **sube la nueva primero** y luego reemplaza la referencia en el contenido.

### Sobre los idiomas

- **Siempre edita primero en español** antes de usar el botón de traducir.
- **No cambies el idioma predeterminado** del sistema.

---

## 14. Solución de problemas comunes

### "El sitio no carga" o "se ve una página en blanco"

1. Verifica tu conexión a internet
2. Intenta abrir el sitio desde otro navegador o dispositivo
3. Espera 5 minutos y vuelve a intentar — puede ser un problema temporal del servidor
4. Si el problema persiste, contacta a tu desarrollador

### "No puedo entrar al panel de administración"

1. Verifica que estés escribiendo correctamente: **api.dolo-vibes.com/admin**
2. Intenta restablecer tu contraseña (ver sección 1)
3. Limpia la caché de tu navegador:
   - Chrome: Ctrl+Shift+Delete → Selecciona "Imágenes y archivos en caché" → Borrar datos
   - Safari: Preferencias → Privacidad → Administrar datos del sitio web → Eliminar todo
4. Si no funciona, contacta a tu desarrollador

### "Hice un cambio pero no se ve en el sitio"

1. **¿Publicaste el contenido?** Revisa que no esté en estado "borrador" (Draft)
2. **Limpia la caché de tu navegador** (Ctrl+Shift+Delete o Cmd+Shift+Delete)
3. **Espera unos minutos.** Los cambios pueden tardar de 1 a 5 minutos en reflejarse
4. **Prueba en una ventana de incógnito** (Ctrl+Shift+N) para ver el sitio sin caché

### "Las imágenes no se ven en el sitio"

1. Verifica que las imágenes estén correctamente asignadas en el panel admin
2. No elimines imágenes de la biblioteca de medios si están en uso
3. Si subiste una imagen nueva y no se ve, intenta con otro formato (JPG en lugar de PNG, por ejemplo)
4. Si el problema persiste, contacta a tu desarrollador — puede ser un problema con Cloudinary

### "El botón Traducir no aparece"

1. Asegúrate de estar viendo el contenido en **español (ES)** — el botón solo aparece en español
2. Asegúrate de que el contenido esté **guardado y publicado** antes de traducir
3. Verifica que estés editando un tipo de contenido que soporte traducción (experiencias, paquetes, páginas legales, textos del sitio, etc.)

### "La traducción salió mal"

1. Cambia al idioma donde la traducción salió mal usando el selector de idioma
2. Edita manualmente el texto que necesites corregir
3. Guarda y publica

### "El sitio está muy lento"

1. Esto puede suceder si el servidor (Railway) está en el plan gratuito y tiene mucho tráfico
2. Si pasa frecuentemente, contacta a tu desarrollador para evaluar un upgrade del servidor
3. También puede ser temporal — espera unos minutos y prueba de nuevo

### "Me llegó un email de un proveedor que no entiendo"

- **No ignores los emails** de GoDaddy, Vercel, Railway, Cloudinary, Resend o DeepL
- Si es sobre **renovación** o **vencimiento**, contacta a tu desarrollador inmediatamente
- Guarda los emails en una carpeta aparte para referencia

---

## 15. Glosario

Términos que encontrarás en el panel de administración y qué significan:

| Término | Significado simple |
|---|---|
| **Publicar (Publish)** | Hacer visible un contenido en el sitio público |
| **Borrador (Draft)** | Contenido guardado pero que aún no se ve en el sitio |
| **Despublicar (Unpublish)** | Ocultar contenido del sitio sin eliminarlo |
| **Entrada (Entry)** | Un elemento individual de contenido (una experiencia, un paquete, etc.) |
| **Colección (Collection)** | Un grupo de entradas del mismo tipo (todas las experiencias, todos los paquetes) |
| **Tipo Único (Single Type)** | Contenido que solo existe una vez (la configuración del sitio, la sección hero) |
| **Slug** | La parte de la dirección web que identifica al contenido. Ejemplo: en `dolo-vibes.com/es/paquetes/volcan-nevado`, el slug es "volcan-nevado" |
| **Media** | Cualquier archivo multimedia: fotos, videos, documentos |
| **Locale / Idioma** | La versión en un idioma específico del contenido |
| **Bloque (Block)** | Editor de texto con formato: negritas, listas, encabezados, etc. |
| **Componente** | Un grupo de campos que se repite dentro de una entrada (ej: cada día del itinerario) |
| **Repetible** | Un componente que puede tener muchas instancias (ej: puedes agregar 1, 2, 5 o 10 días al itinerario) |
| **SEO** | "Search Engine Optimization" — información que ayuda a que tu sitio aparezca en Google |
| **metaTitle** | El título que aparece en los resultados de Google |
| **metaDescription** | La descripción corta que aparece debajo del título en Google |
| **CTA (Call to Action)** | Un botón que invita al usuario a hacer algo ("Reservar", "Cotizar") |
| **Hero** | La sección grande y visual al inicio de una página |
| **Footer** | El pie de página del sitio (la parte de abajo con links y datos de contacto) |
| **Thumbnail** | Imagen pequeña/miniatura que representa el contenido en listas y tarjetas |
| **Caché** | Información que tu navegador guarda temporalmente para cargar más rápido. A veces necesitas borrarla para ver cambios recientes. |

---

*Si tienes dudas que no se resuelvan con este manual, contacta al equipo de desarrollo:*

| Nombre | Email |
|---|---|
| Jesús Garza | jesus.garza.gro@gmail.com |
| Armando Ochoa | armaochoa99@gmail.com |

*Documento generado el 22 de febrero de 2026.*

# Guía de Configuración GTM + GA4 — DoloVibes

> **¿Para quién es esto?** Para la persona encargada de administrar Google Tag Manager y Google Analytics 4 del sitio [dolo-vibes.com](https://www.dolo-vibes.com). Aquí encontrarás todo lo que necesitas para conectar el tracking que ya está implementado en el código con tu cuenta de GA4, paso a paso dentro de las interfaces de GTM y GA4.

---

## Contexto del sitio

Antes de entrar en materia, es importante que tengas en mente estas características del sitio porque afectan directamente cómo vas a ver los datos en tus reportes:

| Característica | Detalle |
|:---|:---|
| **Responsivo** | El mismo sitio se adapta a desktop, tablet y mobile. Todos los eventos incluyen un parámetro `device_type` para que puedas segmentar por dispositivo. |
| **Multilenguaje** | 4 idiomas: español (es), inglés (en), italiano (it), alemán (de). Cada evento lleva el idioma activo en `language`. |
| **Multimoneda** | 3 monedas: EUR, USD, MXN. Los precios de paquetes se envían tanto en EUR (precio base) como en la moneda que ve el usuario. El parámetro `currency` indica cuál está activa. |
| **Consent Mode v2** | El sitio cumple GDPR/LGPD. En países de la UE, UK y Brasil se muestra un banner de consentimiento. En el resto del mundo se otorga automáticamente. Las tags de GA4 solo disparan si `analytics_storage = granted`. |

---

## Lo que ya está implementado (no necesitas tocar código)

El frontend ya hace `dataLayer.push()` de todos los eventos automáticamente. Tú **no necesitas agregar código** al sitio. Tu trabajo es:

1. **Conectar GTM con GA4** creando las tags, triggers y variables en la interfaz de GTM
2. **Registrar las dimensiones y métricas personalizadas** en GA4 para que los parámetros aparezcan en tus reportes
3. **Validar** que todo llega correctamente con Preview + DebugView

El contenedor GTM que usa el sitio es: **`GTM-5MG9W4PF`**

---

## Parte 1 — Configuración en Google Analytics 4

### 1.1 Verificar tu propiedad GA4

1. Abre [analytics.google.com](https://analytics.google.com)
2. Haz clic en **⚙️ Admin** (esquina inferior izquierda)
3. En la columna **Property**, verifica que estés en la propiedad correcta para dolo-vibes.com
4. Si no existe, créala: **Admin → Property → Create Property** → nombre "DoloVibes - Web" → zona horaria y moneda según tu preferencia

### 1.2 Obtener el Measurement ID

Este ID es el que vas a necesitar más adelante para la tag de GTM.

1. **Admin → Data Streams**
2. Selecciona (o crea) el stream Web con el dominio `www.dolo-vibes.com`
3. Copia el **Measurement ID** — tiene formato `G-XXXXXXXXXX`
4. Guárdalo, lo vas a usar en la sección 2.4

### 1.3 Registrar Custom Dimensions (dimensiones personalizadas)

Esto es **crítico**. Si no registras las dimensiones, GA4 recibe los parámetros pero **no los muestra** en reportes ni en Explorations.

**Ruta:** Admin → Property → Data display → Custom definitions → **Create custom dimension**

Para cada dimensión, selecciona **Scope: Event** y usa el nombre del parámetro exacto como aparece abajo:

| # | Nombre para mostrar | Nombre del parámetro (Event parameter) | Descripción |
|:--|:---|:---|:---|
| 1 | Page Type | `page_type` | Tipo de página: home, experience, package, about, legal |
| 2 | Device Type | `device_type` | Dispositivo: mobile, tablet, desktop |
| 3 | Language | `language` | Idioma activo: es, en, it, de |
| 4 | Currency | `currency` | Moneda activa: EUR, USD, MXN |
| 5 | Form Type | `form_type` | Tipo de formulario: general o package |
| 6 | CTA Source | `cta_source` | Desde dónde se abrió el formulario: navbar, mobile_menu, experience_page, package_page, about_page |
| 7 | Form Step Name | `form_step_name` | Nombre del paso del formulario (trip_details, contact_info, etc.) |
| 8 | Form Error Type | `form_error_type` | Tipo de error: validation o api |
| 9 | Form Error Field | `form_error_field` | Campo que causó el error |
| 10 | Interest | `interest` | Interés seleccionado en cotización general |
| 11 | Guests | `guests` | Número de huéspedes (cotización general) |
| 12 | Contact Method | `contact_method` | Método de contacto: whatsapp, phone, email |
| 13 | Travelers | `travelers` | Número de viajeros (cotización de paquete) |
| 14 | Trip Type | `trip_type` | Tipo de viaje (cotización de paquete) |
| 15 | Package Title | `package_title` | Nombre del paquete |
| 16 | Package Slug | `package_slug` | Slug URL del paquete |
| 17 | Package Price Currency | `package_price_currency` | Moneda del precio mostrado al usuario |
| 18 | Package Location | `package_location` | Ubicación/destino del paquete |
| 19 | Package Duration | `package_duration` | Duración del paquete |
| 20 | Experience Title | `experience_title` | Nombre de la experiencia |
| 21 | Experience Slug | `experience_slug` | Slug URL de la experiencia |
| 22 | Nav Type | `nav_type` | Tipo de navegación: desktop_dropdown, mobile_menu |
| 23 | Menu Action | `menu_action` | Acción del menú mobile: open, close |
| 24 | Gallery Direction | `gallery_direction` | Dirección de navegación: next, previous |
| 25 | Gallery Nav Method | `gallery_nav_method` | Cómo navegó: button, swipe, keyboard |
| 26 | Language From | `language_from` | Idioma anterior al cambio |
| 27 | Language To | `language_to` | Idioma nuevo después del cambio |
| 28 | Currency From | `currency_from` | Moneda anterior al cambio |
| 29 | Currency To | `currency_to` | Moneda nueva después del cambio |
| 30 | Consent Status | `consent_status` | Estado de consentimiento: granted, denied |
| 31 | Consent Country | `consent_country` | País del usuario al dar consentimiento |
| 32 | Consent Language | `consent_language` | Idioma del sitio al dar consentimiento |
| 33 | Consent Currency | `consent_currency` | Moneda activa al dar consentimiento |
| 34 | Consent Source | `consent_source` | Origen: banner |
| 35 | Consent Mode Version | `consent_mode_version` | Versión del modo de consentimiento (v2) |

### 1.4 Registrar Custom Metrics (métricas personalizadas)

Estos parámetros son **numéricos** — regístralos como métricas para poder sumar, promediar y hacer cálculos en tus reportes.

**Ruta:** Admin → Property → Data display → Custom definitions → **Custom metrics** → Create custom metric

| # | Nombre para mostrar | Nombre del parámetro (Event parameter) | Unidad |
|:--|:---|:---|:---|
| 1 | Package Price EUR | `package_price_eur` | Currency (EUR) |
| 2 | Package Price Converted | `package_price_converted` | Currency |
| 3 | Form Step | `form_step` | Standard |
| 4 | Photo Count | `photo_count` | Standard |
| 5 | Gallery Photo Index | `gallery_photo_index` | Standard |
| 6 | Gallery Total Photos | `gallery_total_photos` | Standard |

> **Nota importante:** Las dimensiones y métricas personalizadas **no son retroactivas**. Solo recopilan datos desde el momento en que las creas. Por eso conviene registrarlas antes de publicar el contenedor de GTM.

### 1.5 Marcar eventos como conversiones (Key Events)

**Ruta:** Admin → Data display → Events

Cuando empieces a recibir eventos, marca como conversión (**Key Event**):

| Evento | ¿Por qué? |
|:---|:---|
| `submit_quote_form` | **Obligatorio.** Es la acción de mayor valor — alguien pidió cotización. |
| `open_quote_form` | Opcional. Útil para medir intención aunque no completen el formulario. |

---

## Parte 2 — Configuración en Google Tag Manager

### 2.1 Verificar el contenedor

1. Abre [tagmanager.google.com](https://tagmanager.google.com)
2. Selecciona la cuenta de DoloVibes
3. Verifica que el **Container ID** sea **`GTM-5MG9W4PF`**
4. Entra al workspace

### 2.2 Crear las Variables de Data Layer (DLV)

Cada parámetro que el sitio envía al dataLayer necesita una variable en GTM para que puedas usarlo en tus tags.

**Ruta:** Variables → User-Defined Variables → **New**

Para cada variable:
- **Variable Type:** Data Layer Variable
- **Data Layer Variable Name:** el nombre exacto del parámetro (tal como aparece en la columna "Nombre de la variable")
- **Data Layer Version:** Version 2
- **Default Value:** déjalo vacío

**Convención de nombres:** usa el prefijo `DLV -` para identificarlas rápido.

Crea las siguientes variables:

#### Variables de contexto (presentes en todos los eventos)

| Nombre en GTM | Data Layer Variable Name |
|:---|:---|
| DLV - device_type | `device_type` |
| DLV - language | `language` |
| DLV - currency | `currency` |

#### Variables de página y navegación

| Nombre en GTM | Data Layer Variable Name |
|:---|:---|
| DLV - page_type | `page_type` |
| DLV - experience_title | `experience_title` |
| DLV - experience_slug | `experience_slug` |
| DLV - nav_type | `nav_type` |
| DLV - menu_action | `menu_action` |

#### Variables de paquetes

| Nombre en GTM | Data Layer Variable Name |
|:---|:---|
| DLV - package_title | `package_title` |
| DLV - package_slug | `package_slug` |
| DLV - package_price_eur | `package_price_eur` |
| DLV - package_price_converted | `package_price_converted` |
| DLV - package_price_currency | `package_price_currency` |
| DLV - package_location | `package_location` |
| DLV - package_duration | `package_duration` |

#### Variables de formularios

| Nombre en GTM | Data Layer Variable Name |
|:---|:---|
| DLV - form_type | `form_type` |
| DLV - cta_source | `cta_source` |
| DLV - form_step | `form_step` |
| DLV - form_step_name | `form_step_name` |
| DLV - form_error_type | `form_error_type` |
| DLV - form_error_field | `form_error_field` |
| DLV - interest | `interest` |
| DLV - guests | `guests` |
| DLV - contact_method | `contact_method` |
| DLV - travelers | `travelers` |
| DLV - trip_type | `trip_type` |

#### Variables de galería

| Nombre en GTM | Data Layer Variable Name |
|:---|:---|
| DLV - photo_count | `photo_count` |
| DLV - gallery_direction | `gallery_direction` |
| DLV - gallery_nav_method | `gallery_nav_method` |
| DLV - gallery_photo_index | `gallery_photo_index` |
| DLV - gallery_total_photos | `gallery_total_photos` |

#### Variables de idioma y moneda (cambios)

| Nombre en GTM | Data Layer Variable Name |
|:---|:---|
| DLV - language_from | `language_from` |
| DLV - language_to | `language_to` |
| DLV - currency_from | `currency_from` |
| DLV - currency_to | `currency_to` |

#### Variables de consentimiento

| Nombre en GTM | Data Layer Variable Name |
|:---|:---|
| DLV - consent_status | `consent_status` |
| DLV - consent_country | `consent_country` |
| DLV - consent_language | `consent_language` |
| DLV - consent_currency | `consent_currency` |
| DLV - consent_source | `consent_source` |
| DLV - consent_mode_version | `consent_mode_version` |

### 2.3 Crear los Triggers

Necesitas un trigger por cada evento custom. Esto te da control granular sobre qué tag dispara para qué evento.

**Ruta:** Triggers → **New** → Trigger Type: **Custom Event**

| Nombre del Trigger | Event Name (exacto) | Regex |
|:---|:---|:---|
| CE - page_view | `page_view` | No |
| CE - view_experience | `view_experience` | No |
| CE - view_package | `view_package` | No |
| CE - open_quote_form | `open_quote_form` | No |
| CE - submit_quote_form | `submit_quote_form` | No |
| CE - form_step | `form_step` | No |
| CE - form_error | `form_error` | No |
| CE - language_change | `language_change` | No |
| CE - currency_change | `currency_change` | No |
| CE - open_gallery | `open_gallery` | No |
| CE - gallery_navigate | `gallery_navigate` | No |
| CE - nav_experience_click | `nav_experience_click` | No |
| CE - nav_mobile_menu | `nav_mobile_menu` | No |
| CE - cookie_consent_granted | `cookie_consent_granted` | No |
| CE - cookie_consent_denied | `cookie_consent_denied` | No |

> **Alternativa rápida:** Si prefieres una sola tag universal, puedes crear un trigger único con Event Name `.*` y regex activado. La desventaja es que enviarás parámetros vacíos para eventos que no los usan. La ventaja es que es más rápido de configurar. Abajo te explico ambos enfoques.

### 2.4 Crear la Tag de Configuración GA4

Esta es la tag principal que conecta GTM con tu propiedad de GA4.

1. **Tags → New**
2. **Tag Type:** Google Tag (en versiones recientes de GTM) o GA4 Configuration
3. **Tag ID:** tu Measurement ID (`G-XXXXXXXXXX` — el que copiaste en la sección 1.2)
4. **Trigger:** All Pages
5. **Configuración importante:**
   - En **Configuration settings**, busca la opción **"Send a page view event when this configuration loads"**
   - **Desactívala.** El sitio ya envía su propio `page_view` con parámetros enriquecidos (`page_type`, `language`, `currency`). Si la dejas activada, tendrás page views duplicados.
6. **Nombre:** `GA4 - Config`
7. **Consent Settings** (en la parte inferior de la tag):
   - Built-in consent checks: **analytics_storage**
   - Esto asegura que la tag solo dispara cuando el usuario otorgó consentimiento

### 2.5 Crear las Tags de Evento GA4

Tienes dos enfoques. Elige el que se adapte a tu forma de trabajar:

---

#### Enfoque A — Tag Universal (más rápido, menos preciso)

Una sola tag que reenvía TODOS los eventos con TODOS los parámetros.

1. **Tags → New**
2. **Tag Type:** GA4 Event
3. **Measurement ID:** tu `G-XXXXXXXXXX` (o selecciona `GA4 - Config` como Configuration Tag)
4. **Event Name:** `{{Event}}` — esta es una variable built-in de GTM. Si no la ves disponible, actívala en **Variables → Built-In Variables → Configure** y marca la casilla **Event**.
5. **Event Parameters** — agrega TODOS los parámetros listados en la sección 2.2 (columna izquierda = nombre del parámetro, columna derecha = `{{DLV - nombre}}`)
6. **Trigger:** un Custom Event con Event Name `.*` (regex activado)
7. **Nombre:** `GA4 - All Events`

> Ten en cuenta que con este enfoque, GA4 recibirá parámetros con valor vacío para eventos que no los incluyen (ej. `package_title` llegará vacío en un `page_view`). Esto no causa errores pero ensucía un poco los datos.

---

#### Enfoque B — Tags por grupo de eventos (recomendado)

Más trabajo inicial pero datos más limpios. Crea una tag por cada grupo lógico de eventos, enviando solo los parámetros relevantes.

En cada tag, el formato de los Event Parameters es:
- **Columna izquierda (Parameter Name):** el nombre exacto del parámetro
- **Columna derecha (Value):** la variable DLV correspondiente, ej: `{{DLV - package_title}}`

---

**Tag: GA4 - Page View**
- Event Name: `page_view`
- Parámetros: `page_type`, `device_type`, `language`, `currency`
- Trigger: CE - page_view

**Tag: GA4 - Experience View**
- Event Name: `view_experience`
- Parámetros: `experience_title`, `experience_slug`, `device_type`, `language`, `currency`
- Trigger: CE - view_experience

**Tag: GA4 - Package View**
- Event Name: `view_package`
- Parámetros: `package_title`, `package_slug`, `package_price_eur`, `package_price_converted`, `package_price_currency`, `package_location`, `package_duration`, `device_type`, `language`, `currency`
- Trigger: CE - view_package

**Tag: GA4 - Quote Form Open**
- Event Name: `open_quote_form`
- Parámetros: `form_type`, `interest`, `cta_source`, `package_title`, `device_type`, `language`, `currency`
- Trigger: CE - open_quote_form
- Nota: `interest` y `cta_source` se llenan cuando `form_type=general`. `package_title` se llena cuando `form_type=package`. El otro quedará vacío, esto es normal.

**Tag: GA4 - Quote Form Submit**
- Event Name: `submit_quote_form`
- Parámetros: `form_type`, `interest`, `guests`, `contact_method`, `package_title`, `travelers`, `trip_type`, `device_type`, `language`, `currency`
- Trigger: CE - submit_quote_form
- Nota: Misma lógica — los parámetros de cotización general (`interest`, `guests`) y los de paquete (`package_title`, `travelers`, `trip_type`) se llenan según `form_type`. `contact_method` siempre está presente.

**Tag: GA4 - Form Step**
- Event Name: `form_step`
- Parámetros: `form_type`, `form_step`, `form_step_name`, `device_type`, `language`, `currency`
- Trigger: CE - form_step

**Tag: GA4 - Form Error**
- Event Name: `form_error`
- Parámetros: `form_type`, `form_error_type`, `form_error_field`, `device_type`, `language`, `currency`
- Trigger: CE - form_error

**Tag: GA4 - Language Change**
- Event Name: `language_change`
- Parámetros: `language_from`, `language_to`, `device_type`, `language`, `currency`
- Trigger: CE - language_change

**Tag: GA4 - Currency Change**
- Event Name: `currency_change`
- Parámetros: `currency_from`, `currency_to`, `device_type`, `language`, `currency`
- Trigger: CE - currency_change

**Tag: GA4 - Gallery Open**
- Event Name: `open_gallery`
- Parámetros: `package_title`, `package_slug`, `photo_count`, `device_type`, `language`, `currency`
- Trigger: CE - open_gallery

**Tag: GA4 - Gallery Navigate**
- Event Name: `gallery_navigate`
- Parámetros: `package_slug`, `gallery_direction`, `gallery_nav_method`, `gallery_photo_index`, `gallery_total_photos`, `device_type`, `language`, `currency`
- Trigger: CE - gallery_navigate

**Tag: GA4 - Nav Experience Click**
- Event Name: `nav_experience_click`
- Parámetros: `experience_title`, `experience_slug`, `nav_type`, `device_type`, `language`, `currency`
- Trigger: CE - nav_experience_click

**Tag: GA4 - Nav Mobile Menu**
- Event Name: `nav_mobile_menu`
- Parámetros: `menu_action`, `device_type`, `language`, `currency`
- Trigger: CE - nav_mobile_menu

**Tag: GA4 - Consent Granted**
- Event Name: `cookie_consent_granted`
- Parámetros: `consent_status`, `consent_country`, `consent_language`, `consent_currency`, `consent_source`, `consent_mode_version`
- Trigger: CE - cookie_consent_granted
- Nota sobre Consent Settings: esta tag **no** necesita requerir `analytics_storage` ya que el propio evento indica que el usuario acaba de otorgar consentimiento.

**Tag: GA4 - Consent Denied**
- Event Name: `cookie_consent_denied`
- Parámetros: `consent_status`, `consent_country`, `consent_language`, `consent_currency`, `consent_source`, `consent_mode_version`
- Trigger: CE - cookie_consent_denied
- Nota sobre Consent Settings: igual que la anterior, no requiere `analytics_storage` para poder registrar el rechazo.

### 2.6 Configurar Consent en las Tags

Para cada tag de evento GA4 **excepto las de consentimiento** (Consent Granted y Consent Denied) y la tag de configuración:

1. Abre la tag → scroll hasta la sección **Consent Settings**
2. En **Additional consent checks**: selecciona **Require additional consent for tag to fire**
3. En **Required consent types**: agrega `analytics_storage`
4. Guarda

Esto asegura que si un usuario de la UE rechaza cookies, ninguna tag de analytics dispara — exactamente como debe ser. Las tags de consentimiento son la excepción porque necesitan registrar la decisión del usuario independientemente del estado de consent.

---

## Parte 3 — Validación (QA)

### 3.1 Preview en GTM (Tag Assistant)

1. En GTM, haz clic en **Preview** (botón arriba a la derecha del workspace)
2. Ingresa la URL del sitio (idealmente un ambiente de staging)
3. Se abrirá Tag Assistant en una pestaña nueva conectado al sitio

Lo que debes verificar:
- En la columna izquierda verás la lista de eventos que se disparan
- Al hacer clic en cada evento, verifica que las tags correctas aparecen en **"Tags Fired"**
- En la pestaña **"Data Layer"** del evento, confirma que los parámetros tienen los valores esperados

### 3.2 Matriz mínima de pruebas

Ejecuta estos escenarios cubriendo al menos **2 combinaciones de dispositivo × idioma × moneda**:

| # | Escenario | Qué verificar en Tag Assistant |
|:--|:---|:---|
| 1 | Cargar la home | `page_view` con `page_type=home` |
| 2 | Navegar a una experiencia **desde el menú desktop** | `nav_experience_click` con `nav_type=desktop_dropdown`, luego `page_view` con `page_type=experience` y `view_experience` |
| 3 | Navegar a una experiencia **desde el menú mobile** | `nav_mobile_menu` con `menu_action=open`, `nav_experience_click` con `nav_type=mobile_menu` |
| 4 | Abrir un paquete | `page_view` con `page_type=package` y `view_package` con precios y moneda correctos |
| 5 | Cambiar idioma (ej. es→en) | `language_change` con `language_from=es`, `language_to=en` |
| 6 | Cambiar moneda (ej. EUR→USD) | `currency_change` con `currency_from=EUR`, `currency_to=USD` |
| 7 | Volver a ver un paquete después de cambiar moneda | `view_package` con `package_price_currency=USD` y `package_price_converted` diferente al `package_price_eur` |
| 8 | Abrir formulario de cotización general desde navbar | `open_quote_form` con `form_type=general`, `cta_source=navbar` |
| 9 | Abrir formulario de cotización general desde menú mobile | `open_quote_form` con `form_type=general`, `cta_source=mobile_menu` |
| 10 | Avanzar pasos del formulario general | `form_step` con `form_step=1` y `form_step_name=trip_details`, luego `form_step=2` y `form_step_name=contact_info` |
| 11 | Provocar error de validación (dejar campos vacíos y avanzar) | `form_error` con `form_error_type=validation` |
| 12 | Enviar formulario general exitosamente | `submit_quote_form` con `form_type=general`, `contact_method` correcto |
| 13 | Abrir formulario de cotización desde un paquete | `open_quote_form` con `form_type=package`, `package_title` del paquete |
| 14 | Enviar formulario de paquete exitosamente | `submit_quote_form` con `form_type=package`, `package_title`, `travelers`, `trip_type` |
| 15 | Abrir galería de fotos de un paquete | `open_gallery` con `photo_count` > 0, `package_title` correcto |
| 16 | Navegar fotos con botones | `gallery_navigate` con `gallery_nav_method=button`, `gallery_direction=next` o `previous` |
| 17 | Navegar fotos con teclas de flechas | `gallery_navigate` con `gallery_nav_method=keyboard` |
| 18 | En mobile: navegar fotos con swipe | `gallery_navigate` con `gallery_nav_method=swipe` |
| 19 | Aceptar cookies (limpiar localStorage, simular IP de UE) | `cookie_consent_granted` con `consent_status=granted`, `consent_country` correcto |
| 20 | Rechazar cookies | `cookie_consent_denied` con `consent_status=denied` |

### 3.3 DebugView en GA4

Una vez que confirmas que los eventos se disparan correctamente en GTM Preview:

1. Abre **GA4 → Admin → DebugView**
2. Mantén Tag Assistant conectado y repite los escenarios
3. En DebugView verás los eventos llegar en tiempo real con todos sus parámetros
4. Haz clic en cada evento para verificar que los parámetros personalizados aparecen correctamente

> Si un parámetro aparece en Tag Assistant pero no en DebugView, probablemente te falta registrar la dimensión o métrica personalizada en la sección 1.3/1.4.

---

## Parte 4 — Publicación

### 4.1 Checklist antes de publicar

- [ ] Todas las variables DLV creadas (sección 2.2)
- [ ] Todos los triggers creados (sección 2.3)
- [ ] Tag de configuración GA4 creada con page_view automático **desactivado** (sección 2.4)
- [ ] Tags de evento creadas con sus parámetros (sección 2.5)
- [ ] Consent settings configurados en todas las tags excepto las de consentimiento (sección 2.6)
- [ ] Todas las custom dimensions registradas en GA4 (sección 1.3)
- [ ] Todas las custom metrics registradas en GA4 (sección 1.4)
- [ ] `submit_quote_form` marcado como Key Event (sección 1.5)
- [ ] Matriz de pruebas ejecutada en Preview sin errores (sección 3.2)
- [ ] DebugView confirma que los eventos llegan con parámetros correctos (sección 3.3)

### 4.2 Publicar el contenedor

1. En GTM → **Submit** (botón arriba a la derecha)
2. **Version Name:** algo descriptivo, ej: `v1.0 - GA4 analytics + consent mode v2`
3. **Version Description:** lista breve de lo configurado
4. Haz clic en **Publish**

### 4.3 Verificación post-publicación

1. Espera 15-30 minutos
2. Abre **GA4 → Reports → Realtime** y navega el sitio en producción
3. Confirma que ves eventos llegando
4. En las siguientes 24-48 horas, revisa los reportes estándar

### 4.4 Rollback (si algo sale mal)

Si detectas algún problema después de publicar:

1. En GTM → **Admin → Container → Versions**
2. Selecciona la versión anterior
3. Haz clic en **Publish** sobre esa versión
4. El cambio se aplica en segundos, sin necesidad de tocar el código del sitio

---

## Referencia rápida — Catálogo completo de eventos

### Navegación y vistas

| Evento | ¿Cuándo se dispara? | Parámetros específicos |
|:---|:---|:---|
| `page_view` | Cada cambio de ruta (home, experiencia, paquete, about, legal) | `page_type` |
| `view_experience` | Al cargar una página de experiencia | `experience_title`, `experience_slug` |
| `view_package` | Al cargar una página de paquete (se re-dispara si cambia la moneda) | `package_title`, `package_slug`, `package_price_eur`, `package_price_converted`, `package_price_currency`, `package_location`, `package_duration` |
| `nav_experience_click` | Clic en una experiencia desde la barra de navegación | `experience_title`, `experience_slug`, `nav_type` |
| `nav_mobile_menu` | Abrir o cerrar el menú hamburguesa en mobile/tablet | `menu_action` |

### Formularios de cotización

| Evento | ¿Cuándo se dispara? | Parámetros específicos |
|:---|:---|:---|
| `open_quote_form` | Se abre el modal del formulario de cotización | `form_type`, `interest` (general), `cta_source` (general), `package_title` (package) |
| `form_step` | El usuario avanza un paso en el formulario | `form_type`, `form_step`, `form_step_name` |
| `form_error` | Error de validación en un campo o error de API al enviar | `form_type`, `form_error_type`, `form_error_field` |
| `submit_quote_form` | Envío exitoso del formulario | `form_type`, `interest` (general), `guests` (general), `contact_method`, `package_title` (package), `travelers` (package), `trip_type` (package) |

### Galería de fotos

| Evento | ¿Cuándo se dispara? | Parámetros específicos |
|:---|:---|:---|
| `open_gallery` | Se abre la galería de fotos de un paquete | `package_title`, `package_slug`, `photo_count` |
| `gallery_navigate` | El usuario cambia de foto (botón, swipe o teclado) | `package_slug`, `gallery_direction`, `gallery_nav_method`, `gallery_photo_index`, `gallery_total_photos` |

### Preferencias del usuario

| Evento | ¿Cuándo se dispara? | Parámetros específicos |
|:---|:---|:---|
| `language_change` | El usuario cambia de idioma desde el selector | `language_from`, `language_to` |
| `currency_change` | El usuario cambia de moneda desde el selector | `currency_from`, `currency_to` |

### Consentimiento de cookies

| Evento | ¿Cuándo se dispara? | Parámetros específicos |
|:---|:---|:---|
| `cookie_consent_granted` | El usuario acepta cookies desde el banner (solo UE/UK/Brasil) | `consent_status`, `consent_country`, `consent_language`, `consent_currency`, `consent_source`, `consent_mode_version` |
| `cookie_consent_denied` | El usuario rechaza cookies desde el banner | `consent_status`, `consent_country`, `consent_language`, `consent_currency`, `consent_source`, `consent_mode_version` |

> **Recuerda:** todos los eventos **excepto los de consentimiento** incluyen además `device_type`, `language` y `currency` automáticamente. Los eventos `cookie_consent_granted` y `cookie_consent_denied` tienen sus propios parámetros de contexto (`consent_language`, `consent_currency`, `consent_country`) en lugar de los globales.

---

## Solución de problemas

### No llegan eventos a GA4

1. Verifica que `VITE_GTM_ID` esté definido en el entorno de producción del frontend
2. Verifica que el contenedor GTM esté publicado (no solo en borrador)
3. Verifica que el Measurement ID en la tag `GA4 - Config` sea correcto
4. Revisa en Tag Assistant que las tags aparezcan en "Tags Fired", no en "Tags Not Fired"

### Eventos llegan pero sin parámetros personalizados

1. Verifica que las variables DLV estén creadas con el **nombre exacto** del parámetro (case-sensitive, todo en minúsculas con guiones bajos)
2. Verifica que los parámetros estén mapeados en la tag de evento GA4 (columna izquierda = nombre, columna derecha = `{{DLV - nombre}}`)
3. Verifica que las dimensiones/métricas personalizadas estén registradas en GA4 (secciones 1.3 y 1.4)

### Los eventos no disparan en usuarios de UE

Esto es **comportamiento correcto** si el usuario rechazó cookies. Verifica en Tag Assistant la pestaña **Consent** — `analytics_storage` debería estar en `denied`. Los eventos solo se procesan cuando está en `granted`.

### device_type siempre dice "desktop" en pruebas mobile

Si estás probando con DevTools en modo responsive, es posible que `pointer: coarse` no se emule correctamente. Prueba en un dispositivo real o en un emulador completo para validar la detección.

### Diferencias entre el formulario general y el de paquete

Ambos usan los mismos nombres de evento (`open_quote_form`, `submit_quote_form`, etc.) pero se distinguen por el parámetro `form_type`:
- `form_type = general` → formulario de cotización general (incluye `interest`, `guests`, `cta_source`)
- `form_type = package` → formulario de cotización de paquete específico (incluye `package_title`, `travelers`, `trip_type`)

Filtra por `form_type` en tus reportes para separarlos.

### view_package se dispara más de una vez sin cambiar de página

Esto pasa cuando el usuario cambia de moneda estando en la página de un paquete. El sitio re-dispara `view_package` con los precios actualizados en la nueva moneda. Es comportamiento intencional para que siempre tengas el precio correcto asociado al evento.

---

*Guía preparada por el equipo de desarrollo de DoloVibes — marzo 2026*

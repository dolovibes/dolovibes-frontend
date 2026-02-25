# 📕 Calendario de Renovaciones y Checklist de Salud del Sitio — Dolo Vibes

> **Versión:** 1.0 &nbsp;|&nbsp; **Fecha:** Febrero 2026 &nbsp;|&nbsp; **Para:** Propietario del sitio

| | |
|---|---|
| **Sitio web** | [www.dolo-vibes.com](https://www.dolo-vibes.com) |
| **Panel admin** | [api.dolo-vibes.com/admin](https://api.dolo-vibes.com/admin) |

> 💡 **TIP:** Imprime este documento o guárdalo accesible. Revisarlo mensualmente te dará tranquilidad de que todo funciona.

---

## 📑 Tabla de Contenidos

| # | Sección |
|---|---------|
| 1 | [Calendario de renovaciones anuales](#1--calendario-de-renovaciones-anuales) |
| 2 | [Checklist mensual — 5 minutos (lo haces tú)](#2--checklist-mensual--5-minutos-lo-haces-tú) |
| 3 | [Checklist trimestral — Con el desarrollador](#3--checklist-trimestral--con-el-desarrollador) |
| 4 | [Qué hacer en caso de emergencia](#4--qué-hacer-en-caso-de-emergencia) |
| 5 | [Registro de revisiones](#5--registro-de-revisiones) |

---

## 1. 📅 Calendario de renovaciones anuales

### Servicios con renovación obligatoria

| Servicio | Qué se renueva | Frecuencia | Criticidad | Fecha de vencimiento |
|---|---|---|---|---|
| 🌐 **GoDaddy** | Dominio dolo-vibes.com | **Anual** | 🔴 **ALTA** — Si vence, todo el sitio deja de funcionar | Consultar con el admin de GoDaddy |
| 🚂 **Railway** | Consumo y límites del plan | **Mensual** | 🟡 **MEDIA** — Puede causar lentitud | Revisar cada mes |

### Servicios con API Keys que requieren monitoreo

| Servicio | Qué revisar | Frecuencia | Criticidad |
|---|---|---|---|
| 🌍 **DeepL** | API Key activa + límite mensual | Cada 6 meses | 🟢 BAJA — Solo afecta traducción |
| 📧 **Resend** | Que los emails se envíen | Cada 3 meses | 🟡 MEDIA — Sin emails no recibes cotizaciones |
| 💱 **ExchangeRate** | API Key activa + límite | Cada 6 meses | 🟢 BAJA — El sitio tiene precios de respaldo |
| 🖼️ **Cloudinary** | Espacio de almacenamiento | Cada 6 meses | 🟡 MEDIA — Sin espacio no puedes subir fotos |

### Vista anual

```
          ENE   FEB   MAR   ABR   MAY   JUN   JUL   AGO   SEP   OCT   NOV   DIC
          ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ─────
 🌐       │               ★ Renovar dominio (ver fecha en cuenta GoDaddy)       │
 Dominio  │               CRÍTICO — Si vence, TODO deja de funcionar            │
          │                                                                     │
 🚂       ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓
 Railway  │     Revisión mensual de consumo y rendimiento                       │
          │                                                                     │
 📋             ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓
 Mensual  │     Checklist de 5 minutos (lo haces tú)                            │
          │                                                                     │
 🔧             ✓                 ✓                 ✓                 ✓
 Trimest. │     Con tu desarrollador cada 3 meses                               │
          │                                                                     │
 🔑             ✓                                   ✓
 API Keys │     Revisión de llaves cada 6 meses                                 │
          ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ─────

 ★ = Fecha de vencimiento del dominio (revisar en cuenta GoDaddy)
 ✓ = Revisión programada
```

---

## 2. ✅ Checklist mensual — 5 minutos (lo haces tú)

> 💡 Estas verificaciones las puedes hacer **una vez al mes** sin necesidad de tu desarrollador.

---

### Verificación 1: ¿El sitio carga correctamente?

| Paso | Acción |
|:---:|---|
| 1 | Abre [www.dolo-vibes.com](https://www.dolo-vibes.com) en tu navegador |
| 2 | ¿Ves la página de inicio con el video/foto y el título? |

| Resultado | Acción |
|---|---|
| ✅ Carga en menos de 5 segundos | Todo bien |
| ❌ No carga | → Ver sección [4.1](#41-el-sitio-no-carga) |

---

### Verificación 2: ¿El panel admin funciona?

| Paso | Acción |
|:---:|---|
| 1 | Abre [api.dolo-vibes.com/admin](https://api.dolo-vibes.com/admin) |
| 2 | ¿Puedes iniciar sesión y ver contenido? |

| Resultado | Acción |
|---|---|
| ✅ Acceso normal | Todo bien |
| ❌ No puedo entrar | → Ver sección [4.2](#42-no-puedo-entrar-al-panel) |

---

### Verificación 3: ¿Las imágenes se muestran?

| Paso | Acción |
|:---:|---|
| 1 | Navega a cualquier experiencia o paquete en el sitio público |
| 2 | ¿Las fotos se ven correctamente? |

| Resultado | Acción |
|---|---|
| ✅ Todas las imágenes cargan | Todo bien |
| ❌ Faltan imágenes | → Ver sección [4.4](#44-las-imágenes-no-se-ven) |

---

### Verificación 4: ¿Los formularios de cotización funcionan?

| Paso | Acción |
|:---:|---|
| 1 | Haz clic en el botón de cotización en el sitio |
| 2 | Llena con datos de prueba (usa tu email) |
| 3 | Envía y revisa si recibes el email (también en spam) |

| Resultado | Acción |
|---|---|
| ✅ Email recibido en menos de 5 min | Todo bien |
| ❌ No llega | → Ver sección [4.5](#45-no-recibo-emails-de-cotización) |

---

### Verificación 5: ¿El sitio carga rápido?

| Paso | Acción |
|:---:|---|
| 1 | Abre el sitio desde tu celular con datos móviles (no WiFi) |
| 2 | ¿Carga en menos de 5 segundos? |

| Resultado | Acción |
|---|---|
| ✅ Carga en 3-5 segundos | Todo bien |
| ❌ Tarda más de 10 segundos | → Ver sección [4.6](#46-el-sitio-está-muy-lento) |

---

### Verificación 6: ¿Idiomas y divisas funcionan?

| Paso | Acción |
|:---:|---|
| 1 | Cambia el idioma (banderas en la barra de navegación) |
| 2 | Cambia la divisa (EUR, USD, MXN) |
| 3 | ¿Los textos y precios cambian correctamente? |

| Resultado | Acción |
|---|---|
| ✅ Todo cambia correctamente | Todo bien |
| ❌ Idiomas no cambian | Contacta al equipo de desarrollo |
| ❌ Divisas no cambian | Probablemente temporal, revisa en 24h |

---

### Verificación 7: ¿Hay avisos en tu email?

| Paso | Acción |
|:---:|---|
| 1 | Revisa la bandeja de info@dolo-vibes.com |
| 2 | Busca emails de: GoDaddy, Vercel, Railway, Cloudinary, Resend, DeepL |

| Resultado | Acción |
|---|---|
| ✅ No hay alertas | Todo bien |
| ⚠️ Hay un aviso que no entiendo | Reenvíalo al equipo de desarrollo |
| 🔴 Aviso de vencimiento o cobro | Contacta al equipo de desarrollo **inmediatamente** |

---

## 3. 🔧 Checklist trimestral — Con el desarrollador

> Cada **3 meses**, contacta al equipo de desarrollo para estas verificaciones técnicas.

---

### 🔑 1. API Keys activas

| Servicio | Verificación |
|---|---|
| DeepL | ☐ API Key funciona + consumo de caracteres |
| Resend | ☐ API Key funciona + emails enviados |
| ExchangeRate | ☐ API Key funciona + consumo de peticiones |
| Cloudinary | ☐ API Key funciona + consumo de créditos |

---

### 🐘 2. Base de datos (Railway)

| Verificación | Estado |
|---|---|
| ☐ Estado de PostgreSQL | OK / Problema |
| ☐ Espacio utilizado | _____ MB |
| ☐ Backup manual realizado | Sí / No |
| ☐ Backup guardado en lugar seguro | Sí / No |

> 🔴 **IMPORTANTE:** Si no hay backups automáticos (plan gratuito), hacer `pg_dump` manualmente y guardar el archivo en Google Drive o disco local.

---

### 🚂 3. Servidor (Railway)

| Verificación | Estado |
|---|---|
| ☐ Consumo de CPU/RAM del trimestre | Normal / Alto |
| ☐ Reinicios inesperados | Sí / No |
| ☐ Plan actual suficiente | Sí / Evaluar upgrade |
| ☐ Logs revisados por errores | OK / Errores |

---

### 🖼️ 4. Almacenamiento (Cloudinary)

| Verificación | Estado |
|---|---|
| ☐ Créditos consumidos del trimestre | _____ / 25 |
| ☐ Espacio de almacenamiento | _____ MB |
| ☐ Archivos no utilizados eliminados | Sí / No aplica |

---

### 🔒 5. Seguridad

| Verificación | Estado |
|---|---|
| ☐ Certificado SSL activo en ambos dominios | Sí / No |
| ☐ Sin accesos no autorizados en Strapi admin | Sí / No |
| ☐ `npm audit` ejecutado en ambos repos | OK / Vulnerabilidades |

---

### ⚡ 6. Rendimiento

| Verificación | Estado |
|---|---|
| ☐ PageSpeed Insights (www.dolo-vibes.com) | Score: _____ |
| ☐ Imágenes sirviendo desde Cloudinary | Sí / No |
| ☐ Compresión gzip/brotli funcionando | Sí / No |

---

## 4. 🚨 Qué hacer en caso de emergencia

> Antes de llamar al equipo de desarrollo, intenta estos pasos. Te ayudarán a identificar el problema.

---

### 4.1. "El sitio no carga"

| # | Qué hacer | Si pasa... |
|:---:|---|---|
| 1 | ¿Puedes abrir Google.com? | No → Es tu internet, no el sitio |
| 2 | Abre el sitio desde el celular con datos | Funciona → Es tu computadora/WiFi |
| 3 | Abre api.dolo-vibes.com/admin | Admin carga pero sitio no → Problema en Vercel |
| | | Ninguno carga → Dominio o Railway |
| 4 | ¿Hay email de GoDaddy sobre vencimiento? | Sí → Renueva **inmediatamente** |
| 5 | Espera 15 minutos y vuelve a intentar | A veces se resuelve solo |
| 6 | **Si nada funciona** → Contacta al equipo de desarrollo | — |

**Qué decirles:**
- ¿Desde cuándo no funciona?
- ¿Qué mensaje de error ves?
- ¿Funciona desde otros dispositivos?
- ¿El admin funciona?

---

### 4.2. "No puedo entrar al panel"

| # | Qué hacer |
|:---:|---|
| 1 | Verifica la URL: **api.dolo-vibes.com/admin** |
| 2 | Verifica email y contraseña |
| 3 | Haz clic en "Forgot your password?" → revisa email (y spam) |
| 4 | Limpia caché: `Ctrl+Shift+Delete` → "Imágenes y archivos" → Borrar |
| 5 | Prueba en ventana de incógnito: `Ctrl+Shift+N` |
| 6 | **Si nada funciona** → Contacta al equipo de desarrollo |

---

### 4.3. "Hice un cambio y no se ve"

| # | Qué hacer |
|:---:|---|
| 1 | ¿Publicaste? Si ves el botón "Publish" → haz clic |
| 2 | Espera 2-5 minutos |
| 3 | Limpia caché: `Ctrl+Shift+Delete` |
| 4 | Prueba en incógnito: `Ctrl+Shift+N` |
| 5 | Si después de 10 min no aparece → contacta al equipo |

---

### 4.4. "Las imágenes no se ven"

| # | Qué hacer |
|:---:|---|
| 1 | ¿Ninguna se ve? → Problema temporal de Cloudinary, espera 15 min |
| 2 | ¿Solo faltan algunas? → Verifica que estén asignadas en el panel admin |
| 3 | ¿Eliminaste alguna de la biblioteca? → Sube de nuevo y asígnala |
| 4 | **No toques nada más** → Contacta al equipo de desarrollo |

---

### 4.5. "No recibo emails de cotización"

| # | Qué hacer |
|:---:|---|
| 1 | Revisa la carpeta de **spam** |
| 2 | Haz una prueba tú mismo desde el formulario del sitio |
| 3 | Espera 10 minutos |
| 4 | Si no llega → Contacta al equipo: "Posible problema con Resend" |

---

### 4.6. "El sitio está muy lento"

| # | Qué hacer |
|:---:|---|
| 1 | Prueba desde otro dispositivo y otra red |
| 2 | ¿El admin también está lento? → Sí = Railway. Solo sitio público = temporal |
| 3 | Espera 15-30 minutos |
| 4 | Si pasa frecuentemente → Contacta al equipo para evaluar upgrade de Railway |

---

### 📞 Datos de contacto del equipo de desarrollo

| Nombre | Email |
|---|---|
| **Jesús Garza** | jesus.garza.gro@gmail.com |
| **Armando Ochoa** | armaochoa99@gmail.com |

> 💡 **TIP:** Cuando contactes por un problema, incluye:
> 1. Qué estabas intentando hacer
> 2. Qué pasó (o qué mensaje de error viste)
> 3. Desde cuándo pasa
> 4. Si ya probaste alguno de los pasos de esta guía

---

## 5. 📝 Registro de revisiones

### Revisiones mensuales

| Fecha | Sitio | Admin | Imágenes | Formularios | Velocidad | Idiomas | Divisas | Notas |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | |

### Revisiones trimestrales (con desarrollador)

| Fecha | API Keys | BD | Servidor | Cloudinary | Seguridad | Rendimiento | Próxima | Notas |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|---|
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ___/___/___ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ___/___/___ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ___/___/___ | |
| ___/___/___ | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ | ___/___/___ | |

### Renovaciones realizadas

| Fecha | Servicio | Acción | Costo | Próximo vencimiento |
|---|---|---|---|---|
| ___/___/___ | GoDaddy (dominio) | Renovación anual | $_____ | ___/___/___ |
| ___/___/___ | | | $_____ | ___/___/___ |
| ___/___/___ | | | $_____ | ___/___/___ |
| ___/___/___ | | | $_____ | ___/___/___ |

---

> 📕 **Documento generado el 24 de febrero de 2026.**

| Equipo de desarrollo | Email |
|---|---|
| **Jesús Garza** | jesus.garza.gro@gmail.com |
| **Armando Ochoa** | armaochoa99@gmail.com |

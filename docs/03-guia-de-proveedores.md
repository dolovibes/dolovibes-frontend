# 📙 Guía de Proveedores, Cuentas y Costos — Dolo Vibes

> **Versión:** 1.0 &nbsp;|&nbsp; **Fecha:** Febrero 2026 &nbsp;|&nbsp; **Para:** Propietario del sitio

| | |
|---|---|
| **Sitio web** | [www.dolo-vibes.com](https://www.dolo-vibes.com) |
| **Email de todas las cuentas** | info@dolo-vibes.com |

---

## 📑 Tabla de Contenidos

| # | Sección |
|---|---------|
| 1 | [Resumen general](#1--resumen-general) |
| 2 | [Tabla resumen de todos los proveedores](#2--tabla-resumen-de-todos-los-proveedores) |
| 3 | [Detalle por proveedor](#3--detalle-por-proveedor) |
| 4 | [Tabla de credenciales y API Keys](#4--tabla-de-credenciales-y-api-keys) |
| 5 | [Recomendaciones: gratuito vs. pago](#5--recomendaciones-gratuito-vs-pago) |

---

## 1. 🌐 Resumen general

Tu sitio web **www.dolo-vibes.com** depende de varios servicios en internet que trabajan juntos. Piensa en ellos como los "proveedores" de tu negocio digital — igual que tienes proveedor de luz e internet para tu oficina, estos son los proveedores de tu sitio web.

> ℹ️ **NOTA:** Todas las cuentas están registradas con el email **info@dolo-vibes.com**

> 💡 **TIP:** La mayoría de estos servicios tienen un plan gratuito que es suficiente mientras el sitio tenga tráfico moderado. En esta guía te explicamos cuáles y cuándo podrían necesitar un plan de pago.

---

## 2. 📊 Tabla resumen de todos los proveedores

| Proveedor | Para qué sirve | Plan | Costo | Renovación |
|---|---|---|---|---|
| 🌐 **GoDaddy** | Tu dirección en internet (dominio) | De pago | ~$15-20 USD/año | Anual |
| ☁️ **Vercel** | Muestra tu sitio al público | Gratuito | $0 | No |
| 🚂 **Railway** | Panel admin y base de datos | Gratuito/Trial | $0 (ver notas) | Evaluar upgrade |
| 🖼️ **Cloudinary** | Fotos y videos del sitio | Gratuito | $0 | No (por ahora) |
| 💻 **GitHub** | Respaldo del código | Gratuito | $0 | No |
| 📧 **Resend** | Envío de emails de cotización | Gratuito | $0 | No (por ahora) |
| 🌍 **DeepL** | Traductor automático | Gratuito | $0 | No (por ahora) |
| 💱 **ExchangeRate** | Conversión de divisas | Gratuito | $0 | No (por ahora) |

---

## 3. 🔍 Detalle por proveedor

---

### 🌐 3.1. GoDaddy — Tu dominio en internet

> **En palabras simples:** GoDaddy es donde compraste tu "dirección de internet" — el nombre **dolo-vibes.com**. Sin esta dirección, nadie podría encontrar tu sitio. Es como la dirección física de un negocio: si dejas de pagar, pierdes la ubicación.

| Campo | Valor |
|---|---|
| **Sitio web** | [godaddy.com](https://www.godaddy.com) |
| **Email** | info@dolo-vibes.com |
| **Costo** | ~$15-20 USD/año (renovación anual) |

> 🔴 **CRÍTICO:** Si el dominio expira, **TODO el sitio deja de funcionar** — tanto la página pública como el panel de administración. Además, alguien más podría comprar tu dominio.

**Qué NO hacer:**

| ❌ Acción | Consecuencia |
|---|---|
| Cambiar los registros DNS | El sitio podría dejar de funcionar |
| Desactivar la renovación automática | Riesgo de perder el dominio |
| Transferir a otra cuenta sin consultar | Podría causar caída del sitio |

> 💡 **TIP:** Revisa que la **renovación automática esté activada** en tu cuenta de GoDaddy.

---

### ☁️ 3.2. Vercel — Tu sitio web público

> **En palabras simples:** Vercel es donde "vive" tu sitio web público — la página que ven tus clientes. Es como el edificio donde está tu tienda: Vercel se encarga de que esté disponible 24 horas, cargue rápido y funcione en cualquier parte del mundo.

| Campo | Valor |
|---|---|
| **Sitio web** | [vercel.com](https://vercel.com) |
| **Email** | info@dolo-vibes.com |
| **Proyecto** | www.dolo-vibes.com |
| **Costo** | $0 (plan Hobby gratuito) |

**El plan gratuito incluye:**
- ✅ 100 GB de transferencia al mes
- ✅ Despliegues automáticos ilimitados
- ✅ Certificado SSL (la "s" de https que hace tu sitio seguro)

**¿Cuándo necesitaría pago?** Solo con miles de visitantes diarios. Plan Pro: $20 USD/mes.

**Qué NO hacer:**

| ❌ Acción | Consecuencia |
|---|---|
| Eliminar el proyecto en Vercel | El sitio público desaparecerá |
| Desconectar el repositorio de GitHub | Los despliegues automáticos dejarán de funcionar |
| Cambiar configuración de dominio | El sitio podría dejar de cargar |

---

### 🚂 3.3. Railway — Panel admin y base de datos

> **En palabras simples:** Railway es donde funciona el "cerebro" de tu sitio: el panel de administración y la base de datos con todo tu contenido. Si Vercel es la "tienda", Railway es la "bodega" y la "oficina" detrás de la tienda.

| Campo | Valor |
|---|---|
| **Sitio web** | [railway.app](https://railway.app) |
| **Acceso** | Iniciar sesión con GitHub (SSO) |
| **Costo actual** | $0 (plan gratuito/trial) |

> ℹ️ **NOTA:** Railway se accede usando tu cuenta de GitHub (info@dolo-vibes.com). No tiene usuario/contraseña propio.

**Limitaciones del plan gratuito:**

| Limitación | Impacto |
|---|---|
| ⏱️ Horas de ejecución limitadas | El servidor puede apagarse |
| 🐌 Recursos limitados (CPU/RAM) | Lentitud bajo carga |
| 🚫 Sin backups automáticos | Riesgo de pérdida de datos |

> 🔴 **RECOMENDACIÓN:** Railway es el proveedor donde **más se recomienda invertir** en un plan de pago. La estabilidad del servidor y los backups automáticos son fundamentales para tu negocio.

**Planes de pago:**

| Plan | Costo |
|---|---|
| Hobby | $5 USD/mes + uso (~$5-15 USD/mes total) |
| Pro | $20 USD/mes + uso |

**Qué NO hacer:**

| ❌ Acción | Consecuencia |
|---|---|
| Eliminar el proyecto o servicios | Todo el sitio deja de funcionar |
| Modificar variables de entorno | El sitio podría romperse |
| Eliminar la base de datos | **SE PIERDE TODO el contenido** |
| Cambiar la región del servidor | Posible caída temporal |

---

### 🖼️ 3.4. Cloudinary — Tus fotos y videos

> **En palabras simples:** Cloudinary es donde se guardan todas las fotos y videos que subes al sitio. Es como un álbum de fotos en la nube que, además, optimiza las imágenes para que se vean bien en cualquier dispositivo.

| Campo | Valor |
|---|---|
| **Sitio web** | [cloudinary.com](https://cloudinary.com) |
| **Email** | info@dolo-vibes.com |
| **Cloud name** | dn8pprext |
| **Costo** | $0 (plan gratuito) |

**El plan gratuito incluye:**
- ✅ 25 créditos mensuales (~25 GB)
- ✅ Optimización automática de imágenes
- ✅ CDN global (carga rápida mundial)

**¿Cuándo necesitaría pago?** Si subes muchas fotos/videos y excedes 25 créditos. Plan Plus: desde $89 USD/mes.

**Qué NO hacer:**

| ❌ Acción | Consecuencia |
|---|---|
| Eliminar fotos desde el panel de Cloudinary | Espacios vacíos en el sitio |
| Cambiar el "cloud name" | Todas las imágenes dejarán de mostrarse |
| Cambiar las API keys | El sitio no podrá subir ni mostrar imágenes |

> 💡 **TIP:** Si necesitas borrar medios, hazlo primero desde el **panel admin de Strapi** y luego desde Cloudinary.

---

### 💻 3.5. GitHub — Respaldo del código

> **En palabras simples:** GitHub es donde se guarda el código del sitio — como una caja fuerte digital del código. También permite que cuando se hace un cambio, el sitio se actualice automáticamente.

| Campo | Valor |
|---|---|
| **Sitio web** | [github.com](https://github.com) |
| **Email** | info@dolo-vibes.com |
| **Organización** | dolovibes |
| **Costo** | $0 (plan gratuito — suficiente) |

**¿Necesitas entrar?** Generalmente no. GitHub es para desarrolladores. Solo si necesitas dar acceso a un nuevo desarrollador o verificar el respaldo.

**Qué NO hacer:**

| ❌ Acción | Consecuencia |
|---|---|
| Eliminar los repositorios | Se pierde el código del proyecto |
| Cambiar contraseña de GitHub sin actualizar Railway | Railway dejará de poder acceder |
| Aceptar solicitudes de desconocidos | Riesgo de seguridad |

---

### 📧 3.6. Resend — Envío de emails

> **En palabras simples:** Resend envía los emails cuando alguien llena el formulario de cotización en tu sitio. Cuando un cliente pide información, Resend envía ese email a tu bandeja.

| Campo | Valor |
|---|---|
| **Sitio web** | [resend.com](https://resend.com) |
| **Email** | info@dolo-vibes.com |
| **Costo** | $0 (plan gratuito: 3,000 emails/mes, 100/día) |

**¿Cuándo necesitaría pago?** Solo con +100 cotizaciones/día. Plan Pro: $20 USD/mes.

> 💡 **TIP:** Para verificar que funciona, llena tú mismo el formulario de cotización en www.dolo-vibes.com y revisa que recibes el email.

---

### 🌍 3.7. DeepL — Traductor automático

> **En palabras simples:** DeepL traduce automáticamente el contenido cuando presionas "Traducir" en el panel admin. Convierte español a inglés, italiano y alemán con buena calidad.

| Campo | Valor |
|---|---|
| **Sitio web** | [deepl.com](https://www.deepl.com) |
| **Email** | info@dolo-vibes.com |
| **Costo** | $0 (plan API Free: 500,000 caracteres/mes) |

**¿Cuándo necesitaría pago?** Muy poco probable con uso normal. Pro: $5.49 USD/mes + $25/millón de caracteres.

---

### 💱 3.8. ExchangeRate API — Conversión de divisas

> **En palabras simples:** Le dice a tu sitio cuánto vale un euro en dólares y pesos mexicanos, para que los precios se muestren correctamente en cada moneda.

| Campo | Valor |
|---|---|
| **Sitio web** | [exchangerate-api.com](https://www.exchangerate-api.com) |
| **Email** | info@dolo-vibes.com |
| **Costo** | $0 (plan gratuito: 1,500 peticiones/mes) |

> ℹ️ **NOTA:** Si este servicio deja de funcionar temporalmente, el sitio tiene precios de respaldo guardados internamente. No es crítico.

---

## 4. 🔑 Tabla de credenciales y API Keys

Tu sitio usa varias "llaves digitales" (API Keys) para que los servicios se comuniquen entre sí. Son como contraseñas especiales entre sistemas.

> ℹ️ **NOTA:** No necesitas memorizar ni usar estas llaves. Solo necesitas saber que existen para entregarlas si cambias de desarrollador.

| Servicio | Tipo de credencial | Dónde se accede |
|---|---|---|
| 🔐 **Strapi Admin** | Email + Contraseña | api.dolo-vibes.com/admin |
| 🌐 **GoDaddy** | Email + Contraseña | godaddy.com |
| ☁️ **Vercel** | Email + Contraseña | vercel.com |
| 💻 **GitHub** | Email + Contraseña | github.com |
| 🚂 **Railway** | Acceso con GitHub (SSO) | railway.app |
| 🖼️ **Cloudinary** | API Key + API Secret | Panel de Cloudinary |
| 📧 **Resend** | API Key | Panel de Resend |
| 🌍 **DeepL** | API Key | Panel de DeepL |
| 💱 **ExchangeRate** | API Key | Panel de ExchangeRate |

> ⚠️ **IMPORTANTE:** Las API Keys están configuradas en las **variables de entorno** del servidor (Railway). Si cambias de desarrollador, asegúrate de que el nuevo tenga acceso a Railway y a esta documentación.

---

## 5. 💰 Recomendaciones: gratuito vs. pago

### ✅ Servicios que conviene mantener en plan gratuito

| Servicio | Por qué |
|---|---|
| ☁️ **Vercel** | Plan muy generoso. Solo necesitarías pagar con tráfico masivo. |
| 💻 **GitHub** | Suficiente para cualquier proyecto de este tamaño. |
| 💱 **ExchangeRate** | El caché inteligente del sitio usa muy pocas peticiones. |
| 🌍 **DeepL** | 500,000 caracteres/mes es más que suficiente. |
| 📧 **Resend** | 3,000 emails/mes es mucho más de lo necesario. |
| 🖼️ **Cloudinary** | 25 créditos/mes son suficientes con uso normal. |

### ⬆️ Servicios donde se recomienda evaluar un plan de pago

| Servicio | Por qué | Costo |
|---|---|---|
| 🚂 **Railway** | Corazón del sitio. Plan gratuito causa lentitud y no tiene backups. | ~$5-15 USD/mes |

### 💵 Servicio que ya tiene costo

| Servicio | Frecuencia | Costo |
|---|---|---|
| 🌐 **GoDaddy** (dominio) | Anual | ~$15-20 USD/año |

---

### 📋 Resumen de costos

| Escenario | Costo | Detalle |
|---|---|---|
| **Mínimo actual** | ~$15-20 USD/año | Solo el dominio |
| **Recomendado** | ~$75-200 USD/año | Dominio + Railway Hobby |
| **Máximo proyectado** | ~$1,800-2,000 USD/año | Todos los servicios en plan de pago |

**Desglose del costo recomendado:**

| Servicio | Costo |
|---|---|
| Dominio (GoDaddy) | $15-20 USD/año |
| Railway (Hobby) | $5-15 USD/mes → ~$60-180 USD/año |
| **Total** | **~$75-200 USD/año** |

**Desglose del costo máximo** (solo si el sitio crece mucho):

| Servicio | Costo mensual |
|---|---|
| Railway Pro | $20-40 USD |
| Vercel Pro | $20 USD |
| Cloudinary Plus | $89 USD |
| **Total** | **~$150-170 USD/mes** |

> ℹ️ **NOTA:** El escenario máximo solo aplica con miles de visitantes diarios y cientos de fotos/videos. Para la operación actual, el escenario recomendado es suficiente.

---

> 📙 **Documento generado el 24 de febrero de 2026.**

| Equipo de desarrollo | Email |
|---|---|
| **Jesús Garza** | jesus.garza.gro@gmail.com |
| **Armando Ochoa** | armaochoa99@gmail.com |

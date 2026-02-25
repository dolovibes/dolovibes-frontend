# Guía de Proveedores, Cuentas y Costos — Dolo Vibes

> **Versión:** 1.0
> **Fecha:** Febrero 2026
> **Para:** Propietario del sitio Dolo Vibes
> **Propósito:** Tener control y visibilidad de todos los servicios que hacen funcionar tu sitio web

---

## Tabla de Contenidos

1. [Resumen general](#1-resumen-general)
2. [Tabla resumen de todos los proveedores](#2-tabla-resumen-de-todos-los-proveedores)
3. [Detalle por proveedor](#3-detalle-por-proveedor)
   - [GoDaddy (Dominio)](#31-godaddy--dominio)
   - [Vercel (Sitio web público)](#32-vercel--sitio-web-público)
   - [Railway (Servidor del panel admin y base de datos)](#33-railway--servidor-del-panel-admin-y-base-de-datos)
   - [Cloudinary (Almacenamiento de fotos y videos)](#34-cloudinary--almacenamiento-de-fotos-y-videos)
   - [GitHub (Respaldo del código)](#35-github--respaldo-del-código)
   - [Resend (Envío de emails)](#36-resend--envío-de-emails)
   - [DeepL (Traductor automático)](#37-deepl--traductor-automático)
   - [ExchangeRate API (Conversión de divisas)](#38-exchangerate-api--conversión-de-divisas)
4. [Tabla de credenciales y API Keys](#4-tabla-de-credenciales-y-api-keys)
5. [Recomendaciones sobre planes gratuitos vs. de pago](#5-recomendaciones-sobre-planes-gratuitos-vs-de-pago)

---

## 1. Resumen general

Tu sitio web **www.dolo-vibes.com** depende de varios servicios en internet que trabajan juntos para que todo funcione. Piensa en ellos como los "proveedores" de tu negocio digital — igual que tienes un proveedor de luz y de internet para tu oficina, estos son los proveedores de tu sitio web.

**Todas las cuentas están registradas con el email:** info@dolo-vibes.com

**Dato importante:** La mayoría de estos servicios tienen un **plan gratuito** que es suficiente mientras el sitio tenga un tráfico moderado. Conforme tu negocio crezca, algunos podrían necesitar un plan de pago. En esta guía te explicamos cuáles y cuándo.

---

## 2. Tabla resumen de todos los proveedores

| Proveedor | Para qué sirve (en pocas palabras) | Plan actual | Costo actual | ¿Requiere renovación? |
|---|---|---|---|---|
| **GoDaddy** | Tu dirección en internet (dominio) | De pago | ~$15-20 USD/año | Sí — anual |
| **Vercel** | Muestra tu sitio web al público | Gratuito | $0 | No |
| **Railway** | Hace funcionar el panel admin y la base de datos | Gratuito/Trial | $0 (ver notas) | Evaluar upgrade |
| **Cloudinary** | Guarda y sirve las fotos/videos del sitio | Gratuito | $0 | No (por ahora) |
| **GitHub** | Guarda una copia de seguridad del código | Gratuito | $0 | No |
| **Resend** | Envía los emails de cotización | Gratuito | $0 | No (por ahora) |
| **DeepL** | Traduce automáticamente el contenido | Gratuito (API Free) | $0 | No (por ahora) |
| **ExchangeRate API** | Convierte precios entre EUR, USD y MXN | Gratuito | $0 | No (por ahora) |

---

## 3. Detalle por proveedor

---

### 3.1. GoDaddy — Dominio

**Qué hace en palabras simples:**
GoDaddy es donde compraste tu "dirección de internet" — el nombre **dolo-vibes.com**. Sin esta dirección, nadie podría encontrar tu sitio escribiendo www.dolo-vibes.com. Es como la dirección física de un negocio: si dejas de pagar la renta, pierdes la ubicación.

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [godaddy.com](https://www.godaddy.com) |
| Email de la cuenta | info@dolo-vibes.com |

**¿Tiene costo?**
Sí. El dominio se paga anualmente (cada año). El costo aproximado es de **$15-20 USD por año**.

**¿Qué pasa si no se renueva?**
Si el dominio expira, **todo el sitio dejará de funcionar**: tanto la página pública (www.dolo-vibes.com) como el panel de administración (api.dolo-vibes.com). Además, alguien más podría comprar tu dominio.

**Qué NO hacer:**
- No cambies los registros DNS (la configuración técnica que conecta el dominio con los servidores) a menos que tu desarrollador te lo indique
- No desactives la renovación automática
- No transfieras el dominio a otra cuenta sin hablar primero con tu desarrollador

**Importante:** Revisa que la **renovación automática esté activada** en tu cuenta de GoDaddy para evitar que el dominio expire sin darte cuenta.

---

### 3.2. Vercel — Sitio web público

**Qué hace en palabras simples:**
Vercel es el lugar donde "vive" tu sitio web público — la página que ven tus clientes cuando visitan www.dolo-vibes.com. Es como el edificio donde está tu tienda: Vercel se encarga de que tu sitio esté disponible las 24 horas, cargue rápido, y funcione en cualquier parte del mundo.

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [vercel.com](https://vercel.com) |
| Email de la cuenta | info@dolo-vibes.com |
| Proyecto | www.dolo-vibes.com |

**¿Tiene costo?**
No por ahora. El **plan gratuito (Hobby)** de Vercel es suficiente para sitios con tráfico moderado. Incluye:
- 100 GB de transferencia al mes
- Despliegues automáticos ilimitados
- Certificado SSL (la "s" de https que hace tu sitio seguro)

**¿Cuándo necesitaría un plan de pago?**
Solo si:
- El sitio tiene miles de visitantes diarios
- Necesitas un equipo de varias personas administrando desde Vercel
- El plan gratuito te manda un aviso de que excediste los límites

El plan Pro cuesta $20 USD/mes, pero rara vez es necesario para sitios como el tuyo.

**Qué NO hacer:**
- No elimines el proyecto en Vercel
- No desconectes el repositorio de GitHub del proyecto
- No cambies la configuración de dominio sin hablar con tu desarrollador

---

### 3.3. Railway — Servidor del panel admin y base de datos

**Qué hace en palabras simples:**
Railway es donde funciona el "cerebro" de tu sitio: el panel de administración (api.dolo-vibes.com/admin) y la base de datos donde se guarda todo tu contenido (experiencias, paquetes, textos, configuración, etc.). Si Vercel es la "tienda", Railway es la "bodega" y la "oficina" detrás de la tienda.

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [railway.app](https://railway.app) |
| Acceso | Iniciar sesión con GitHub (SSO) |

**Nota:** Railway no tiene usuario/contraseña propio. Se accede usando tu cuenta de GitHub (info@dolo-vibes.com).

**¿Tiene costo?**
Actualmente está en un **plan gratuito o de prueba**. Este plan tiene limitaciones importantes:

| Limitación | Impacto |
|---|---|
| Horas de ejecución limitadas | El servidor puede apagarse cuando se agoten |
| Recursos limitados (CPU/RAM) | El panel admin puede ponerse lento bajo carga |
| Sin backups automáticos | No hay respaldo automático de la base de datos |

**¿Cuándo necesita un plan de pago?**
**Se recomienda considerar un upgrade si:**
- El panel de administración tarda mucho en cargar o se "traba"
- Los visitantes del sitio experimentan lentitud al cargar contenido
- El servidor se apaga inesperadamente
- Necesitas backups automáticos de la base de datos (muy recomendado)

**Costo del plan de pago:**
- Plan Hobby: $5 USD/mes + uso (generalmente el total queda entre $5-15 USD/mes)
- Plan Pro: $20 USD/mes + uso

**Qué NO hacer:**
- No elimines el proyecto ni los servicios dentro de Railway
- No modifiques las variables de entorno sin tu desarrollador
- No elimines la base de datos (se perdería TODO el contenido del sitio)
- No cambies la región del servidor sin consultar

**Recomendación:**
Railway es el proveedor donde **más se recomienda invertir** en un plan de pago. La estabilidad del servidor y los backups automáticos de la base de datos son fundamentales para tu negocio. Sin backups, si ocurre un problema con la base de datos, podrías perder todo el contenido del sitio.

---

### 3.4. Cloudinary — Almacenamiento de fotos y videos

**Qué hace en palabras simples:**
Cloudinary es donde se guardan todas las fotos y videos que subes al sitio — las fotos de los paquetes, la galería, los logos, etc. Es como un álbum de fotos en la nube que, además, optimiza las imágenes para que se vean bien en cualquier dispositivo (celular, tablet, computadora).

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [cloudinary.com](https://cloudinary.com) |
| Email de la cuenta | info@dolo-vibes.com |
| Cloud name | dn8pprext |

**¿Tiene costo?**
No por ahora. El plan gratuito incluye:
- 25 créditos mensuales (aproximadamente 25 GB de almacenamiento o procesamiento)
- Transformaciones de imagen automáticas
- CDN global (las imágenes cargan rápido desde cualquier parte del mundo)

**¿Cuándo necesitaría un plan de pago?**
- Si subes muchas fotos y videos de alta resolución y excedes los 25 créditos mensuales
- Cloudinary te avisará por email si estás cerca del límite
- Plan Plus: desde $89 USD/mes (generalmente no necesario para sitios de este tamaño)

**Qué NO hacer:**
- No elimines fotos o videos directamente desde el panel de Cloudinary — esto causará que se vean espacios vacíos en el sitio
- Si necesitas borrar medios, hazlo primero desde el panel admin de Strapi y luego desde Cloudinary
- No cambies el "cloud name" ni las API keys sin tu desarrollador

---

### 3.5. GitHub — Respaldo del código

**Qué hace en palabras simples:**
GitHub es donde se guarda el código de programación de tu sitio — tanto el del sitio público como el del panel de administración. Es como una caja fuerte digital del código. También permite que, cuando se hace un cambio en el código, el sitio se actualice automáticamente.

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [github.com](https://github.com) |
| Email de la cuenta | info@dolo-vibes.com |
| Organización | dolovibes |

**¿Tiene costo?**
No. El plan gratuito de GitHub es más que suficiente.

**¿Necesitas entrar a GitHub?**
Generalmente no. GitHub es una herramienta para desarrolladores. Solo necesitarías acceder si:
- Quieres dar acceso a un nuevo desarrollador al código
- Necesitas verificar que el código está respaldado

**Qué NO hacer:**
- No elimines los repositorios (las carpetas del código)
- No cambies la contraseña de GitHub sin actualizar también Railway (que usa tu cuenta de GitHub para acceder)
- No aceptes solicitudes de acceso de desconocidos

---

### 3.6. Resend — Envío de emails

**Qué hace en palabras simples:**
Resend es el servicio que envía los emails cuando alguien llena el formulario de cotización en tu sitio. Cuando un cliente potencial pide información sobre un paquete, Resend envía ese email a tu bandeja de entrada.

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [resend.com](https://resend.com) |
| Email de la cuenta | info@dolo-vibes.com |

**¿Tiene costo?**
No por ahora. El plan gratuito permite:
- 3,000 emails al mes
- 100 emails por día

**¿Cuándo necesitaría un plan de pago?**
Solo si recibes más de 100 cotizaciones por día o 3,000 por mes — lo cual sería una excelente señal de que el negocio está creciendo. El plan Pro cuesta $20 USD/mes.

**Qué NO hacer:**
- No elimines ni regeneres las API keys sin tu desarrollador
- No cambies la configuración del dominio de envío

**¿Cómo saber si funciona?**
Llena tú mismo el formulario de cotización en tu sitio (www.dolo-vibes.com) y verifica que recibes el email en tu bandeja.

---

### 3.7. DeepL — Traductor automático

**Qué hace en palabras simples:**
DeepL es el servicio que traduce automáticamente el contenido de tu sitio cuando presionas el botón "Traducir" en el panel admin. Convierte los textos en español a inglés, italiano y alemán con buena calidad.

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [deepl.com](https://www.deepl.com) |
| Email de la cuenta | info@dolo-vibes.com |

**¿Tiene costo?**
No por ahora. El plan gratuito (API Free) incluye:
- 500,000 caracteres de traducción al mes

**¿Cuándo necesitaría un plan de pago?**
Solo si traduces una cantidad muy grande de contenido constantemente. Para la operación normal del sitio (agregar o actualizar paquetes de vez en cuando), el plan gratuito es más que suficiente. El plan Pro cuesta $5.49 USD/mes + $25 USD por millón de caracteres.

**Qué NO hacer:**
- No regeneres la API key sin tu desarrollador
- No cambies el plan sin verificar primero con tu desarrollador que la configuración siga siendo compatible

---

### 3.8. ExchangeRate API — Conversión de divisas

**Qué hace en palabras simples:**
Este servicio le dice a tu sitio cuánto vale un euro en dólares y en pesos mexicanos en ese momento. Así, cuando un visitante elige ver los precios en otra moneda, el sitio muestra el precio correcto y actualizado.

**Datos de acceso:**
| Campo | Valor |
|---|---|
| Sitio web | [exchangerate-api.com](https://www.exchangerate-api.com) |
| Email de la cuenta | info@dolo-vibes.com |

**¿Tiene costo?**
No por ahora. El plan gratuito incluye:
- 1,500 peticiones al mes (el sitio guarda el resultado en caché por 24 horas, así que usa muy pocas peticiones)

**¿Cuándo necesitaría un plan de pago?**
Es muy poco probable que necesites un plan de pago. El sistema del sitio está diseñado para usar la menor cantidad posible de peticiones. El plan Starter cuesta $10 USD/mes si fuera necesario.

**Qué NO hacer:**
- No regeneres la API key sin tu desarrollador

**¿Qué pasa si este servicio deja de funcionar?**
El sitio tiene precios de respaldo guardados internamente. Si la API deja de funcionar temporalmente, los precios se seguirán mostrando con los últimos tipos de cambio disponibles. No es crítico para el funcionamiento del sitio.

---

## 4. Tabla de credenciales y API Keys

Tu sitio utiliza varias "llaves digitales" (API Keys) para conectarse con los servicios externos. Estas llaves son como contraseñas especiales para que los sistemas se comuniquen entre sí.

**No necesitas memorizar ni usar estas llaves directamente.** Solo necesitas saber que existen para que, si algún día cambias de desarrollador, puedas entregarle esta información.

| Servicio | Tipo de credencial | Ubicación |
|---|---|---|
| **Strapi Admin** | Email + Contraseña | Panel: api.dolo-vibes.com/admin |
| **GoDaddy** | Email + Contraseña | godaddy.com |
| **Vercel** | Email + Contraseña | vercel.com |
| **GitHub** | Email + Contraseña | github.com |
| **Railway** | Acceso con cuenta de GitHub (SSO) | railway.app |
| **Cloudinary** | API Key + API Secret | Panel de Cloudinary |
| **Resend** | API Key | Panel de Resend |
| **DeepL** | API Key | Panel de DeepL |
| **ExchangeRate API** | API Key | Panel de ExchangeRate |

**Importante:** Las API Keys y secretos están configurados en las **variables de entorno** del servidor (Railway). Tu desarrollador tiene acceso a ellas. Si cambias de desarrollador, asegúrate de que el nuevo tenga acceso a Railway y a esta documentación.

---

## 5. Recomendaciones sobre planes gratuitos vs. de pago

### Servicios que conviene mantener en plan gratuito

| Servicio | Por qué |
|---|---|
| **Vercel** | El plan gratuito es muy generoso. Solo necesitarías pagar con tráfico masivo. |
| **GitHub** | El plan gratuito es suficiente para cualquier proyecto de este tamaño. |
| **ExchangeRate API** | El sistema del sitio usa muy pocas peticiones gracias al caché inteligente. |
| **DeepL** | 500,000 caracteres/mes es más que suficiente para traducciones ocasionales. |
| **Resend** | 3,000 emails/mes es mucho más de lo que un sitio de turismo típico necesita. |
| **Cloudinary** | 25 créditos/mes son suficientes mientras no subas cientos de fotos/videos al mes. |

### Servicios donde se recomienda evaluar un plan de pago

| Servicio | Por qué | Costo aproximado |
|---|---|---|
| **Railway** | Es el corazón de tu sitio. El plan gratuito puede causar lentitud y no incluye backups automáticos de la base de datos. Un plan de pago te da estabilidad y protección contra pérdida de datos. | $5-15 USD/mes |

### Servicio que ya tiene costo

| Servicio | Frecuencia | Costo aproximado |
|---|---|---|
| **GoDaddy** (dominio) | Anual | $15-20 USD/año |

### Resumen de costos

**Costo mínimo actual:** ~$15-20 USD/año (solo el dominio)

**Costo recomendado:** ~$75-200 USD/año
- Dominio (GoDaddy): $15-20 USD/año
- Railway (plan Hobby): $5-15 USD/mes → ~$60-180 USD/año

**Costo máximo proyectado** (si el sitio crece mucho):
- Dominio: $20 USD/año
- Railway Pro: $20-40 USD/mes
- Vercel Pro: $20 USD/mes
- Cloudinary Plus: $89 USD/mes
- Total: ~$150-170 USD/mes → ~$1,800-2,000 USD/año

> **Nota:** El escenario de costo máximo solo aplica si el sitio tiene miles de visitantes diarios y cientos de fotos/videos. Para la operación actual, los primeros dos ítems son suficientes.

---

*Si tienes dudas sobre algún proveedor o necesitas acceder a alguna de estas cuentas, contacta al equipo de desarrollo:*

| Nombre | Email |
|---|---|
| Jesús Garza | jesus.garza.gro@gmail.com |
| Armando Ochoa | armaochoa99@gmail.com |

*Documento generado el 22 de febrero de 2026.*

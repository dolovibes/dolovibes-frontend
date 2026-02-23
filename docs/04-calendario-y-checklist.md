# Calendario de Renovaciones y Checklist de Salud del Sitio — Dolo Vibes

> **Versión:** 1.0
> **Fecha:** Febrero 2026
> **Para:** Propietario del sitio Dolo Vibes
> **Propósito:** Mantener tu sitio funcionando correctamente con revisiones periódicas sencillas

---

## Tabla de Contenidos

1. [Calendario de renovaciones anuales](#1-calendario-de-renovaciones-anuales)
2. [Checklist mensual — Lo que puedes hacer tú (5 minutos)](#2-checklist-mensual--lo-que-puedes-hacer-tú-5-minutos)
3. [Checklist trimestral — Con apoyo del desarrollador](#3-checklist-trimestral--con-apoyo-del-desarrollador)
4. [Qué hacer en caso de emergencia](#4-qué-hacer-en-caso-de-emergencia)
5. [Registro de revisiones realizadas](#5-registro-de-revisiones-realizadas)

---

## 1. Calendario de renovaciones anuales

### Servicios con renovación o revisión obligatoria

| Servicio | Qué se renueva | Frecuencia | Criticidad | Fecha de vencimiento |
|---|---|---|---|---|
| **GoDaddy** | Dominio dolo-vibes.com | **Anual** | **ALTA** — Si vence, todo el sitio deja de funcionar | [COMPLETAR: fecha] |
| **Railway** | Revisión de consumo y límites del plan | **Mensual** | MEDIA — Puede causar lentitud o caídas | Revisar cada mes |

### Servicios con API Keys que pueden vencer o desactivarse

| Servicio | Qué revisar | Frecuencia recomendada | Criticidad |
|---|---|---|---|
| **DeepL** | Que la API Key siga activa y no se haya excedido el límite mensual | Cada 6 meses | BAJA — Solo afecta la traducción automática |
| **Resend** | Que los emails se sigan enviando correctamente | Cada 3 meses | MEDIA — Si falla, no recibes cotizaciones |
| **ExchangeRate API** | Que la API Key funcione y no se haya excedido el límite | Cada 6 meses | BAJA — El sitio tiene precios de respaldo |
| **Cloudinary** | Que no se haya excedido el espacio de almacenamiento | Cada 6 meses | MEDIA — Si se llena, no puedes subir nuevas fotos |

### Tabla visual del calendario anual

```
          Ene   Feb   Mar   Abr   May   Jun   Jul   Ago   Sep   Oct   Nov   Dic
          ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ─────
Dominio    │                          ★ [COMPLETAR: mes de vencimiento]         │
GoDaddy    │     Renovación anual — CRÍTICO si vence                            │
           │                                                                     │
Railway    ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓
           │     Revisión mensual de consumo                                     │
           │                                                                     │
Checklist  ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓     ✓
mensual    │     5 minutos cada mes (lo haces tú)                                │
           │                                                                     │
Checklist        ✓                 ✓                 ✓                 ✓
trimestral │     Con tu desarrollador cada 3 meses                               │
           │                                                                     │
API Keys         ✓                                   ✓
           │     Revisión cada 6 meses con tu desarrollador                      │
          ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ───── ─────

★ = Fecha de vencimiento del dominio (COMPLETAR)
✓ = Revisión programada
```

---

## 2. Checklist mensual — Lo que puedes hacer tú (5 minutos)

Estas son verificaciones sencillas que puedes hacer **una vez al mes** sin necesidad de tu desarrollador. Te toman menos de 5 minutos.

### Instrucciones

Abre tu navegador y realiza cada verificación en orden. Marca con ✓ si todo está bien, o con ✗ si encuentras un problema.

---

### Lista de verificación mensual

**1. ¿El sitio web carga correctamente?**
- Abre [www.dolo-vibes.com](https://www.dolo-vibes.com) en tu navegador
- ¿Ves la página de inicio con el video/foto de fondo y el título?
- Resultado esperado: La página carga completamente en menos de 5 segundos
- [ ] Funciona correctamente
- [ ] Hay un problema → Ver sección 4.1

**2. ¿El panel de administración funciona?**
- Abre [api.dolo-vibes.com/admin](https://api.dolo-vibes.com/admin) en tu navegador
- ¿Puedes iniciar sesión con tu email y contraseña?
- ¿Puedes ver la lista de experiencias o paquetes?
- Resultado esperado: Puedes acceder y navegar sin errores
- [ ] Funciona correctamente
- [ ] Hay un problema → Ver sección 4.2

**3. ¿Las imágenes se muestran correctamente?**
- En el sitio público, navega a cualquier experiencia o paquete
- ¿Las fotos se ven? ¿O ves espacios vacíos o íconos de imagen rota?
- Resultado esperado: Todas las imágenes cargan correctamente
- [ ] Funciona correctamente
- [ ] Hay un problema → Ver sección 4.4

**4. ¿El formulario de cotización funciona?**
- En el sitio público, haz clic en el botón de cotización
- Llena el formulario con datos de prueba (usa tu propio email)
- Envía el formulario
- ¿Recibes el email en tu bandeja de entrada?
- Resultado esperado: Recibes el email dentro de los siguientes 5 minutos (revisa también la carpeta de spam)
- [ ] Funciona correctamente
- [ ] Hay un problema → Ver sección 4.5

**5. ¿El sitio carga rápido?**
- Abre el sitio desde tu celular con datos móviles (no WiFi)
- ¿Carga en menos de 5 segundos?
- Resultado esperado: La página principal carga en 3-5 segundos
- [ ] Funciona correctamente
- [ ] Carga lento → Ver sección 4.6

**6. ¿Los idiomas funcionan correctamente?**
- En el sitio público, cambia el idioma usando el selector (busca las banderas en la barra de navegación)
- Prueba al menos 2 idiomas diferentes
- ¿Los textos cambian al idioma seleccionado?
- Resultado esperado: Los textos se muestran en el idioma elegido
- [ ] Funciona correctamente
- [ ] Hay un problema → Contacta a tu desarrollador

**7. ¿Las divisas funcionan?**
- En el sitio público, cambia la divisa en el selector
- Prueba EUR, USD y MXN
- ¿Los precios cambian correctamente?
- Resultado esperado: Los precios se muestran con el símbolo correcto (€, $) y un monto diferente para cada divisa
- [ ] Funciona correctamente
- [ ] Hay un problema → Probablemente temporal, revisa en 24 horas

**8. ¿Hay avisos importantes en tu email?**
- Revisa tu bandeja de info@dolo-vibes.com
- Busca emails de: GoDaddy, Vercel, Railway, Cloudinary, Resend, DeepL, ExchangeRate
- ¿Hay avisos de vencimiento, cobros o problemas?
- Resultado esperado: No hay alertas urgentes
- [ ] Todo bien
- [ ] Hay un aviso que no entiendo → Reenvíalo a tu desarrollador

---

## 3. Checklist trimestral — Con apoyo del desarrollador

Cada **3 meses**, contacta a tu desarrollador para que realice estas verificaciones técnicas. Estas requieren acceso a los paneles de los proveedores.

### Para el desarrollador

**1. API Keys activas**
- [ ] DeepL: Verificar que la API Key funciona y revisar el consumo de caracteres
- [ ] Resend: Verificar que la API Key funciona y revisar la cantidad de emails enviados
- [ ] ExchangeRate API: Verificar que la API Key funciona y revisar el consumo de peticiones
- [ ] Cloudinary: Verificar API Key y revisar el consumo de créditos

**2. Base de datos (Railway)**
- [ ] Verificar el estado de la base de datos PostgreSQL
- [ ] Revisar el espacio utilizado
- [ ] Crear un backup manual de la base de datos (si no hay backups automáticos)
  - Comando: `pg_dump` desde Railway CLI o desde el panel de Railway
- [ ] Guardar el backup en un lugar seguro (Google Drive, disco local, etc.)

**3. Servidor (Railway)**
- [ ] Revisar el consumo de CPU y RAM del último trimestre
- [ ] Verificar si el servidor se ha reiniciado inesperadamente
- [ ] Evaluar si el plan actual es suficiente o si necesita un upgrade
- [ ] Revisar los logs del servidor por errores recurrentes

**4. Almacenamiento de medios (Cloudinary)**
- [ ] Revisar el consumo de créditos del último trimestre
- [ ] Verificar cuánto espacio de almacenamiento se ha usado
- [ ] Evaluar si hay archivos no utilizados que se puedan eliminar

**5. Seguridad**
- [ ] Verificar que el certificado SSL (https) sigue activo en ambos dominios
- [ ] Revisar que no haya accesos no autorizados en el panel admin de Strapi
- [ ] Ejecutar `npm audit` en ambos repositorios para revisar vulnerabilidades en dependencias

**6. Rendimiento**
- [ ] Ejecutar una prueba de velocidad en [PageSpeed Insights](https://pagespeed.web.dev/) con la URL www.dolo-vibes.com
- [ ] Revisar que las imágenes se estén sirviendo correctamente desde Cloudinary
- [ ] Verificar que la compresión gzip/brotli esté funcionando

---

## 4. Qué hacer en caso de emergencia

Antes de llamar a tu desarrollador, intenta estos pasos básicos. Te ayudarán a identificar el problema y, en algunos casos, resolverlo tú mismo.

---

### 4.1. "El sitio no carga"

**Posibles causas:** Problema temporal del servidor, dominio expirado, problema de internet.

**Pasos a seguir:**

1. **Verifica tu internet:** ¿Puedes abrir otros sitios web como Google?
   - Si no puedes → El problema es tu conexión a internet, no el sitio

2. **Prueba desde otro dispositivo:** Abre el sitio desde tu celular con datos móviles
   - Si funciona desde otro dispositivo → El problema es tu computadora o red WiFi

3. **Prueba el panel admin por separado:** Abre api.dolo-vibes.com/admin
   - Si el admin carga pero el sitio público no → Problema en Vercel (poco común)
   - Si ninguno carga → Puede ser un problema de dominio (GoDaddy) o del servidor (Railway)

4. **Revisa tu email:** ¿Hay algún aviso de GoDaddy sobre vencimiento del dominio?
   - Si hay aviso de vencimiento → Renueva el dominio inmediatamente en GoDaddy

5. **Espera 15 minutos y vuelve a intentar:** Algunos problemas del servidor se resuelven solos

6. **Si nada funciona → Contacta a tu desarrollador** con esta información:
   - ¿Desde cuándo no funciona?
   - ¿Qué mensaje de error ves (si hay alguno)?
   - ¿Funciona desde otros dispositivos?
   - ¿El admin funciona?

---

### 4.2. "No puedo entrar al panel de administración"

**Pasos a seguir:**

1. **Verifica la URL:** Debe ser exactamente **api.dolo-vibes.com/admin** (con la "s" de https)

2. **Verifica tus credenciales:**
   - Email: info@dolo-vibes.com
   - ¿Estás seguro de la contraseña? Prueba con mayúsculas/minúsculas

3. **Restablece tu contraseña:**
   - Haz clic en "Forgot your password?" en la pantalla de login
   - Revisa tu email (incluida la carpeta de spam)
   - Sigue las instrucciones del email

4. **Limpia la caché del navegador:**
   - Chrome: Presiona Ctrl+Shift+Delete (o Cmd+Shift+Delete en Mac)
   - Selecciona "Imágenes y archivos en caché"
   - Haz clic en "Borrar datos"
   - Intenta acceder de nuevo

5. **Prueba en una ventana de incógnito:**
   - Chrome: Ctrl+Shift+N (o Cmd+Shift+N en Mac)
   - Escribe api.dolo-vibes.com/admin
   - Intenta iniciar sesión

6. **Si nada funciona → Contacta a tu desarrollador**

---

### 4.3. "Hice un cambio y no se ve en el sitio"

**Pasos a seguir:**

1. **¿Publicaste el contenido?**
   - Abre el contenido en el panel admin
   - Si ves un botón azul "Publish" → No está publicado, haz clic en "Publish"

2. **Espera 2-5 minutos:** Los cambios no son instantáneos, necesitan unos minutos para propagarse

3. **Limpia la caché de tu navegador:**
   - Chrome: Ctrl+Shift+Delete → "Imágenes y archivos en caché" → "Borrar datos"

4. **Prueba en ventana de incógnito:** Ctrl+Shift+N → abre www.dolo-vibes.com

5. **Si después de 10 minutos sigue sin reflejarse → Contacta a tu desarrollador**

---

### 4.4. "Las imágenes no se ven"

**Posibles causas:** Problema con Cloudinary o las imágenes fueron eliminadas.

**Pasos a seguir:**

1. **¿Se ve alguna imagen del sitio?** Si ninguna se ve, probablemente es un problema temporal de Cloudinary — espera 15 minutos

2. **¿Solo faltan algunas imágenes?** Verifica en el panel admin que las imágenes estén correctamente asignadas a cada campo

3. **¿Eliminaste alguna imagen de la biblioteca de medios?** Si la eliminaste y estaba en uso, ese es el problema — necesitas subir la imagen de nuevo y asignarla

4. **No toques nada más → Contacta a tu desarrollador**

---

### 4.5. "No recibo emails de cotización"

**Posibles causas:** Problema con Resend, email en spam, o API Key expirada.

**Pasos a seguir:**

1. **Revisa la carpeta de spam:** Los emails de cotización pueden terminar en spam

2. **Haz una prueba tú mismo:** Llena el formulario de cotización en el sitio con tu propio email

3. **Espera 10 minutos:** A veces los emails tardan en llegar

4. **Si no llega → Contacta a tu desarrollador** indicándole:
   - "Los formularios de cotización no están enviando emails"
   - "Posible problema con Resend"

---

### 4.6. "El sitio está muy lento"

**Posibles causas:** Servidor de Railway saturado, plan gratuito con limitaciones, tráfico alto.

**Pasos a seguir:**

1. **Prueba desde otro dispositivo y otra red:** Si solo es lento para ti, puede ser tu conexión

2. **¿El panel admin también está lento?**
   - Si ambos están lentos → Es un problema del servidor (Railway)
   - Si solo el sitio público está lento → Puede ser un problema temporal

3. **Espera 15-30 minutos:** Los problemas de rendimiento en el plan gratuito de Railway suelen ser temporales

4. **Si pasa frecuentemente → Contacta a tu desarrollador** para evaluar el upgrade del plan de Railway. Este es el caso más común de lentitud.

---

### Datos de contacto del desarrollador

| Campo | Información |
|---|---|
| Nombre | [COMPLETAR: nombre del desarrollador] |
| Email | [COMPLETAR: email del desarrollador] |
| Teléfono / WhatsApp | [COMPLETAR: teléfono del desarrollador] |
| Horario de atención | [COMPLETAR: horario de atención] |

> **Tip:** Cuando contactes a tu desarrollador por un problema, incluye:
> 1. Qué estabas intentando hacer
> 2. Qué pasó (o qué mensaje de error viste)
> 3. Desde cuándo pasa
> 4. Si ya probaste alguno de los pasos de esta guía

---

## 5. Registro de revisiones realizadas

Usa esta tabla para llevar un registro de las revisiones que hagas. Esto te ayuda a saber cuándo fue la última vez que se revisó cada cosa.

### Revisiones mensuales

| Fecha | ¿Sitio carga? | ¿Admin funciona? | ¿Imágenes OK? | ¿Formularios OK? | ¿Velocidad OK? | ¿Idiomas OK? | ¿Divisas OK? | Notas |
|---|---|---|---|---|---|---|---|---|
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | |

### Revisiones trimestrales (con desarrollador)

| Fecha | API Keys | Base de datos | Servidor | Cloudinary | Seguridad | Rendimiento | Próxima revisión | Notas |
|---|---|---|---|---|---|---|---|---|
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [COMPLETAR] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [COMPLETAR] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [COMPLETAR] | |
| [COMPLETAR] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [COMPLETAR] | |

### Renovaciones realizadas

| Fecha | Servicio | Acción | Costo | Próximo vencimiento |
|---|---|---|---|---|
| [COMPLETAR] | GoDaddy (dominio) | Renovación anual | $ [COMPLETAR] | [COMPLETAR] |
| | | | | |
| | | | | |
| | | | | |

---

*Este documento es tu herramienta de seguimiento. Imprímelo o guárdalo en un lugar accesible. Revisarlo mensualmente te dará tranquilidad de que todo funciona correctamente.*

*Documento generado el 22 de febrero de 2026.*

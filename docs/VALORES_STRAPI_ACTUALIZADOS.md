# Valores actualizados para Site Text en Strapi

Después de la migración, estos campos necesitan valores simples sin interpolación.
Los valores dinámicos se construyen en el componente.

## packageInfoDay
- **ES**: Día
- **EN**: Day
- **DE**: Tag
- **IT**: Giorno

## packageInfoDayOf
- **ES**: de
- **EN**: of
- **DE**: von
- **IT**: di

## Uso en código
El componente construye la frase completa:
```jsx
{siteTexts.packageInfo.day} {currentDay} {siteTexts.packageInfo.dayOf} {totalDays}
```

**Resultado:**
- ES: "Día 1 de 5"
- EN: "Day 1 of 5"
- DE: "Tag 1 von 5"
- IT: "Giorno 1 di 5"

## Instrucciones
1. Ir a Strapi admin → Content Manager → Site Text
2. Para cada idioma (es, en, de, it), actualizar los campos:
   - `packageInfoDay`: solo la palabra (Día/Day/Tag/Giorno)
   - `packageInfoDayOf`: solo la preposición (de/of/von/di)
3. Guardar y publicar

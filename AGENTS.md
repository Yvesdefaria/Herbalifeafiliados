<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — ProyectoHerbalife

Instrucciones para agentes de IA que trabajen en este repositorio. Leer junto con `PLAN.md`.

## Trato con el usuario

- Dirigirse al usuario por su nombre en cada mensaje, comenzando con "Yves" (p.ej. "Yves, aquí está...", "Yves, ya ha sido creado...", "Yves, ahora el orden es...").


---

## Qué es este proyecto

E-commerce / vitrina de un **afiliado Herbalife** (tienda única, España):

- Catálogo, carrito, checkout, blog y panel admin en **nuestra web**
- **No hay stock local**: el cumplimiento de pedidos se hace en el **panel web de Herbalife**
- Cada producto tiene `externalProductUrl` (URL del producto en Herbalife)
- Los pedidos se guardan en nuestra DB y el afiliado los procesa (manual en MVP)
- **Mobile-first**, SEO incremental, multi-idioma preparado (`es` default, `en`, `pt`)

Detalle de fases y checkboxes: **`PLAN.md`**.

---

## Stack

| Pieza | Tecnología |
|-------|------------|
| Framework | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS (mobile-first) |
| DB / Auth / Storage | Supabase (pendiente conectar) |
| ORM | Prisma (pendiente) |
| Pagos | Stripe (EUR, España) |
| i18n | next-intl · locales `es`, `en`, `pt` |
| Deploy | Vercel |
| Docs de librerías | MCP **context7** (`opencode.json` del proyecto) |

Cuando necesites documentación actualizada de Next.js, Supabase, Stripe, Prisma, next-intl o Tailwind, **usa las tools de context7**.

---

## Comandos

```bash
npm run dev       # desarrollo → http://localhost:3000
npm run build     # build producción
npm run start     # servir build
npm run lint      # eslint
```

---

## Estructura relevante

```
app/[locale]/     # rutas públicas y admin (i18n)
app/api/          # route handlers (sin prefijo locale)
components/       # UI reutilizable
lib/              # supabase, stripe, prisma, fulfillment
lib/fulfillment/  # providers de cumplimiento (manual Herbalife MVP)
messages/         # es.json, en.json, pt.json
i18n/             # routing y request de next-intl
docs/             # notas (p.ej. fulfillment-herbalife.md)
prisma/           # schema y migraciones (pendiente)
```

---

## Reglas de negocio (críticas)

1. **No inventar stock.** No restar inventario. No asumir API de Herbalife sin evidencia.
2. **Siempre** persistir `externalProductUrl` (y snapshot en `OrderItem`) para que el afiliado pueda abrir el producto en el panel.
3. Fulfillment MVP: `ManualHerbalifeProvider` — pedido en DB + notificación/admin. Automatizar el panel Herbalife **no** es el camino por defecto (ToS, fragilidad).
4. Nuevas integraciones de pedidos: implementar `FulfillmentProvider`, no acoplar el checkout a un vendor concreto.
5. Admin CRUD de productos debe incluir campo para la **URL del producto Herbalife**.
6. Roles: solo `admin` accede a `/[locale]/admin/*`. No exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.

---

## i18n

- Default locale: **`es`**
- Locales: `es`, `en`, `pt`
- Rutas bajo `app/[locale]/...`
- **Nunca** hardcodear textos de UI en componentes. Usar `useTranslations` / `getTranslations` (next-intl).
- Todo string visible de la UI vive en `messages/*.json`: textos de interfaz, placeholders, aria-labels, títulos de página, contenido de páginas legales (`legalNotice`, `privacyPolicy`, `cookiesPolicy`), banners (`cookiesBanner`) y estados (`loading`, `error`).
- Al añadir una key en `messages/es.json`, añadir la **misma key** en `en.json` y `pt.json` (valor puede ser español temporalmente).
- Path segments iguales entre idiomas (`/es/productos`, `/en/productos`) salvo decisión explícita en contrario.
- Admin puede permanecer monoidioma (`es`) hasta que se decida internacionalizarlo.

---

## UI / UX

- **Mobile-first**: diseñar y verificar ~375px antes que desktop.
- Moneda y formatos: **EUR**, locale español.
- Copy de interfaz en español por defecto (messages).
- Componentes táctiles (targets adecuados).

---

## SEO

- Metadata por página (`generateMetadata`).
- Preparar alternates / hreflang entre locales.
- Iterar SEO (sitemap, JSON-LD, CWV); no bloquear features del MVP por SEO perfecto.
- Imágenes con `next/image` cuando sea posible.

---

## Seguridad y secretos

- No commitear `.env.local` ni keys.
- Mantener `.env.example` actualizado con nombres de variables (sin valores secretos).
- Validar inputs en API routes y formularios.
- Respetar RLS de Supabase; escrituras admin solo con rol adecuado.

---

## Estilo de código

- TypeScript estricto; preferir tipos explícitos en límites (API, DB).
- No añadir comentarios salvo que el usuario lo pida o sea imprescindible.
- Seguir convenciones del código existente.
- Componentes pequeños y reutilizables; lógica de negocio en `lib/`.
- Preferir editar archivos existentes antes de crear nuevos innecesarios.

---

## Orden de trabajo preferido

1. Leer `PLAN.md` y respetar la fase actual.
2. Si tocas librerías externas → context7.
3. Implementar el cambio mínimo que cumpla la subtarea.
4. Verificar con lint/build si existen scripts.
5. **Commit por bloque**: tras completar cada bloque de trabajo coherente (ej. una fase o subtarea de `PLAN.md`), hacer un commit con mensaje descriptivo y push cuando el usuario lo indique. No esperar al final del día para commitear.

## Regla de commits

- Hacer un **commit por cada bloque lógico** de trabajo completado, **inmediatamente** al terminar el bloque y antes de pasar a la siguiente tarea. No acumular trabajo pendiente de commitear.
- Mensajes en español o inglés, descriptivos, con prefijo de tipo: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Antes de commitear, revisar `git status` y `git diff` para no incluir archivos no deseados (nunca `.env.local` ni claves).
- No mezclar cambios no relacionados en el mismo commit.
- No hacer deploy ni push sin que el usuario lo pida (el commit sí, siempre tras completar el bloque).

---

## Lo que NO debes hacer

- Scraper o automatizar login del panel Herbalife sin petición explícita y diseño consciente.
- Añadir multi-vendor / multi-afiliado sin que esté en el plan.
- Introducir otro framework de UI/CSS sin acuerdo (mantener Tailwind).
- Sustituir next-intl por otra lib i18n sin acuerdo.
- Hardcodear textos de UI o ignorar locales al crear páginas públicas.
- Guardar stock como fuente de verdad local.

---

## Referencias rápidas

| Doc | Uso |
|-----|-----|
| `PLAN.md` | Fases, subtareas, arquitectura, dominio |
| `docs/fulfillment-herbalife.md` | Cómo se cumplen pedidos en el panel |
| `opencode.json` | MCP del proyecto (Context7) |
| `.env.example` | Variables requeridas |

---

## Dominio

Objetivo: `herbalifeafiliado.es` o variante. Tener alternativas por posibles restricciones de marca.

# PLAN — E-commerce Herbalife Afiliado (tienda única)

> Documento vivo. Marca checkboxes al completar. Tolera cambios de alcance.

**Estado:** MVP completo (Fases 0–9) desplegado y verificado en `https://herbalifeafiliados.vercel.app` · **Foco actual:** mejorar la página pública (backlog §12) · **Auditoría pública completada** (a11y, i18n, SEO, funcional — 2026-08-02) · **Decisión pendiente:** modelo de compra (Stripe propio vs HerbalifeOne + WhatsApp, ver §13) · **En pausa:** legales reales, Stripe live, dominio propio · Historial de cambios → `CHANGELOG.md`.

---

## Última sesión (2026-08-02) — dónde retomar

**Hecho en esta sesión** (push batch `a21448d..38ca2a3` → deploy Vercel; 6 commits):
- **Cumplimiento Herbalife** (`c371acc`): análisis de los Términos de Uso → disclaimer "Miembro Independiente de Herbalife" en el footer (es/en/pt) + subsección "Cumplimiento con Herbalife" en §13 con 4 acciones pendientes.
- **Fix desbordamiento horizontal móvil** (`0095305`): header compacto en móvil (carrito con icono + contador, idiomas y botones más pequeños, logo truncable). Verificado con Playwright a 375px y 320px en 11 páginas públicas: `scrollWidth == viewport`.
- **Skills al nivel de proyecto** (`b2f39fe`): `.opencode/skills/` con las 8 skills para el picker de la TUI (requiere reiniciar opencode).
- **Auditoría pública completa con las 8 skills** (2 agentes: UI/a11y + Next/SEO/arquitectura + Playwright funcional 375px en 13 páginas: h1 único, lang, labels, alt, sin overflow, 0 errores de consola):
  - **Backend** (`7c74058`): `proxy.ts` excluye `/auth` del matcher next-intl (rompía el OAuth callback); webhook Stripe idempotente (solo `payment_status=paid`, `updateMany` con `status != paid`, usa `order.currency` real); checkout borra el pedido si Stripe falla (sin huérfanos).
  - **Frontend público** (`38ca2a3`): a11y (autoComplete+name y focus-visible en checkout, `role="alert"` en errores, `aria-live` en feedback async/carrito, `aria-current` en categorías, `tabular-nums` en precios, `translate="no"` en la marca, `type="button"` en banner cookies, `…` en estados es/en/pt, tap-highlight + text-wrap en `globals.css`); SEO (`lib/site.ts` centraliza `NEXT_PUBLIC_SITE_URL`/alternates — 13 usos → 1 helper; metadata completa home/productos/blog con canonical+hreflang+OG; títulos "no encontrado" traducidos; JSON-LD Product con `sku`/`brand`/`availability` y BlogPosting con `author`/`publisher`; `not-found.tsx` por locale; `React.cache` en getters de detalle; `formatPrice` locale-aware). Lint + build + Playwright verificados.

**Pendiente de Yves (decisión):**
- **Modelo de compra**: A) cobro con Stripe propio (Yves es el vendedor legal: facturación, desistimiento 14/30 días, RGPD/LSSI) vs B) redirigir a **HerbalifeOne con código de descuento + WhatsApp** (recomendado, es lo que hace herbalspain.com desde 2016; sin cobro online, sin stock). Los Términos de Uso no deciden esto → **confirmar en las Reglas de Conducta** (pedirlas a la upline) antes de mantener el modelo A.

**Siguientes pasos sugeridos:**
1. Decidir modelo de compra (afecta checkout, pago, legal y webhook).
2. **P2**: `LocaleSwitcher` → menú desplegable de idioma (los 3 botones inline ya compactados; falta el dropdown).
3. **P9**: re-medir PSI con `inlineCss` + fixes de la auditoría ya desplegados.
4. **P1**: revisar páginas admin y tablas en móvil (la auditoría se centró en el front público).
5. Si se mantiene Stripe: legales reales + Stripe live (Fase 9.5–9.7).

**Pendientes de la auditoría (no accionables sin más input):** 404 global para URLs desconocidas usa el default de Next (los 404 de producto/post ya están traducidos); caching con `revalidate` para queries públicas; límite ~160 chars en `description` de BD; JSON-LD Organization sin logo/sameAs/contactPoint (requiere perfiles reales del afiliado); "Quitar" del carrito sin confirmación/undo (acción reversible, aceptado para MVP).

**Para continuar:** `npm run dev` · documento vivo = `PLAN.md` + `CHANGELOG.md` · commit por bloque y push en lote cuando Yves lo indique.

---

## 1. Visión del producto

Tienda web personal de un **afiliado/distribuidor Herbalife** en España:

- Catálogo, carrito, checkout y blog en **nuestra web**
- **Sin stock local**: el inventario y la lógica de cumplimiento viven en el **panel web de Herbalife**
- Nuestra app **captura pedidos** y facilita al afiliado cumplirlos en el panel (manual en MVP)
- Cada producto guarda una **URL externa** del producto en Herbalife (`externalProductUrl`)
- **Mobile-first** + SEO incremental
- Estructura **multi-idioma** desde el día 1 (`es` default; `en` y `pt` preparados)
- Dominio objetivo: `herbalifeafiliado.es` o variante (tener alternativas por marca registrada)

### MVP “listo”

- [ ] Catálogo mobile-first
- [ ] Productos con `externalProductUrl`
- [ ] Pedido guardado + visible en admin
- [ ] Admin CRUD + estados de pedido
- [ ] Auth admin
- [ ] Blog mínimo
- [ ] i18n skeleton (es/en/pt)
- [ ] Deploy Vercel
- [ ] SEO base (meta + sitemap); mejoras continuas

### Fuera del MVP

- Automatizar login/pedidos en panel Herbalife
- Multi-afiliado / marketplace
- App nativa
- Traducciones completas EN/PT de contenido (solo estructura al inicio)

---

## 2. Decisiones de stack

| Pieza | Elección | Alternativa / notas |
|-------|----------|---------------------|
| Framework | **Next.js** (App Router) + TypeScript | Vite SPA puro descartado (SEO). Astro+Vite era opción; se eligió Next |
| UI | **Tailwind CSS**, mobile-first | — |
| DB + Auth + Storage | **Supabase** (PostgreSQL) | Auth: Supabase Auth |
| ORM | **Prisma** (o client Supabase; fijar en setup) | — |
| Pagos | **Stripe** (ES, EUR; Bizum si aplica en cuenta) | PayPal/RedSys después |
| i18n | **next-intl** · locales `es` (default), `en`, `pt` | Paths: `app/[locale]/...` |
| Deploy | **Vercel** + Supabase free | — |
| Docs agente | MCP **Context7** en `opencode.json` de proyecto | Config manual (no setup interactivo) |
| Reglas agente | `AGENTS.md` en raíz del proyecto | — |

### Arquitectura de fulfillment

```
Cliente → Catálogo (nuestra web)
       → Carrito + Checkout
       → Pedido en Supabase
       → Notificación al afiliado
       → Afiliado cumple en panel Herbalife (manual MVP)

Admin → CRUD productos (incl. externalProductUrl)
     → Ver pedidos y cambiar estado
```

Capa adaptable:

```
lib/fulfillment/
  types.ts                 # FulfillmentProvider interface
  manual-herbalife.ts      # MVP: guarda + notifica
  # futuro: otro provider si hay integración real
```

**Importante:** no asumir API pública de Herbalife. Investigar opciones oficiales; **no** basar el producto en scraping del panel.

---

## 3. Estructura de proyecto (objetivo)

```
ProyectoHerbalife/
├── PLAN.md
├── AGENTS.md
├── opencode.json
├── .env.example
├── .env.local                 # no commitear
├── docs/
│   └── fulfillment-herbalife.md
├── messages/
│   ├── es.json
│   ├── en.json
│   └── pt.json
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── prisma/
│   └── schema.prisma
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── productos/
│   │   ├── producto/[slug]/
│   │   ├── carrito/
│   │   ├── checkout/
│   │   ├── blog/
│   │   └── admin/
│   └── api/
│       ├── checkout/
│       └── webhooks/
├── components/
├── lib/
│   ├── supabase/
│   ├── stripe.ts
│   ├── prisma.ts
│   └── fulfillment/
├── public/
└── middleware.ts              # next-intl + auth
```

---

## 4. Modelos de datos (orientativos)

### MVP

- **Profile** — ligado a `auth.users`; rol `admin` | `customer`
- **Category** — nombre, slug
- **Product** — slug, precio vitrina, imagen(es), descripción (es), categoría, **`externalProductUrl`**, `externalSku?`, `isActive`
- **Order** — userId?, datos cliente, total, status (`new` | `paid` | `processing` | `shipped` | `cancelled`), dirección ES
- **OrderItem** — productId, qty, price snapshot, **externalProductUrl snapshot**, nombre snapshot
- **BlogPost** — título, slug, contenido, imagen, published, fechas

### Sin stock local

No hay campo de inventario obligatorio. Opcional: `availabilityNote` o flag manual `isAvailable` (vitrina), no restar unidades al vender.

### Preparado para i18n de contenido (post-MVP)

```
ProductTranslation  — productId, locale, name, description, seoTitle, seoDescription
BlogPostTranslation — postId, locale, title, content, seoTitle, seoDescription
```

En MVP: textos de producto/blog en español en la tabla principal. Migrar a traducciones sin romper el flujo si el `slug` base se mantiene.

---

## 5. i18n (multi-idioma)

| Tema | Decisión |
|------|----------|
| Default | `es` |
| Locales listos | `es`, `en`, `pt` |
| Librería | `next-intl` |
| Rutas | `/es/...`, `/en/...`, `/pt/...` |
| Path segments | Iguales en todos los locales (`/es/productos`, `/en/productos`) |
| UI strings | `messages/*.json` — nunca hardcodear en componentes |
| Admin | Puede quedarse solo en `es` al inicio |
| SEO | `generateMetadata` + alternates/`hreflang`; sitemap multi-locale |

**Convención:** al añadir una key en `es.json`, añadir la misma key en `en.json` y `pt.json` (aunque el valor sea temporalmente en español).

---

## 6. Fases y subtareas

### Fase 0 — Agente, MCP y docs del proyecto *(PRIMERO)*

| # | Subtarea | Estado |
|---|----------|--------|
| 0.1 | Crear `opencode.json` en la raíz (schema OpenCode) | [x] |
| 0.2 | MCP Context7 remote: `https://mcp.context7.com/mcp` | [x] |
| 0.3 | No usar `npx ctx7 setup` interactivo (falla en Windows) | [x] |
| 0.4 | Crear `AGENTS.md` (stack, convenciones, context7, fulfillment) | [x] |
| 0.5 | Crear este `PLAN.md` con checkboxes | [x] |
| 0.6 | Evitar MCPs extra al inicio (no hinchar contexto) | [x] |
| 0.7 | Verificar Context7 tras reiniciar opencode | [ ] |

**Snippet `opencode.json`:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

---

### Fase 1 — Investigación fulfillment panel Herbalife

| # | Subtarea | Estado |
|---|----------|--------|
| 1.1 | Documentar pasos manuales actuales en el panel → `docs/fulfillment-herbalife.md` | [ ] |
| 1.2 | Anotar URLs de producto típicas y si hay SKU/código | [ ] |
| 1.3 | Buscar API/partner oficial (sin scraping) → conclusión escrita | [ ] |
| 1.4 | Definir contrato JSON del pedido interno (Order → afiliado) | [ ] |
| 1.5 | Decidir: cliente paga con **Stripe** vs solo **reserva** (sin pago online) | [ ] |

**Recomendación MVP:** pedido en DB + notificación + fulfillment manual. Automatizar el panel no es código de Fase 1.

---

### Fase 2 — Setup Next.js + Supabase + i18n

| # | Subtarea | Estado |
|---|----------|--------|
| 2.1 | `create-next-app` (TS, Tailwind, App Router, ESLint) | [x] |
| 2.2 | Carpetas `app`, `components`, `lib`, `types`, `docs` | [x] |
| 2.3 | Proyecto Supabase + `.env.local` + `.env.example` | [x] |
| 2.4 | Clientes Supabase (browser/server) + Auth base | [x] |
| 2.5 | Schema Prisma/SQL: Profile, Category, Product (+ externalProductUrl), Order, OrderItem, BlogPost | [x] |
| 2.6 | Layout mobile-first (header, nav, footer) usable a 375px | [x] |
| 2.7 | Metadata base SEO (`lang`, title template, Open Graph) | [x] base |
| 2.8 | Instalar y configurar `next-intl` + middleware | [x] |
| 2.9 | `messages/es.json` con strings de layout | [x] |
| 2.10 | Stubs `en.json` y `pt.json` (pueden clonar es) | [x] |
| 2.11 | Alternates / hreflang base en metadata | [x] |
| 2.12 | Selector de idioma en header (puede ocultarse hasta traducir) | [x] |
| 2.13 | `lib/fulfillment` + `ManualHerbalifeProvider` stub | [x] |
| 2.14 | README: cómo arrancar (`npm run dev`, env vars) | [x] |

**Checkpoint:** `npm run dev` → home en `/es` con layout mobile y 3 locales en routing.

---

### Fase 3 — Auth y roles

| # | Subtarea | Estado |
|---|----------|--------|
| 3.1 | Páginas login / registro (email-password) | [x] |
| 3.2 | Rol `admin` vs `customer` en Profile | [x] |
| 3.3 | Middleware: proteger `/[locale]/admin/*` | [x] |
| 3.4 | Header: sesión, login, logout (móvil) | [x] |
| 3.5 | (Opcional) Google OAuth | [ ] |
| 3.6 | Perfil básico (nombre, email) | [x] |

**Checkpoint:** registro → login → logout; no-admin no entra a admin.

---

### Fase 4 — Catálogo público (mobile-first)

| # | Subtarea | Estado |
|---|----------|--------|
| 4.1 | Listado `/[locale]/productos` grid táctil | [x] |
| 4.2 | Detalle `/[locale]/producto/[slug]` + CTA carrito | [x] |
| 4.3 | Categorías + búsqueda simple (query en URL) | [x] |
| 4.4 | `next/image` optimizado | [x] |
| 4.5 | `generateMetadata` por producto (SEO) | [x] |
| 4.6 | Home: destacados + CTA catálogo | [x] |
| 4.7 | (Opcional) botón “ver en Herbalife” con `externalProductUrl` | [x] |
| 4.8 | Todas las rutas públicas bajo `[locale]` | [x] |

**Checkpoint:** navegar catálogo en móvil sin login.

---

### Fase 5 — Carrito + checkout / pedidos

| # | Subtarea | Estado |
|---|----------|--------|
| 5.1 | Estado carrito (Context o Zustand) + localStorage | [x] |
| 5.2 | Página carrito: líneas, qty, total EUR | [x] |
| 5.3 | Badge cantidad en header | [x] |
| 5.4 | Checkout: nombre, tel, email, dirección ES | [x] |
| 5.5 | Crear `Order` + `OrderItem` (snapshots + externalProductUrl) status `new` | [x] |
| 5.6 | `ManualHerbalifeProvider`: notificar afiliado (email/Resend o solo panel admin) | [x] |
| 5.7 | Stripe Checkout + webhook → `paid` (si se eligió pago online) | [x] |
| 5.8 | Páginas éxito / cancelación | [x] |
| 5.9 | **No** restar stock | [x] |

**Checkpoint:** pedido test visible en admin con URLs de producto por línea.

---

### Fase 6 — Panel admin

| # | Subtarea | Estado |
|---|----------|--------|
| 6.1 | Layout `/[locale]/admin` (sidebar/drawer móvil) + auth guard | [x] |
| 6.2 | Dashboard básico (nº pedidos, recientes) | [x] |
| 6.3 | CRUD productos **con campo URL producto Herbalife** | [x] |
| 6.4 | Subida imágenes a Supabase Storage | [x] |
| 6.5 | CRUD categorías | [x] |
| 6.6 | Lista/detalle pedidos + cambio de estado | [x] |
| 6.7 | En detalle pedido: abrir `externalProductUrl` por línea | [x] |
| 6.8 | CRUD blog (draft/publish) | [x] |

**Checkpoint:** admin gestiona catálogo y pedidos de punta a punta (fulfillment manual).

---

### Fase 7 — Blog público

| # | Subtarea | Estado |
|---|----------|--------|
| 7.1 | `/[locale]/blog` listado | [x] |
| 7.2 | `/[locale]/blog/[slug]` detalle + SEO | [x] |
| 7.3 | Enlace en nav + teaser en home | [x] |

**Checkpoint:** leer posts publicados sin login.

---

### Fase 8 — SEO iterativo + legal ES + pulido

| # | Subtarea | Estado |
|---|----------|--------|
| 8.1 | `sitemap.xml` multi-locale + `robots.txt` | [x] |
| 8.2 | JSON-LD Organization + Product (iteración 1) | [x] |
| 8.3 | Medir Core Web Vitals móvil (LCP, CLS) y corregir lo crítico | [x] |
| 8.4 | Aviso legal, privacidad, cookies (placeholders ES) | [x] |
| 8.5 | Banner cookies simple | [x] |
| 8.6 | UI 100% ES + moneda EUR + formatos ES | [x] |
| 8.7 | Loading / error / toasts en acciones clave | [x] |
| 8.8 | Documentar en AGENTS.md: strings → `messages/*.json` | [x] |

**Checkpoint:** sitio presentable en móvil; SEO base medible; legales enlazados. CWV local (Playwright móvil): home LCP 388ms/CLS 0, catálogo 412ms/0, blog 312ms/0. Medición definitiva en producción (PageSpeed Insights) tras el deploy de Fase 9.

---

### Fase 9 — Deploy y dominio

| # | Subtarea | Estado |
|---|----------|--------|
| 9.1 | Repo GitHub + push | [x] |
| 9.2 | Proyecto Vercel enlazado | [x] |
| 9.3 | Env vars producción (Supabase, Stripe, etc.) | [x] |
| 9.4 | Webhook Stripe → URL prod | [x] |
| 9.5 | Comprobar dominio `herbalifeafiliado.es` + 2–3 alternativas | [ ] |
| 9.6 | DNS → Vercel, HTTPS | [ ] |
| 9.7 | Checklist go-live (keys, legales, productos reales) | [ ] |

Decisión (2026-08-02): lanzar primero con dominio gratuito `*.vercel.app`; dominio propio (sin marca "Herbalife" para evitar conflicto con Reglas de Conducta) se decide y añade en fase posterior. Disponibilidad DNS preliminar (NXDOMAIN → libres): `herbalifeafiliado.es`, `herbalifeafiliado.com`, `afiliadoherbalife.es`, `tuafiliadoherbalife.es`, `afiliado-herbalife.es`, `herbalife-wellness.es`, `herbalifewellness.es`. Registrado: `miherbalife.es`. Confirmar en registrar antes de comprar.

Estado deploy (2026-08-02): producción activa en `https://herbalifeafiliados.vercel.app` (rama main). Env vars Production configuradas (NEXT_PUBLIC_SITE_URL, Supabase x3, DATABASE_URL pooler, Stripe test x2). Fixes de build: `postinstall: prisma generate` + `prisma.config.ts` con fallback de URL + `lib/db.ts` con Prisma lazy (proxy). Webhook Stripe activo: endpoint `/api/webhooks/stripe` con evento `checkout.session.completed`; verificado end-to-end (pedido `8b27ad5d` en `paid`). Fix: teléfono y dirección obligatorios en checkout (cliente + API). Después del push `1fe8a76..0095305`: `inlineCss` activo, disclaimer Herbalife en footer y header móvil sin desbordamiento horizontal. **Tras el push `a21448d..38ca2a3`**: auditoría pública completa (a11y/i18n/SEO/funcional) con fixes de robustez backend (proxy `/auth`, webhook idempotente, checkout sin huérfanos) y metadata/JSON-LD/not-found/formatPrice locale.

**Checkpoint:** URL pública end-to-end en test; live cuando se decida.

---

### Fase futura (post-MVP)

| # | Subtarea | Estado |
|---|----------|--------|
| F1 | Traducir UI completa `en` y `pt` | [ ] |
| F2 | Migrar productos/blog a `*Translation` | [ ] |
| F3 | Admin: editar campos por idioma | [ ] |
| F4 | Integración fulfillment real si aparece API/oficial | [ ] |
| F5 | PayPal / Bizum / RedSys adicionales | [ ] |
| F6 | Cupones, email transaccional avanzado | [ ] |
| F7 | Slugs localizados si SEO EN/PT lo requiere | [ ] |

---

## 7. Orden de sprints

| Sprint | Fases | Objetivo |
|--------|-------|----------|
| A | 0 | Context7 + AGENTS.md + PLAN |
| B | 1–2 | Investigación fulfillment + setup Next/Supabase/i18n |
| C | 3–4 | Auth + catálogo |
| D | 5 | Carrito + pedidos (+ Stripe si aplica) |
| E | 6–7 | Admin + blog |
| F | 8–9 | SEO/legal + deploy |

---

## 8. Variables de entorno (referencia)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Prisma → Supabase Postgres)
DATABASE_URL=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# ADMIN_EMAIL=  # seed / bootstrap admin
```

Nunca commitear `.env.local`. Mantener `.env.example` actualizado.

## 9. Criterios de calidad transversales

- **Mobile-first:** diseñar y probar primero en ~375px
- **SEO:** metadata por página; iterar (no bloquear MVP por SEO perfecto)
- **i18n-ready:** sin strings hardcodeados en UI
- **Fulfillment:** no inventar stock; siempre preservar `externalProductUrl` en pedidos
- **Seguridad:** RLS Supabase; admin solo rol admin; no exponer service role al cliente
- **España:** textos ES, EUR, dirección/teléfono locales, legales ES

---

## 10. Notas y riesgos

1. **Marca / dominio:** “Herbalife” en dominio o copy puede tener restricciones de marca. Preparar variantes de dominio y revisar políticas de afiliado.
2. **Panel Herbalife:** sin API oficial documentada para pedidos, la automatización no es fiable ni recomendable (ToS, fragilidad). MVP = puente manual.
3. **API externa “en planteamiento”:** el admin ya reserva el campo URL; el adapter `FulfillmentProvider` permite cambiar implementación sin reescribir el checkout.
4. **Context7:** si hay rate limit, añadir `CONTEXT7_API_KEY` en headers del MCP (opcional).

---

## 11. Changelog del plan

Historial completo de cambios, decisiones y trabajo completado → **`CHANGELOG.md`**.

---

## 12. Backlog de mejoras de página (foco actual: UX pública)

> Prioridad de Yves (2026-08-02): centrarse en la página; **legales y Stripe live quedan en pausa**.

| # | Mejora | Estado |
|---|--------|--------|
| P1 | Auditoría visual móvil completa (screenshots 375px + smoke todas las páginas públicas). Hecho 2026-08-02: fix desbordamiento horizontal (header compacto, `0095305`) + **auditoría funcional/a11y/SEO completa del front público** (`7c74058`+`38ca2a3`, 13 páginas OK); falta revisión admin y tablas | [ ] |
| P2 | `LocaleSwitcher` → menú desplegable de idioma (los 3 botones `ES/EN/PT` inline ocupan demasiado). Ya compactado en móvil (`0095305`); falta el dropdown | [ ] |
| P3 | Home: hero más cuidado, sección "cómo funciona"/garantías, FAQ | [ ] |
| P4 | Catálogo: ordenación (precio/nombre), filtro por categoría en UI, búsqueda mejorada | [ ] |
| P5 | Detalle producto: productos relacionados, nota de disponibilidad visible | [ ] |
| P6 | Blog: paginación, etiquetas, posts relacionados | [ ] |
| P7 | Carrito: editar cantidades desde el carrito, subtotal visible | [ ] |
| P8 | Checkout: resumen mejorado y señales de confianza | [ ] |
| P9 | Re-medir PSI tras `inlineCss` (verificar SEO 100 y LCP) | [ ] |
| P10 | i18n completo `en`/`pt` + contenido traducido + slugs localizados (F1/F2/F3/F7) | [ ] |

---

## 13. Referencia: herbalspain.com (análisis de features candidatas)

> Referencia aportada por Yves (2026-08-02). E-commerce de un Miembro Independiente Herbalife (PrestaShop). **La web no está optimizada** (PrestaShop antiguo) → sirve de referencia de contenido y modelo de negocio, no de diseño ni rendimiento. Marcas `[x]` las que queramos adoptar.

### Nota estratégica (importante)

herbalspain.com **no cobra online**: el botón de compra redirige a la plataforma oficial **HerbalifeOne** con un **código de descuento (PROMO, 35%)** y un botón "PEDIR POR WHATSAPP" para guiar al cliente. Nuestro modelo actual es distinto: **checkout propio con Stripe** + pedido en nuestra DB + fulfillment manual por el afiliado. → Decidir si mantemos Stripe o exploramos el modelo "redirigir a HerbalifeOne con código" (afecta checkout, pago, legal y webhook).

### Features observadas (verificado [v]) y a adoptar [¿?]

#### Home
| Feature | v | ¿Adoptar? |
|---------|----|----|
| Slider de heroes con producto + CTA ("Pruébalo ahora") | [x] | [ ] |
| Productos destacados con **precio rebajado** (PVP tachado + precio oferta) | [x] | [ ] |
| Badge "Precio rebajado" en tarjetas | [x] | [ ] |
| Nº de opiniones en tarjetas | [x] | [ ] |

#### Header / navegación
| Feature | v | ¿Adoptar? |
|---------|----|----|
| Menú con categorías + **subcategorías desplegables** (p.ej. Control de peso → 11) | [x] | [ ] |
| **Buscador** (icono + overlay) | [x] | [ ] |
| Enlace a historial de pedidos | [x] | [ ] |

#### Página de producto
| Feature | v | ¿Adoptar? |
|---------|----|----|
| Breadcrumb (Inicio > Categoría > Producto) | [x] | [ ] |
| **Galería de imágenes** del producto | [x] | [ ] |
| Precio "Antes X €" tachado + precio actual | [x] | [ ] |
| Selector de cantidad | [x] | [ ] |
| **Descuentos por volumen** (tabla precio/ud) | [x] | [ ] |
| Bloque "Compra oficial con descuento" → HerbalifeOne + código + WhatsApp | [x] | [ ] |
| Bullets de especificaciones (sabores, raciones, peso) | [x] | [ ] |
| Compartir en redes | [x] | [ ] |
| **Tabs**: Descripción / Detalles / Preguntas frecuentes / Opiniones | [x] | [ ] |
| Descripción larga con secciones (beneficios, cómo tomar, intolerancias lactosa/gluten/soja, vegano) | [x] | [ ] |
| **Ficha técnica** (referencia, gluten, lactosa, apto vegano) | [x] | [ ] |
| Formulario de consulta por producto | [x] | [ ] |
| **Opiniones** (rating 4.8/5, lista, votos "¿útil?") — en nuestra web no hay reviews | [x] | [ ] |
| "También podría interesarle" (**cross-sell** / relacionados) | [x] | [ ] |

#### Confianza / conversión
| Feature | v | ¿Adoptar? |
|---------|----|----|
| **Widget WhatsApp** de atención | [x] | [ ] |
| Página "Ventajas de comprar" | [x] | [ ] |
| "Análisis nutricional gratuito" / **calculadora de IMC** | [x] | [ ] |
| "Descuentos VIP" | [x] | [ ] |
| Páginas Envíos / Devoluciones / Pago seguro | [x] | [ ] |
| Footer con info de tienda (dirección, teléfono, email) | [x] | [ ] |
| Disclaimer "Miembro Independiente Herbalife" en footer | [x] | [x] (2026-08-02, `SiteFooter`) |

### Cumplimiento con Herbalife (Términos de Uso y Reglas de Conducta)

> Analizados los **Términos de Uso** de Herbalife (2026-08-02). Puntos que afectan a nuestra web:

- **§6 — Sitios de Distribuidores Independientes**: se **permite** tener web propia, pero el distribuidor es el único responsable de que el contenido cumpla las **Reglas de Conducta**, **Reglamentos para Internet**, reglas de pedidos postales y normativa estatal/autonómica. *Herbalife no se hace responsable de las consecuencias de las webs de distribuidores.*
- **§9 — Derecho de desistimiento**: 30 días de devolución + reembolso en 14 días → obligatorio si cobramos (Modelo A/Stripe).
- **§12 — Conducta del usuario**: prohibido **vincularse desde sitios con afirmaciones de salud/curativas** y hacer claims de salud → revisar descripciones y blog.
- **§15 — Marcas**: logo y nombres de producto son de Herbalife; usarlos solo como identificadores, no como marca propia.
- **§20 — Renuncia de garantías**: la web del distribuidor va "tal cual"; el riesgo es del distribuidor.
- **Conclusión**: los Términos de Uso **no** deciden si se puede cobrar online directamente. Eso está en las **Reglas de Conducta** (documento interno del miembro). → Pedirlas a la upline para confirmar antes de mantener el Modelo A.

### Acciones de cumplimiento (plan)
- [x] Disclaimer "Miembro Independiente de Herbalife" en el footer (es/en/pt) — hecho 2026-08-02.
- [ ] Revisar contenido (descripciones, blog) para eliminar claims de salud.
- [ ] Confirmar en Reglas de Conducta si el cobro online directo (Stripe) está permitido → decidir Modelo A vs B.
- [ ] Solicitar Reglas de Conducta / Reglamentos para Internet (portal de miembro o upline).



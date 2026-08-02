# PLAN — E-commerce Herbalife Afiliado (tienda única)

> Documento vivo. Marca checkboxes al completar. Tolera cambios de alcance.

**Estado:** Fases 0–7 completadas y verificadas (pago Stripe test end-to-end OK; panel admin funcional; blog público live) · **Siguiente paso:** Fase 8 (SEO + legal ES + pulido)

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

Estado deploy (2026-08-02): producción activa en `https://herbalifeafiliados.vercel.app` (rama main). Env vars Production configuradas (NEXT_PUBLIC_SITE_URL, Supabase x3, DATABASE_URL pooler, Stripe test x2). Fixes de build: `postinstall: prisma generate` + `prisma.config.ts` con fallback de URL + `lib/db.ts` con Prisma lazy (proxy). Webhook Stripe activo: endpoint `/api/webhooks/stripe` con evento `checkout.session.completed`; verificado end-to-end (pedido `8b27ad5d` en `paid`). Fix: teléfono y dirección obligatorios en checkout (cliente + API).

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

| Fecha | Cambio |
|-------|--------|
| 2026-07-30 | Plan inicial: Next + Supabase + Stripe + admin + blog + deploy |
| 2026-07-30 | Supabase Auth; pagos Stripe; ubicación ES |
| 2026-07-30 | Sin stock local; fulfillment vía panel Herbalife; `externalProductUrl` |
| 2026-07-30 | Mobile-first + SEO iterativo; dominio objetivo `.es` |
| 2026-07-30 | Fase 0: Context7 + AGENTS.md a nivel proyecto |
| 2026-07-30 | i18n next-intl (es/en/pt) desde setup |
| 2026-07-30 | Generado `PLAN.md` |
| 2026-08-01 | Context7 verificado (0.7); Prisma 7 + Supabase conectados; `DATABASE_URL` → pooler IPv4 |
| 2026-08-01 | Fase 3 (Auth) completada: login/registro, roles, admin guard, sesión |
| 2026-08-01 | Fase 4 (Catálogo) completada: grid, detalle, categorías, búsqueda, seed |
| 2026-08-01 | Fase 5 (Carrito + checkout) completada: carrito Context+localStorage, badge, checkout, Stripe Checkout, webhook → `paid`, éxito/cancelación |
| 2026-08-01 | Stripe test verificado end-to-end: keys test en `.env.local`, pago con 4242 en checkout real → webhook `checkout.session.completed` [200] → pedido `paid` con `externalProductUrl`/`external_sku` por línea. CLI Stripe instalado (winget `Stripe.StripeCli`); `stripe listen` reenvía a `localhost:3000/api/webhooks/stripe`. |
| 2026-08-01 | Fix `proxy.ts`: excluir `/api` del matcher de next-intl (el proxy reescribía `/api/checkout` → `/es/api/checkout` → 404). Commit `97c7818`. |
| 2026-08-01 | Skills instalados globalmente para opencode (`~/.agents/skills/`): `ui-ux-pro-max`, `webapp-testing`, `find-skills`, `nextjs-developer`, `software-architecture`. `nextjs-developer` de `zenobi-us/dotfiles` ya no existe → se usó `jeffallan/claude-skills@nextjs-developer`. |
| 2026-08-02 | Fase 6 (Panel admin) completada: layout con guard `requireAdmin`, dashboard con stats reales (pedidos, nuevos, productos, categorías, borradores + 5 recientes), CRUD productos (con `externalProductUrl`/`external_sku` obligatorios por regla de negocio, slug auto, categoría, activo/disponible), subida de imágenes a Supabase Storage (bucket `product-images`, Server Actions + `bodySizeLimit: 10mb` en `experimental`, `remotePatterns` para `**.supabase.co`), CRUD categorías, lista/detalle pedidos con filtro por estado y cambio de estado, enlace "Abrir en Herbalife" por línea con `externalProductUrl`, CRUD blog (draft/publish). Todo con Prisma + i18n (`es/en/pt`). Commit `16be889`. |
| 2026-08-02 | Verificado admin con Playwright: login admin (usuario creado `admin@herba.com` con role admin vía Admin API), dashboard (5 stats), CRUD producto (crear/editar/borrar confirmado en DB), detalle pedido con enlaces Herbalife, cambio de estado `paid`→`processing` (revertido). 0 errores de consola. |
| 2026-08-02 | Fix warning React 19 "getServerSnapshot should be cached": `getServerSnapshot` del carrito devuelve constante `EMPTY_CART`. Commit `37d1d6c`. |
| 2026-08-02 | Fase 7 (Blog público) completada: listado `/blog` (solo publicados), detalle `/blog/[slug]` con `generateMetadata` (canonical + hreflang es/en/pt + OpenGraph) y JSON-LD BlogPosting, tarjeta `BlogCard` con imagen, teaser en home (3 últimas entradas), nav ya enlazaba `/blog`. Queries públicas en `lib/blog/queries.ts` vía Supabase con RLS (`published=true`). i18n `es/en/pt`. |
| 2026-08-02 | Checkpoint con skills (seo, accessibility, webapp-testing): 6 páginas móvil 375px con 0 errores de consola; gaps SEO y a11y identificados. |
| 2026-08-02 | Fase 8.1–8.2 (bloque SEO): `app/sitemap.ts` multi-locale (es/en/pt + x-default, productos publicados + posts publicados + estáticas), `app/robots.ts` (disallow admin/api/mi-cuenta/carrito/checkout/pago/login/registro en 4 variantes), JSON-LD Organization en layout + JSON-LD Product en detalle producto, `x-default` en layout/producto/blog (se corrigió el del blog que apuntaba a URL sin prefijo), skip link + `id="main"`, `:focus-visible` global y `prefers-reduced-motion`. Build + lint OK. |
| 2026-08-02 | Fase 8.4–8.5 (legal ES + cookies): páginas `/legal`, `/privacidad`, `/cookies` con `components/legal/LegalPage.tsx` (contenido placeholder ES en `messages/*.json`, secciones por namespace), footer con enlaces reales (antes spans), banner `CookieConsent` cliente con localStorage (`cookie-consent`), botón aceptar + enlace a política, `role="dialog"`. Verificado con Playwright (banner → aceptar → persiste oculto; 3 páginas con h1; 0 errores de consola). |
| 2026-08-02 | Fase 8.6–8.7 (pulido): formatos confirmados `Intl.NumberFormat es-ES` + EUR en `lib/format.ts`; aria-labels de nav localizados (`nav.mainNav`/`nav.mobileNav`); `aria-label` en inputs de checkout (a11y); `loading.tsx` (skeleton + sr-only) y `error.tsx` (client con `unstable_retry`, patrón v16.2) para `[locale]` y `admin`. Smoke test 6 páginas: 200, h1 único, 0 errores consola. |
| 2026-08-02 | Fase 8.3–8.8 (CWV + docs): CWV móvil local con Playwright → home LCP 388ms/CLS 0, catálogo 412ms/0, blog 312ms/0 (baseline; PSI en producción tras Fase 9). AGENTS.md: regla i18n ampliada (todo string de UI, legal y estados en `messages/*.json`). **Fase 8 completada.** |
| 2026-08-02 | Fase 9 (inicio): repo en GitHub y push `9136496..4e83b33` (9.1 [x]). Decisión: deploy primero con `*.vercel.app`; dominio propio (sin marca Herbalife) en fase posterior. Env vars confirmadas en código: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` (pooler), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. |
| 2026-08-02 | Fase 9 (deploy): fix de build para Vercel — `lib/generated/prisma` estaba en `.gitignore` → añadido `postinstall: prisma generate`; `prisma.config.ts` con fallback de URL para `generate` sin env vars; `lib/db.ts` con Prisma lazy (Proxy) para no romper el build sin `DATABASE_URL` (falla solo en runtime). **9.2 [x] producción activa** en `https://herbalifeafiliados.vercel.app`. **9.3 [x]** env vars Production configuradas (7 vars: SITE_URL, Supabase x3, DATABASE_URL pooler, Stripe test x2). Falta `STRIPE_WEBHOOK_SECRET` (9.4). |



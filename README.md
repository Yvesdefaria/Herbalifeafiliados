# Proyecto Herbalife — tienda afiliado

Vitrina / e-commerce de afiliado Herbalife (España). Ver `PLAN.md` y `AGENTS.md`.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- next-intl (`es` / `en` / `pt`)
- Supabase + Stripe (pendiente de conectar)

## Requisitos

- Node.js 20+ (recomendado LTS)
- npm

## Arranque

```bash
npm install
cp .env.example .env.local   # PowerShell: Copy-Item .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) → redirige a `/es`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run start` | Servir build |
| `npm run lint` | ESLint |

## Estructura

- `app/[locale]/` — páginas con i18n
- `messages/` — traducciones UI
- `lib/fulfillment/` — cumplimiento pedidos (manual Herbalife MVP)
- `docs/` — notas de negocio

## Git / GitHub

```bash
git init
git add .
git commit -m "chore: scaffold Next.js + i18n + plan"
# crear repo vacío en GitHub, luego:
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

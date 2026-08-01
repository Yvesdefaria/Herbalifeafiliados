-- ============================================================
-- ProyectoHerbalife — Schema inicial (Supabase Postgres)
-- Pegar en: Supabase Dashboard → SQL Editor → Run
-- Idempotente: se puede re-ejecutar (DROP IF EXISTS).
-- ============================================================

-- ---------- Tipos enum ----------
create type public.order_status as enum (
  'new', 'paid', 'processing', 'shipped', 'cancelled'
);

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ---------- Helper: ¿el usuario es admin? ----------
-- Definida tras crear profiles (la referencia en SQL se valida al crearla)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- trigger: crear profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- RLS categories: lectura pública, escritura solo admin
drop policy if exists "categories_read_public" on public.categories;
create policy "categories_read_public"
  on public.categories for select
  using (true);

drop policy if exists "categories_write_admin" on public.categories;
create policy "categories_write_admin"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'EUR',
  image_url text,
  category_id uuid references public.categories (id) on delete set null,
  -- URL del producto en el panel/web Herbalife (crítico)
  external_product_url text,
  external_sku text,
  -- Sin stock local: flag de vitrina manual
  is_available boolean not null default true,
  availability_note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category_id);

alter table public.products enable row level security;

-- RLS products: lectura pública de activos, escritura solo admin
drop policy if exists "products_read_public" on public.products;
create policy "products_read_public"
  on public.products for select
  using (is_active = true);

drop policy if exists "products_write_admin" on public.products;
create policy "products_write_admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  status public.order_status not null default 'new',
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text,
  currency text not null default 'EUR',
  total_cents integer not null check (total_cents >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

-- RLS orders: el cliente ve las suyas; admin todo
drop policy if exists "orders_read_own_or_admin" on public.orders;
create policy "orders_read_own_or_admin"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_write_admin" on public.orders;
create policy "orders_write_admin"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders for insert
  with check (user_id = auth.uid() or public.is_admin());

-- ============================================================
-- ORDER ITEMS (snapshot + external url)
-- ============================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  -- Snapshot de la URL Herbalife por si el producto cambia
  external_product_url text,
  external_sku text,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

drop policy if exists "order_items_read_own_or_admin" on public.order_items;
create policy "order_items_read_own_or_admin"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "order_items_write_admin" on public.order_items;
create policy "order_items_write_admin"
  on public.order_items for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_items_insert_admin" on public.order_items;
create policy "order_items_insert_admin"
  on public.order_items for insert
  with check (public.is_admin());

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);

alter table public.blog_posts enable row level security;

-- RLS blog: públicos los publicados; admin todo
drop policy if exists "blog_posts_read_public" on public.blog_posts;
create policy "blog_posts_read_public"
  on public.blog_posts for select
  using (published = true or public.is_admin());

drop policy if exists "blog_posts_write_admin" on public.blog_posts;
create policy "blog_posts_write_admin"
  on public.blog_posts for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- SEED: categorías de ejemplo (opcional)
-- ============================================================
insert into public.categories (name, slug)
values
  ('Nutrición deportiva', 'nutricion-deportiva'),
  ('Control de peso', 'control-de-peso'),
  ('Bienestar', 'bienestar')
on conflict (slug) do nothing;

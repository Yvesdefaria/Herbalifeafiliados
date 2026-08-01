-- ============================================================
-- ProyectoHerbalife — Seed de productos de ejemplo
-- Pegar en: Supabase Dashboard → SQL Editor → Run
-- Idempotente: inserta por slug (on conflict do nothing).
-- Reemplaza name/description/precio/imágenes por productos reales.
-- ============================================================

insert into public.products (
  name, slug, description, price_cents, currency, image_url, category_id,
  external_product_url, external_sku, is_available, availability_note, is_active
)
select
  p.name, p.slug, p.description, p.price_cents, p.currency, p.image_url,
  c.id as category_id,
  p.external_product_url, p.external_sku, p.is_available, p.availability_note, p.is_active
from (values
  (
    'Batido Nutricional Fórmula 1', 'batido-nutricional-formula-1',
    'Batido nutricional para una alimentación equilibrada. Sabor recomendado: vainilla.',
    2995, 'EUR', null, 'nutricion-deportiva',
    'https://www.herbalife.com/es-es/productos/batido-nutricional-formula-1', 'F1-VAINILLA',
    true, null, true
  ),
  (
    'Proteína Concentrada de Soja', 'proteina-concentrada-soja',
    'Complemento de proteína de soja para acompañar tu plan nutricional.',
    3450, 'EUR', null, 'nutricion-deportiva',
    'https://www.herbalife.com/es-es/productos/proteina-concentrada-soja', 'PS-SOJA',
    true, null, true
  ),
  (
    'Té de Hierbas', 'te-de-hierbas',
    'Infusión de hierbas con té verde. Para tus momentos de relax.',
    2650, 'EUR', null, 'bienestar',
    'https://www.herbalife.com/es-es/productos/te-de-hierbas', 'TE-RELAJ',
    true, null, true
  ),
  (
    'Aloe Concentrado', 'aloe-concentrado',
    'Bebida de aloe vera concentrado. Uso diario recomendado.',
    3890, 'EUR', null, 'bienestar',
    'https://www.herbalife.com/es-es/productos/aloe-concentrado', 'ALOE-1L',
    true, null, true
  ),
  (
    'Batido de Fibra Fórmula 1', 'batido-fibra-formula-1',
    'Batido con fibra añadida para el control de peso.',
    3190, 'EUR', null, 'control-de-peso',
    'https://www.herbalife.com/es-es/productos/batido-fibra-formula-1', 'F1-FIBRA',
    true, null, true
  )
) as p (name, slug, description, price_cents, currency, image_url, category_slug, external_product_url, external_sku, is_available, availability_note, is_active)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;

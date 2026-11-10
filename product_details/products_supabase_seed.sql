-- ===================================================================

-- KRMU Atelier - Products Table Schema & Seed Data

-- Generated on: 2026-11-10T11:29:48.760Z

-- Total Products: 18

-- ===================================================================


CREATE TABLE IF NOT EXISTS public.products (

  id VARCHAR(50) PRIMARY KEY,

  name VARCHAR(255) NOT NULL,

  slug VARCHAR(255) UNIQUE NOT NULL,

  category VARCHAR(50) NOT NULL,

  subcategory VARCHAR(50) NOT NULL,

  badge VARCHAR(50),

  is_new_arrival BOOLEAN DEFAULT FALSE,

  is_bestseller BOOLEAN DEFAULT FALSE,

  price NUMERIC(10, 2) NOT NULL,

  original_price NUMERIC(10, 2),

  stock INTEGER NOT NULL DEFAULT 10,

  rating NUMERIC(3, 2) DEFAULT 5.0,

  review_count INTEGER DEFAULT 0,

  sizes TEXT[] NOT NULL DEFAULT '{"XS","S","M","L","XL"}',

  description TEXT,

  details TEXT[],

  care TEXT,

  fit TEXT,

  images TEXT[] NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  updated_at TIMESTAMPTZ DEFAULT NOW()

);


-- Enable RLS and public read policy

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow authenticated admin full access to products" ON public.products FOR ALL USING (auth.role() = 'authenticated');


-- Upsert seed items

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-01',
  'Oversized Minimalist Trench Coat',
  'oversized-minimalist-trench-coat',
  'women',
  'outerwear',
  'New Season',
  TRUE,
  TRUE,
  8999,
  11999,
  6,
  4.9,
  38,
  ARRAY['XS','S','M','L','XL'],
  'Architectural drape meets timeless functionalism. Cut from heavy water-repellent organic cotton gabardine, featuring a storm flap, drop shoulders, horn buttons, and an exaggerated belt that can be cinched tight or worn loose.',
  ARRAY['100% Organic Heavyweight Cotton Gabardine','Signature double-layer storm collar with throat latch','Genuine recycled buffalo horn buttons','Full cupro lining for effortless layering'],
  'Dry clean only. Store on shaped wooden hanger.',
  'Designed for a modern oversized silhouette. True to size.',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-02',
  'Pure Mulberry Silk Bias Slip Dress',
  'pure-mulberry-silk-bias-slip-dress',
  'women',
  'dresses',
  'Editor''s Pick',
  TRUE,
  TRUE,
  6799,
  8499,
  4,
  4.9,
  29,
  ARRAY['XS','S','M','L'],
  'An evening staple engineered with a pure diagonal bias grain that skims your natural contours without clinging. Features delicate adjustable French rouleau straps.',
  ARRAY['100% 22-Momme Grade 6A Mulberry Silk','French seams throughout for skin comfort','Subtle side-slit hem for effortless movement'],
  'Hand wash cold with silk detergent or dry clean.',
  'Fluid drape. Designed to float gently over curves.',
  ARRAY['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-03',
  'Pleated Wide-Leg Studio Trouser',
  'pleated-wide-leg-studio-trouser',
  'women',
  'trousers',
  'Bestseller',
  FALSE,
  TRUE,
  4999,
  6299,
  7,
  4.8,
  53,
  ARRAY['XS','S','M','L','XL'],
  'High-waisted trousers with deep front double pleats that cascade down into an expansive wide-leg hem. Tailored with an internal grip waistband.',
  ARRAY['Wool-viscose blend with fluid drape','High-rise with clean tailored waistband','Concealed zip fly and hook-and-bar closure'],
  'Dry clean or gentle hand wash with wool detergent.',
  'High waist with dramatic wide leg.',
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1551803091-e20673f15770?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-04',
  'Sculptural Ribbed Knit Cardigan',
  'sculptural-ribbed-knit-cardigan',
  'women',
  'outerwear',
  'New Arrival',
  TRUE,
  FALSE,
  5299,
  6999,
  9,
  4.8,
  22,
  ARRAY['XS','S','M','L'],
  'Knitted in 7-gauge pure extrafine Merino wool. Features a deep V-neckline, bell sleeves, and genuine freshwater shell closures.',
  ARRAY['100% Australian Extrafine Merino Wool','Zero-waste 3D knit construction','Natural mother-of-pearl buttons'],
  'Hand wash cold with wool wash. Dry flat.',
  'Relaxed body with architectural wide sleeves.',
  ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-05',
  'Japanese Poplin Sculpted Shirtdress',
  'japanese-poplin-sculpted-shirtdress',
  'women',
  'dresses',
  'Atelier Classic',
  FALSE,
  TRUE,
  5899,
  7499,
  11,
  4.9,
  31,
  ARRAY['XS','S','M','L'],
  'Woven in Okayama from 120-count high-density cotton poplin. Features asymmetric hidden placket buttons and an adjustable tie sash.',
  ARRAY['100% Long-Staple Japanese Cotton Poplin','Removable sash belt with architectural buckle','Mother-of-pearl buttons'],
  'Machine wash delicate cold. Hang dry.',
  'Tailored shoulders falling into an A-line skirt.',
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-06',
  'Double-Faced Cashmere Wrap Coat',
  'double-faced-cashmere-wrap-coat',
  'women',
  'outerwear',
  'Couture Edition',
  TRUE,
  TRUE,
  14999,
  18999,
  3,
  5,
  17,
  ARRAY['S','M','L'],
  'Hand-finished double-faced cashmere with invisible split-edge seams. Features an oversized shawl collar and tie belt.',
  ARRAY['90% Cashmere, 10% Extra-Fine Virgin Wool','Hand-sewn edges with no visible machine stitching','Unlined for pure natural breathability'],
  'Specialist dry clean only.',
  'Relaxed drape designed for layering over chunky knitwear.',
  ARRAY['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-07',
  'Mulberry Silk Satin Bias Maxi Skirt',
  'mulberry-silk-satin-bias-maxi-skirt',
  'women',
  'trousers',
  'Bestseller',
  FALSE,
  TRUE,
  4899,
  6199,
  8,
  4.8,
  44,
  ARRAY['XS','S','M','L'],
  'An effortless slip maxi skirt tailored with an elasticated waistband and fluid ankle sweep.',
  ARRAY['100% Pure Mulberry Silk','Bias cut that glides over hips','Enclosed elastic waistband'],
  'Hand wash cold or dry clean.',
  'True to size. Flows into a delicate fluted hem.',
  ARRAY['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-w-08',
  'Architectural Linen Halter Blouse',
  'architectural-linen-halter-blouse',
  'women',
  'tops',
  'Summer Atelier',
  TRUE,
  FALSE,
  2899,
  3699,
  14,
  4.7,
  19,
  ARRAY['XS','S','M','L'],
  'High-neck halter top in enzyme-washed Normandy linen featuring open back ties and sculptural pleating.',
  ARRAY['100% Certified European Flax Linen','Self-tie neck and back closures','Double lined bodice'],
  'Machine wash cold delicate.',
  'Close fit across the chest, relaxing at waist.',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-01',
  'Architectural Double-Breasted Blazer',
  'architectural-double-breasted-blazer',
  'men',
  'outerwear',
  'Bestseller',
  FALSE,
  TRUE,
  9499,
  12499,
  8,
  4.8,
  47,
  ARRAY['S','M','L','XL'],
  'Sharp peak lapels balanced by soft, unpadded shoulders for structured ease. Cut from a breathable high-twist wool blend with natural stretch.',
  ARRAY['75% Super 120s Wool, 25% Fine Mulberry Silk','Unstructured roped shoulder with soft canvas chest piece','Working cuff buttonholes with mother-of-pearl hardware'],
  'Specialist dry clean only. Steam refresh recommended.',
  'Tailored contemporary fit. Model wears size M.',
  ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-02',
  'Relaxed Organic Linen Overshirt',
  'relaxed-organic-linen-overshirt',
  'men',
  'tops',
  'Sustainable',
  TRUE,
  FALSE,
  3499,
  4499,
  12,
  4.7,
  31,
  ARRAY['S','M','L','XL','XXL'],
  'Woven from Normandy flax and washed with pumice stones for immediate softness. Cut boxy with twin chest utility pockets.',
  ARRAY['100% French Normandy Flax Linen','Garment enzyme washed to eliminate shrinkage','Double needle felled seams for longevity'],
  'Machine wash cold inside-out on gentle cycle.',
  'Boxy, relaxed drape. True to size.',
  ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-03',
  'Pleated Tapered Wool Trouser',
  'pleated-tapered-wool-trouser',
  'men',
  'trousers',
  'Tailored',
  TRUE,
  TRUE,
  5499,
  7299,
  11,
  4.9,
  36,
  ARRAY['30','32','34','36','38'],
  'Rooted in classic Savile Row tailoring with modern relaxed proportions. High rise with single reverse pleats and side waist adjusters.',
  ARRAY['100% Wool Flannel from Biella, Italy','Stainless steel side tab adjusters','Split back waistband for bespoke comfort'],
  'Dry clean only. Steam press as needed.',
  'Roomy through the thigh tapering cleanly to a 7.5" leg opening.',
  ARRAY['https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-04',
  'Heavyweight Supima Cotton Raw Tee',
  'heavyweight-supima-cotton-raw-tee',
  'men',
  'tops',
  'Essentials',
  FALSE,
  TRUE,
  1899,
  2499,
  25,
  4.9,
  88,
  ARRAY['S','M','L','XL','XXL'],
  'Engineered from 280 GSM extra-long staple Supima cotton. Offers a substantial structured drape that never loses its shape.',
  ARRAY['280 GSM American Supima combed cotton','Dense 1x1 rib knit collar that resists stretching','Blind-stitched cuffs and hem'],
  'Machine wash cold with like colors.',
  'Slightly boxy, relaxed modern cut.',
  ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-05',
  'Minimalist Italian Wool Overcoat',
  'minimalist-italian-wool-overcoat',
  'men',
  'outerwear',
  'Couture Edition',
  TRUE,
  TRUE,
  12999,
  16999,
  5,
  4.9,
  27,
  ARRAY['S','M','L','XL'],
  'Calf-length overcoat cut from 650 GSM heavy Italian wool melton. Features concealed horn button placket and deep welt hand pockets.',
  ARRAY['100% Virgin Italian Melton Wool','Full Bemberg cupro lining for smooth glide','Internal chest wallet and passport pockets'],
  'Dry clean only.',
  'Substantial architectural silhouette.',
  ARRAY['https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-06',
  'Cashmere-Silk Knit Polo',
  'cashmere-silk-knit-polo',
  'men',
  'tops',
  'New Arrival',
  TRUE,
  FALSE,
  4999,
  6499,
  10,
  4.8,
  23,
  ARRAY['S','M','L','XL'],
  'A decadent 16-gauge blend of Grade-A Mongolian cashmere and fine mulberry silk. Features a collar without buttons for clean minimal lines.',
  ARRAY['70% Cashmere, 30% Mulberry Silk','Seamless knitted collar that rests flat','Ribbed cuffs and waistband'],
  'Hand wash cold or dry clean.',
  'Tailored fit that skims the torso comfortably.',
  ARRAY['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-07',
  'Japanese Selvedge Denim Trouser',
  'japanese-selvedge-denim-trouser',
  'men',
  'trousers',
  'Limited Drop',
  TRUE,
  TRUE,
  6499,
  8299,
  9,
  4.9,
  41,
  ARRAY['30','32','34','36'],
  'Woven on vintage shuttle looms in Kojima, Japan from 14oz raw selvedge cotton. Finished with custom copper rivets and red-line ticker.',
  ARRAY['14oz Kuroki Mills Raw Selvedge Denim','Reinforced rear pocket lining with hidden rivets','Solid brass button fly'],
  'Wear dry for 6 months before first cold soak.',
  'Straight leg with gentle taper below knee.',
  ARRAY['https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-m-08',
  'Relaxed Poplin Camp Collar Shirt',
  'relaxed-poplin-camp-collar-shirt',
  'men',
  'tops',
  'Essentials',
  FALSE,
  TRUE,
  2999,
  3899,
  18,
  4.7,
  52,
  ARRAY['S','M','L','XL','XXL'],
  'Crisp 80s two-ply organic cotton poplin shirt with Cuban camp collar and straight hem with side vents.',
  ARRAY['100% Organic GOTS Certified Cotton Poplin','Straight hem designed to be worn untucked','Genuine freshwater shell buttons'],
  'Machine wash cold. Warm iron.',
  'Relaxed easy fit.',
  ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-a-01',
  'Full-Grain Leather Minimalist Tote',
  'full-grain-leather-minimalist-tote',
  'accessories',
  'accessories',
  'Atelier Classic',
  TRUE,
  TRUE,
  7999,
  9999,
  5,
  5,
  33,
  ARRAY['One Size'],
  'Handcrafted from vegetable-tanned full-grain leather that patinas with beauty. Padded 15-inch laptop compartment inside.',
  ARRAY['Vegetable-tanned full-grain calf leather','Solid antique brass hardware','Magnetic top clasp and interior zip pocket'],
  'Wipe with damp cloth. Apply natural leather balm biannually.',
  'Spacious everyday tote. Fits 16" laptop easily.',
  ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();

INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  'krmu-a-02',
  'Pure Handwoven Pashmina Stole',
  'pure-handwoven-pashmina-stole',
  'accessories',
  'accessories',
  'Heritage Edition',
  FALSE,
  TRUE,
  6999,
  8999,
  7,
  5,
  28,
  ARRAY['One Size'],
  'Spun from Changthangi mountain goat fleece and hand-loomed in Kashmir. Featherlight yet exceptionally warm.',
  ARRAY['100% Certified Authentic Pashmina','Hand-spun on wooden charkha','Traditional eyelash fringe hem'],
  'Specialist dry clean only.',
  'Generous 200cm x 70cm proportions.',
  ARRAY['https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=1200&auto=format&fit=crop','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  badge = EXCLUDED.badge,
  is_new_arrival = EXCLUDED.is_new_arrival,
  is_bestseller = EXCLUDED.is_bestseller,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  images = EXCLUDED.images,
  updated_at = NOW();
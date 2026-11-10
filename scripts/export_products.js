import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, '../product_details');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Export JSON
const jsonPath = path.join(targetDir, 'products.json');
fs.writeFileSync(jsonPath, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
console.log(`[OK] Exported ${INITIAL_PRODUCTS.length} products to products.json`);

// 2. Export CSV (Excel compatible)
const escapeCsv = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

const headers = [
  'id',
  'name',
  'slug',
  'category',
  'subcategory',
  'badge',
  'isNewArrival',
  'isBestseller',
  'price',
  'originalPrice',
  'stock',
  'rating',
  'reviewCount',
  'sizes',
  'description',
  'craftsmanship_details',
  'care_instructions',
  'fit_advisory',
  'primary_image',
  'all_images'
];

const csvRows = [headers.join(',')];

INITIAL_PRODUCTS.forEach((p) => {
  const row = [
    escapeCsv(p.id),
    escapeCsv(p.name),
    escapeCsv(p.slug),
    escapeCsv(p.category),
    escapeCsv(p.subcategory),
    escapeCsv(p.badge || ''),
    escapeCsv(p.isNewArrival ? 'TRUE' : 'FALSE'),
    escapeCsv(p.isBestseller ? 'TRUE' : 'FALSE'),
    p.price,
    p.originalPrice || '',
    p.stock,
    p.rating,
    p.reviewCount,
    escapeCsv((p.sizes || []).join('; ')),
    escapeCsv(p.description),
    escapeCsv((p.details || []).join(' | ')),
    escapeCsv(p.care),
    escapeCsv(p.fit),
    escapeCsv(p.images?.[0] || ''),
    escapeCsv((p.images || []).join('; '))
  ];
  csvRows.push(row.join(','));
});

const csvPath = path.join(targetDir, 'products.csv');
fs.writeFileSync(csvPath, csvRows.join('\r\n'), 'utf-8');
console.log(`[OK] Exported ${INITIAL_PRODUCTS.length} products to products.csv`);

// 3. Export SQL Seed for Supabase
const sqlStatements = [
  `-- ===================================================================`,
  `-- KRMU Atelier - Products Table Schema & Seed Data`,
  `-- Generated on: ${new Date().toISOString()}`,
  `-- Total Products: ${INITIAL_PRODUCTS.length}`,
  `-- ===================================================================\n`,
  `CREATE TABLE IF NOT EXISTS public.products (`,
  `  id VARCHAR(50) PRIMARY KEY,`,
  `  name VARCHAR(255) NOT NULL,`,
  `  slug VARCHAR(255) UNIQUE NOT NULL,`,
  `  category VARCHAR(50) NOT NULL,`,
  `  subcategory VARCHAR(50) NOT NULL,`,
  `  badge VARCHAR(50),`,
  `  is_new_arrival BOOLEAN DEFAULT FALSE,`,
  `  is_bestseller BOOLEAN DEFAULT FALSE,`,
  `  price NUMERIC(10, 2) NOT NULL,`,
  `  original_price NUMERIC(10, 2),`,
  `  stock INTEGER NOT NULL DEFAULT 10,`,
  `  rating NUMERIC(3, 2) DEFAULT 5.0,`,
  `  review_count INTEGER DEFAULT 0,`,
  `  sizes TEXT[] NOT NULL DEFAULT '{"XS","S","M","L","XL"}',`,
  `  description TEXT,`,
  `  details TEXT[],`,
  `  care TEXT,`,
  `  fit TEXT,`,
  `  images TEXT[] NOT NULL,`,
  `  created_at TIMESTAMPTZ DEFAULT NOW(),`,
  `  updated_at TIMESTAMPTZ DEFAULT NOW()`,
  `);\n`,
  `-- Enable RLS and public read policy`,
  `ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;`,
  `CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);`,
  `CREATE POLICY "Allow authenticated admin full access to products" ON public.products FOR ALL USING (auth.role() = 'authenticated');\n`,
  `-- Upsert seed items`
];

INITIAL_PRODUCTS.forEach((p) => {
  const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');
  const sizesArray = `ARRAY[${(p.sizes || []).map((s) => `'${escapeSql(s)}'`).join(',')}]`;
  const detailsArray = `ARRAY[${(p.details || []).map((d) => `'${escapeSql(d)}'`).join(',')}]`;
  const imagesArray = `ARRAY[${(p.images || []).map((img) => `'${escapeSql(img)}'`).join(',')}]`;

  const stmt = `INSERT INTO public.products (id, name, slug, category, subcategory, badge, is_new_arrival, is_bestseller, price, original_price, stock, rating, review_count, sizes, description, details, care, fit, images)
VALUES (
  '${escapeSql(p.id)}',
  '${escapeSql(p.name)}',
  '${escapeSql(p.slug)}',
  '${escapeSql(p.category)}',
  '${escapeSql(p.subcategory)}',
  ${p.badge ? `'${escapeSql(p.badge)}'` : 'NULL'},
  ${p.isNewArrival ? 'TRUE' : 'FALSE'},
  ${p.isBestseller ? 'TRUE' : 'FALSE'},
  ${p.price},
  ${p.originalPrice || 'NULL'},
  ${p.stock},
  ${p.rating},
  ${p.reviewCount},
  ${sizesArray},
  '${escapeSql(p.description)}',
  ${detailsArray},
  '${escapeSql(p.care)}',
  '${escapeSql(p.fit)}',
  ${imagesArray}
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
  updated_at = NOW();`;

  sqlStatements.push(stmt);
});

const sqlPath = path.join(targetDir, 'products_supabase_seed.sql');
fs.writeFileSync(sqlPath, sqlStatements.join('\n\n'), 'utf-8');
console.log(`[OK] Exported Supabase SQL seed to products_supabase_seed.sql`);

// 4. Export Clean Excel Import Template
const templateHeaders = [
  'id',
  'name',
  'category',
  'subcategory',
  'price',
  'originalPrice',
  'stock',
  'badge',
  'sizes',
  'description',
  'details',
  'care',
  'fit',
  'image_url'
];

const sampleRows = [
  templateHeaders.join(','),
  [
    'krmu-sample-01',
    '"Hand-Spun Khadi Silk Mandarin Shirt"',
    'men',
    'shirts',
    '4499',
    '5999',
    '15',
    '"New Arrival"',
    '"S; M; L; XL"',
    '"Crafted from hand-spun wild tussar silk with a tailored band collar."',
    '"100% Handloom Tussar Silk | Mother of Pearl buttons | Hand-rolled hem"',
    '"Dry clean only or delicate cold hand wash"',
    '"Regular modern fit"',
    '"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200"'
  ].join(','),
  [
    'krmu-sample-02',
    '"Chanderi Organza Sculpted Evening Cape"',
    'women',
    'outerwear',
    '7999',
    '9999',
    '8',
    '"Exclusive"',
    '"XS; S; M; L"',
    '"An ethereal sheer cape crafted from lustrous Chanderi silk organza."',
    '"Pure silk organza | Hand-embroidered subtle tonal edges"',
    '"Specialist dry clean only"',
    '"Voluminous floating silhouette"',
    '"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200"'
  ].join(',')
];

const templatePath = path.join(targetDir, 'excel_import_template.csv');
fs.writeFileSync(templatePath, sampleRows.join('\r\n'), 'utf-8');
console.log(`[OK] Exported CSV template to excel_import_template.csv`);

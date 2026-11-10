import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, '../product_details');

const categories = {
  women: 'Women’s Collection',
  men: 'Men’s Collection',
  accessories: 'Accessories & Bespoke Objects'
};

const lines = [
  `# KRMU Atelier — Comprehensive Product Catalog & Specifications`,
  ``,
  `> **Brand:** KRMU Haute Apparel • New Delhi Atelier  `,
  `> **Currency:** Indian Rupee (INR ₹) • All Prices Inclusive of 12% GST  `,
  `> **Total Garments in Archive:** ${INITIAL_PRODUCTS.length}  `,
  `> **Last Updated:** ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}  `,
  ``,
  `---`,
  ``,
  `## Table of Contents`,
  `- [Collection Summary](#collection-summary)`,
  `- [Women’s Collection](#womens-collection)`,
  `- [Men’s Collection](#mens-collection)`,
  `- [Accessories & Bespoke Objects](#accessories--bespoke-objects)`,
  `- [Pricing & Inventory Overview](#pricing--inventory-overview)`,
  ``,
  `---`,
  ``,
  `## Collection Summary`,
  ``,
  `| Category | Garments Count | Price Range (₹) | Key Fabrics |`,
  `| :--- | :--- | :--- | :--- |`,
  `| **Women** | 8 Silhouettes | ₹2,899 – ₹14,999 | Mulberry Silk, Cashmere, Japanese Poplin, Organic Gabardine |`,
  `| **Men** | 8 Silhouettes | ₹1,899 – ₹12,999 | Italian Wool, Selvedge Denim, Supima Cotton, Organic Linen |`,
  `| **Accessories** | 2 Bespoke Pieces | ₹6,999 – ₹7,999 | Handwoven Cashmere Pashmina, Full-Grain Tuscan Leather |`,
  ``,
  `---`,
  ``
];

for (const [catKey, catTitle] of Object.entries(categories)) {
  const catProducts = INITIAL_PRODUCTS.filter((p) => p.category === catKey);
  if (catProducts.length === 0) continue;

  lines.push(`## ${catTitle}`);
  lines.push(``);

  catProducts.forEach((p, index) => {
    const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    lines.push(`### ${index + 1}. ${p.name}`);
    lines.push(``);
    lines.push(`- **Product Code / SKU:** \`${p.id}\``);
    lines.push(`- **Category / Division:** ${p.category.toUpperCase()} • **Subcategory:** ${p.subcategory}`);
    if (p.badge) lines.push(`- **Editorial Tag:** \`${p.badge}\``);
    lines.push(`- **Retail Price:** **₹${p.price.toLocaleString('en-IN')}**${p.originalPrice ? ` *(Original MRP: ~~₹${p.originalPrice.toLocaleString('en-IN')}~~ — ${discount}% off)*` : ''}`);
    lines.push(`- **Atelier Stock:** **${p.stock} units** available`);
    lines.push(`- **Client Rating:** ★ **${p.rating}** / 5.0 (${p.reviewCount} verified reviews)`);
    lines.push(`- **Available Sizes:** ${(p.sizes || []).map((s) => `\`${s}\``).join(' ')}`);
    lines.push(`- **Fit Advisory:** *${p.fit || 'True to size.'}*`);
    lines.push(`- **Care Instructions:** ${p.care || 'Dry clean only.'}`);
    lines.push(``);
    lines.push(`#### Silhouette & Concept:`);
    lines.push(`> ${p.description}`);
    lines.push(``);
    if (p.details && p.details.length > 0) {
      lines.push(`#### Craftsmanship & Material Details:`);
      p.details.forEach((d) => lines.push(`- ${d}`));
      lines.push(``);
    }
    lines.push(`#### Visual Archive:`);
    (p.images || []).forEach((img, imgIdx) => {
      lines.push(`- Image ${imgIdx + 1}: [High-Resolution Asset URL](${img})`);
    });
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  });
}

// Pricing table
lines.push(`## Pricing & Inventory Overview`);
lines.push(``);
lines.push(`| SKU | Silhouette Name | Category | Type | Retail (₹) | MRP (₹) | Stock | Sizes |`);
lines.push(`| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |`);

INITIAL_PRODUCTS.forEach((p) => {
  lines.push(
    `| \`${p.id}\` | **${p.name}** | ${p.category} | ${p.subcategory} | **₹${p.price.toLocaleString('en-IN')}** | ${p.originalPrice ? `₹${p.originalPrice.toLocaleString('en-IN')}` : '—'} | ${p.stock} | ${(p.sizes || []).join(', ')} |`
  );
});

lines.push(``);
lines.push(`---`);
lines.push(`*Document compiled automatically by KRMU Atelier Data Service.*`);

fs.writeFileSync(path.join(targetDir, 'PRODUCT_CATALOG.md'), lines.join('\n'), 'utf-8');
console.log(`[OK] Created PRODUCT_CATALOG.md`);

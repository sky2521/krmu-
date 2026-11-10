# KRMU Atelier — Product Details Archive & Management Hub

Welcome to the central product details archive for **KRMU Haute Apparel**. All product specifications, pricing, inventory figures, sizing matrices, and database seed scripts are consolidated here for easy viewing, editing, and syncing.

---

## 📁 Folder Contents

| File Name | Format | Description & Usage |
| :--- | :--- | :--- |
| [`products.json`](./products.json) | **JSON** | Full structured dataset of all 18 atelier garments. Used directly by the frontend and backend contexts. |
| [`products.csv`](./products.csv) | **CSV** | Tabular format ready to open in **Microsoft Excel**, **Google Sheets**, or **Apple Numbers**. Contains all product metadata, pricing, and stock. |
| [`PRODUCT_CATALOG.md`](./PRODUCT_CATALOG.md) | **Markdown** | Comprehensive visual catalog document with descriptions, craftsmanship notes, fabric compositions, care instructions, image URLs, and pricing tables. |
| [`excel_import_template.csv`](./excel_import_template.csv) | **CSV** | Blank/sample template for adding or bulk importing new garments into the website. |
| [`products_supabase_seed.sql`](./products_supabase_seed.sql) | **SQL** | PostgreSQL / Supabase migration script to create the `products` table and insert all garments into your cloud database. |

---

## 🛠️ How to View & Update Products

### Option 1: Open in Excel or Google Sheets
1. Open [`products.csv`](./products.csv) with **Microsoft Excel** or import it into **Google Sheets** (`File` > `Import` > `Upload`).
2. You can view and edit columns such as `price`, `stock`, `description`, `sizes`, and `images`.
3. To add new pieces, you can copy the structure from [`excel_import_template.csv`](./excel_import_template.csv).

### Option 2: Live In-App Management (Admin Portal)
1. Open your browser and navigate to:  
   👉 **[http://localhost:3000/admin](http://localhost:3000/admin)**
2. Go to the **Products & Inventory** or **Excel / CSV Importer** tab.
3. You can:
   - Add individual products with live image previews.
   - Edit prices, stock counts, and badges.
   - Upload your updated `products.csv` or paste raw CSV text to instantly sync the website catalog.

### Option 3: Sync to Supabase Cloud Database
If you wish to store all products in your live Supabase project:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/uwbgoymzaxyhhiefzhcb/sql).
2. Go to the **SQL Editor**.
3. Copy and paste the contents of [`products_supabase_seed.sql`](./products_supabase_seed.sql).
4. Click **Run**. This creates the `public.products` table with Row Level Security (RLS) enabled and seeds all 18 garments.

---

## 📊 Garment Overview Summary

- **Total Silhouettes:** 18
- **Women's Division:** 8 (Outerwear, Dresses, Trousers, Cardigans, Shirtdresses, Maxi Skirts, Halters)
- **Men's Division:** 8 (Blazers, Overshirts, Trousers, Supima Tees, Overcoats, Polo Knits, Selvedge Denim, Camp Shirts)
- **Accessories & Bespoke:** 2 (Full-grain Tuscan Leather Tote, Handwoven Cashmere Pashmina Stole)
- **Currency & Taxation:** All retail prices are in **INR (₹)** with **12% GST** included.
- **Color Option Status:** Single authentic master garment color per silhouette (color selection removed per brand specification). Sizing (`XS`, `S`, `M`, `L`, `XL`) is fully customizable.

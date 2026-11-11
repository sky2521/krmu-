import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import {
  fetchSupabaseProducts,
  upsertSupabaseProduct,
  deleteSupabaseProduct,
  syncCatalogToSupabase,
  submitSupabaseProductReview,
} from '../services/supabase';

const ProductContext = createContext();

const CATALOG_VERSION = "krmu_catalog_v3";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const savedVersion = localStorage.getItem('krmu_catalog_ver');
      const saved = localStorage.getItem('krmu_catalog');
      if (saved && savedVersion === CATALOG_VERSION) {
        const parsed = JSON.parse(saved);
        if (parsed.length >= INITIAL_PRODUCTS.length) {
          return parsed;
        }
      }
      localStorage.setItem('krmu_catalog_ver', CATALOG_VERSION);
      return INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);

  // Pull live catalog & reviews from Supabase on mount
  useEffect(() => {
    let mounted = true;
    fetchSupabaseProducts().then((cloudProducts) => {
      if (mounted && Array.isArray(cloudProducts) && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('krmu_catalog', JSON.stringify(products));
      localStorage.setItem('krmu_catalog_ver', CATALOG_VERSION);
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const addProduct = (newProduct) => {
    const id = `krmu-${Date.now().toString().slice(-4)}`;
    const slug = `${newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${id.slice(-4)}`;
    const created = {
      ...newProduct,
      id,
      slug,
      rating: 5.0,
      reviewCount: 0,
      reviews: []
    };
    setProducts((prev) => [created, ...prev]);
    upsertSupabaseProduct(created);
    return created;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updatedFields };
          upsertSupabaseProduct(updated);
          return updated;
        }
        return item;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    deleteSupabaseProduct(id);
  };

  const replaceCatalog = (newProducts) => {
    setProducts(newProducts);
    syncCatalogToSupabase(newProducts);
    try {
      localStorage.setItem('krmu_catalog', JSON.stringify(newProducts));
      localStorage.setItem('krmu_catalog_ver', CATALOG_VERSION);
    } catch (e) {
      console.error(e);
    }
  };

  const importProductsFromCsv = (csvText) => {
    try {
      const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return { success: false, count: 0, error: "Empty or invalid CSV file" };

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
      
      const newItems = [];
      for (let i = 1; i < lines.length; i++) {
        // Simple CSV splitter handling quoted values
        const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        const cleanRow = row.map((cell) => cell.replace(/^"|"$/g, '').trim());

        const getVal = (colNames, fallback = '') => {
          for (const name of colNames) {
            const idx = headers.indexOf(name);
            if (idx > -1 && cleanRow[idx]) return cleanRow[idx];
          }
          return fallback;
        };

        const name = getVal(['name', 'title', 'product name', 'item name'], `Garment ${i}`);
        const category = getVal(['category', 'division', 'gender'], 'women').toLowerCase();
        const subcategory = getVal(['subcategory', 'type', 'garment type'], 'tops').toLowerCase();
        const price = parseFloat(getVal(['price', 'mrp', 'selling price', 'cost'], '3999')) || 3999;
        const originalPrice = parseFloat(getVal(['originalprice', 'original price', 'regular price', 'compare price'], '0')) || Math.round(price * 1.25);
        const stock = parseInt(getVal(['stock', 'quantity', 'inventory', 'qty'], '10')) || 10;
        const badge = getVal(['badge', 'tag', 'label'], i <= 3 ? 'New Season' : '');
        const image = getVal(['image', 'images', 'image url', 'photo', 'picture'], 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop');
        const description = getVal(['description', 'desc', 'details'], 'Crafted from immaculate natural fibers with architectural tailoring.');

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const id = `krmu-csv-${i}-${Date.now().toString().slice(-4)}`;

        newItems.push({
          id,
          name,
          slug,
          category: category.includes('men') && !category.includes('women') ? 'men' : category.includes('access') ? 'accessories' : 'women',
          subcategory,
          badge,
          isNewArrival: badge.toLowerCase().includes('new') || i <= 5,
          isBestseller: badge.toLowerCase().includes('best') || i % 2 === 0,
          price,
          originalPrice: originalPrice > price ? originalPrice : null,
          stock,
          rating: 4.8,
          reviewCount: Math.floor(10 + Math.random() * 40),
          images: [image],
          colors: [
            { name: "Onyx Noir", hex: "#161616" },
            { name: "Natural Ecru", hex: "#EBE5D8" }
          ],
          sizes: ["XS", "S", "M", "L", "XL"],
          description,
          details: ["100% sustainably sourced fibers", "Tailored ethically in India", "Generous hem allowances"],
          care: "Dry clean only. Steam refresh recommended.",
          fit: "Contemporary tailored fit. True to size.",
          reviews: []
        });
      }

      if (newItems.length > 0) {
        replaceCatalog(newItems);
        return { success: true, count: newItems.length };
      }
      return { success: false, count: 0, error: "No valid rows parsed" };
    } catch (err) {
      console.error(err);
      return { success: false, count: 0, error: err.message };
    }
  };

  const addProductReview = async (productId, reviewData) => {
    const res = await submitSupabaseProductReview(productId, reviewData);
    const saved = res?.data;

    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newReview = {
            id: saved?.id || `rev-${Date.now()}`,
            date: saved?.created_at
              ? saved.created_at.split('T')[0]
              : new Date().toISOString().split('T')[0],
            verified: true,
            ...reviewData
          };
          const updatedReviews = [newReview, ...(item.reviews || [])];
          const avgRating = (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          ).toFixed(1);

          return {
            ...item,
            reviews: updatedReviews,
            rating: parseFloat(avgRating),
            reviewCount: Math.max(item.reviewCount || 0, updatedReviews.length)
          };
        }
        return item;
      })
    );
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    syncCatalogToSupabase(INITIAL_PRODUCTS);
    localStorage.setItem('krmu_catalog', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('krmu_catalog_ver', CATALOG_VERSION);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        replaceCatalog,
        importProductsFromCsv,
        addProductReview,
        resetToDefaults,
        activeQuickViewProduct,
        setActiveQuickViewProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);

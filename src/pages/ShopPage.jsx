import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search as SearchIcon,
  Sparkles
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/product/ProductCard';

export default function ShopPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const subcategoryParam = searchParams.get('subcategory') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, rating, newest
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState('all'); // all, under-3000, 3000-6000, above-6000
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available filters dynamically extracted
  const allSizes = ['XS', 'S', 'M', 'L', 'XL'];
  const subcategories = ['all', 'outerwear', 'tops', 'trousers', 'dresses', 'accessories', 'footwear'];

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (categoryParam === 'men' && prod.category !== 'men') return false;
      if (categoryParam === 'women' && prod.category !== 'women') return false;
      if (categoryParam === 'accessories' && prod.category !== 'accessories') return false;
      if (categoryParam === 'new-arrivals' && !prod.isNewArrival) return false;

      // Subcategory filter
      if (subcategoryParam !== 'all' && prod.subcategory !== subcategoryParam) return false;

      // Search filter
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesCategory = prod.category.toLowerCase().includes(query);
        const matchesSub = prod.subcategory?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesSub) return false;
      }

      // Size filter
      if (selectedSize !== 'all' && !prod.sizes.includes(selectedSize)) return false;

      // Price range filter
      if (priceRange === 'under-3000' && prod.price >= 3000) return false;
      if (priceRange === '3000-6000' && (prod.price < 3000 || prod.price > 6000)) return false;
      if (priceRange === 'above-6000' && prod.price <= 6000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // default featured
    });
  }, [products, categoryParam, subcategoryParam, searchParam, selectedSize, priceRange, sortBy]);

  const updateCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  };

  const updateSubcategory = (sub) => {
    const next = new URLSearchParams(searchParams);
    if (sub === 'all') next.delete('subcategory');
    else next.set('subcategory', sub);
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSelectedSize('all');
    setPriceRange('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    categoryParam !== 'all' ||
    subcategoryParam !== 'all' ||
    searchParam !== '' ||
    selectedSize !== 'all' ||
    priceRange !== 'all';

  const categoryTitles = {
    all: 'The Entire Atelier Collection',
    men: "Men's Tailoring & Essentials",
    women: "Women's Silhouettes & Couture",
    accessories: 'Atelier Objects & Footwear',
    'new-arrivals': 'New Season Atelier Arrivals'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 border-b border-[#E6DED5] pb-6">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E]">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-[#121214] font-semibold">Atelier Shop</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#121214]">
              {searchParam ? `Search Results for "${searchParam}"` : categoryTitles[categoryParam] || 'The Collection'}
            </h1>
            <p className="text-xs text-[#7F7972] mt-1">
              Displaying {filteredProducts.length} meticulously handcrafted pieces
            </p>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase tracking-widest text-[#7F7972] font-medium hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#D5C7B8] text-xs uppercase tracking-wider py-2 px-3 focus:outline-none focus:border-black text-[#121214] rounded-sm font-medium"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#121214] text-white text-xs uppercase tracking-widest rounded-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Division Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-4">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'men', label: 'Men' },
            { id: 'women', label: 'Women' },
            { id: 'accessories', label: 'Accessories' },
            { id: 'new-arrivals', label: 'New Arrivals' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-sm border ${
                categoryParam === cat.id
                  ? 'bg-[#121214] text-white border-[#121214] font-semibold shadow-sm'
                  : 'bg-white text-[#3E3E42] border-[#E6DED5] hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Filters Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DED5]">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#121214]">Filter Atelier</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#B85D43] hover:underline uppercase tracking-wider font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Subcategory */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121214]">Garment Type</h4>
            <div className="space-y-1.5 text-xs">
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => updateSubcategory(sub)}
                  className={`block w-full text-left py-1 capitalize transition-colors ${
                    subcategoryParam === sub
                      ? 'text-[#121214] font-bold pl-2 border-l-2 border-black'
                      : 'text-[#7F7972] hover:text-black'
                  }`}
                >
                  {sub === 'all' ? 'All Types' : sub}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-[#F0ECE5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121214]">Price Range</h4>
            <div className="space-y-1.5 text-xs text-[#7F7972]">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-3000', label: 'Under ₹3,000' },
                { id: '3000-6000', label: '₹3,000 - ₹6,000' },
                { id: 'above-6000', label: 'Above ₹6,000' }
              ].map((p) => (
                <label key={p.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === p.id}
                    onChange={() => setPriceRange(p.id)}
                    className="accent-black"
                  />
                  <span className={priceRange === p.id ? 'text-[#121214] font-semibold' : ''}>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-4 border-t border-[#F0ECE5]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#121214]">Size</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-2.5 py-1 text-xs border rounded-sm ${
                  selectedSize === 'all' ? 'bg-[#121214] text-white border-black font-semibold' : 'bg-white border-[#D5C7B8]'
                }`}
              >
                All
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-8 py-1 px-2 text-xs border rounded-sm uppercase ${
                    selectedSize === s ? 'bg-[#121214] text-white border-black font-semibold' : 'bg-white border-[#D5C7B8] hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Assurance callout */}
          <div className="p-4 bg-[#F3EFEA] rounded-sm space-y-2 border border-[#E6DED5]">
            <div className="flex items-center gap-1.5 text-[#C5A059] font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Made in Small Batches
            </div>
            <p className="text-[11px] text-[#7F7972] leading-relaxed">
              Every KRMU piece is produced in limited quantities of fewer than 50 garments to maintain immaculate quality.
            </p>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-3">
          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-[#E6DED5] rounded-sm text-xs">
              <span className="text-[#7F7972] text-[11px] uppercase tracking-wider font-semibold">Active:</span>
              {categoryParam !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 border border-[#D5C7B8] text-[#121214]">
                  Division: {categoryParam}
                  <button onClick={() => updateCategory('all')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {subcategoryParam !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 border border-[#D5C7B8] text-[#121214]">
                  Type: {subcategoryParam}
                  <button onClick={() => updateSubcategory('all')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSize !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 border border-[#D5C7B8] text-[#121214]">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('all')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 border border-[#D5C7B8] text-[#121214]">
                  Price: {priceRange}
                  <button onClick={() => setPriceRange('all')} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchParam && (
                <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2.5 py-1 border border-[#D5C7B8] text-[#121214]">
                  Query: {searchParam}
                  <button onClick={() => {
                    const n = new URLSearchParams(searchParams);
                    n.delete('search');
                    setSearchParams(n);
                  }} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#B85D43] underline font-semibold ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#E6DED5] rounded-sm space-y-4">
              <SearchIcon className="w-12 h-12 text-[#B89F88] mx-auto stroke-1" />
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-[#121214]">No items found</h3>
                <p className="text-xs text-[#7F7972] max-w-sm mx-auto">
                  We could not find any garment matching your selected filters. Try broadening your criteria.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6DED5]">
                <h3 className="font-serif text-xl text-[#121214]">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-6 h-6 text-[#121214]" />
                </button>
              </div>

              {/* Subcategories */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#121214]">Garment Type</h4>
                <div className="space-y-1 text-xs">
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        updateSubcategory(sub);
                        setMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1.5 capitalize ${
                        subcategoryParam === sub ? 'font-bold text-black' : 'text-[#7F7972]'
                      }`}
                    >
                      {sub === 'all' ? 'All Types' : sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 pt-4 border-t border-[#E6DED5]">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#121214]">Price Range</h4>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-3000', label: 'Under ₹3,000' },
                    { id: '3000-6000', label: '₹3,000 - ₹6,000' },
                    { id: 'above-6000', label: 'Above ₹6,000' }
                  ].map((p) => (
                    <label key={p.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="radio"
                        name="mobilePrice"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="accent-black"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2 pt-4 border-t border-[#E6DED5]">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#121214]">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs border uppercase ${
                        selectedSize === s ? 'bg-black text-white border-black' : 'bg-white border-[#D5C7B8]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6DED5] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#121214] text-white text-xs uppercase tracking-widest font-semibold"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-center text-xs text-[#B85D43] uppercase tracking-widest"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

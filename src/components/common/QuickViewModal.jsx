import React, { useState } from 'react';
import { X, Star, Heart, Check, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';

export default function QuickViewModal() {
  const { activeQuickViewProduct, setActiveQuickViewProduct } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!activeQuickViewProduct) return null;

  const product = activeQuickViewProduct;
  const currentSize = selectedSize || product.sizes[0];
  const isWished = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, currentSize, 1);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setActiveQuickViewProduct(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden border border-[#E6DED5]">
        {/* Close button */}
        <button
          onClick={() => setActiveQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#121214] hover:bg-black hover:text-white transition-all shadow-sm"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Images */}
          <div className="p-6 bg-[#FAF8F5] flex flex-col justify-between">
            <div className="aspect-[3/4] overflow-hidden rounded-sm relative bg-neutral-200">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#121214] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 mt-4 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-18 overflow-hidden rounded-sm border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#121214]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C867E]">
                  KRMU {product.category}
                </span>
                <span>•</span>
                <div className="flex items-center text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 text-[#121214] font-medium">{product.rating}</span>
                  <span className="ml-1 text-[#8C867E]">({product.reviewCount})</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#121214] leading-snug">
                {product.name}
              </h2>

              <div className="flex items-baseline space-x-3">
                <span className="font-serif text-2xl text-[#121214]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#9E988F] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.stock <= 5 && (
                  <span className="text-[11px] font-semibold text-[#B85D43] bg-orange-50 px-2 py-0.5 rounded">
                    Only {product.stock} left in atelier
                  </span>
                )}
              </div>

              <p className="text-xs text-[#5C5750] leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <label className="uppercase tracking-wider text-[#7F7972] font-medium">
                  Size: <strong className="text-[#121214]">{currentSize}</strong>
                </label>
                <Link
                  to={`/product/${product.slug}#size-guide`}
                  onClick={() => setActiveQuickViewProduct(null)}
                  className="text-[11px] text-[#C5A059] underline hover:text-black"
                >
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-10 px-3 py-1.5 text-xs font-semibold tracking-wider transition-colors border ${
                      currentSize === s
                        ? 'bg-[#121214] text-white border-[#121214]'
                        : 'bg-white text-[#2A2A2E] border-[#D5C7B8] hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    addedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#121214] text-white hover:bg-[#C5A059]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag
                    </>
                  ) : (
                    'Add to Wardrobe'
                  )}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 border transition-colors ${
                    isWished
                      ? 'border-[#B85D43] text-[#B85D43] bg-rose-50'
                      : 'border-[#D5C7B8] text-[#2A2A2E] hover:border-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveQuickViewProduct(null);
                  navigate(`/order/${product.slug}?size=${encodeURIComponent(currentSize)}`);
                }}
                className="w-full py-3 luxury-shimmer text-[#121214] hover:brightness-105 transition-all duration-300 text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 shadow-md group"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to={`/product/${product.slug}`}
                onClick={() => setActiveQuickViewProduct(null)}
                className="block text-center text-xs uppercase tracking-widest text-[#7F7972] hover:text-[#121214] transition-colors py-1"
              >
                View Full Product Details & Craftsmanship →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

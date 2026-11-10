import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { setActiveQuickViewProduct } = useProducts();

  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isWished = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveQuickViewProduct(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Image flipping on hover if secondary image exists
  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      className="group flex flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F0ECE5] rounded-sm">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-[#121214] text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-semibold shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#B85D43] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#121214] hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-[#B85D43] text-[#B85D43]' : ''}`} />
        </button>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2.5 bg-white/95 hover:bg-white text-[#121214] text-[11px] uppercase tracking-wider font-semibold rounded-sm shadow-md flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            className={`px-3 py-2.5 rounded-sm shadow-md flex items-center justify-center transition-all ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#121214] hover:bg-[#C5A059] text-white'
            }`}
            title="Quick Add to Bag"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="pt-3 pb-1 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[10px] text-[#8C867E] uppercase tracking-wider mb-1">
            KRMU Atelier • {product.category}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-[#C5A059] transition-colors">
            <h3 className="font-serif text-base text-[#121214] font-normal leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Rating */}
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-semibold text-[#121214]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#9E988F] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center text-[11px] text-[#7F7972]">
            <Star className="w-3 h-3 text-amber-500 fill-current mr-0.5" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

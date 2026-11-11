import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Ruler, 
  X,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, addProductReview } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState('inches'); // inches or cm
  const [addedToast, setAddedToast] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('details'); // details, material, care, shipping

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl">Garment Not Found</h2>
        <Link to="/shop" className="underline text-xs uppercase tracking-widest">
          Return to Atelier Shop
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    navigate(`/order/${product.slug}?size=${encodeURIComponent(selectedSize)}&qty=${quantity}`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewComment) return;

    addProductReview(product.id, {
      author: reviewAuthor,
      rating: reviewRating,
      title: reviewTitle || 'Exceptional craftsmanship',
      comment: reviewComment
    });

    setReviewSubmitted(true);
    setShowReviewForm(false);
    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E]">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-black capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#121214] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (Thumbnails + Main View) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-18 h-24 overflow-hidden rounded-sm border-2 transition-all ${
                  activeImage === idx ? 'border-[#121214]' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="flex-1 relative aspect-[3/4] bg-[#F0ECE5] rounded-sm overflow-hidden group">
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#121214] text-white text-[10px] uppercase tracking-widest px-3 py-1 font-semibold shadow-md">
                {product.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-[#B85D43] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 font-bold shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Buy Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-[#E6DED5] pb-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C867E] font-medium">
                KRMU Atelier • {product.category}
              </span>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Product link copied to clipboard!");
                  }
                }}
                className="text-[#7F7972] hover:text-black p-1"
                title="Share piece"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#121214] font-normal leading-tight">
              {product.name}
            </h1>

            {/* Rating badge */}
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#121214]">{product.rating}</span>
              <span className="text-xs text-[#7F7972]">•</span>
              <a href="#reviews" className="text-xs text-[#7F7972] underline hover:text-black">
                {product.reviewCount} Client Reviews
              </a>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="font-serif text-3xl text-[#121214] font-light">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#9E988F] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-[#7F7972]">Inclusive of all taxes & duties</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#5C5750] leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector & Size Guide Modal Trigger */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="uppercase tracking-wider text-[#7F7972] font-medium">
                Atelier Sizing: <strong className="text-[#121214]">{selectedSize}</strong>
              </label>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-1 text-[#C5A059] hover:text-[#121214] underline font-medium"
              >
                <Ruler className="w-3.5 h-3.5" /> Size & Fit Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-12 py-2 px-3 text-xs font-semibold tracking-wider transition-all border ${
                    selectedSize === s
                      ? 'bg-[#121214] text-white border-[#121214] shadow-sm'
                      : 'bg-white text-[#2A2A2E] border-[#D5C7B8] hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#7F7972] italic pt-1">{product.fit}</p>
          </div>

          {/* Stock Alert */}
          {product.stock <= 8 && (
            <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-sm text-xs text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Low Atelier Inventory: Only <strong>{product.stock} units</strong> remaining in this edition.
              </span>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#D5C7B8] bg-white px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-sm font-medium text-[#7F7972] hover:text-black"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-[#121214]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2 py-1 text-sm font-medium text-[#7F7972] hover:text-black"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#FAF8F5] border border-[#121214] text-[#121214] hover:bg-[#121214] hover:text-white transition-all text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Wardrobe</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 border transition-all ${
                  isWished
                    ? 'border-[#B85D43] bg-rose-50 text-[#B85D43]'
                    : 'border-[#D5C7B8] text-[#121214] hover:border-black'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Direct Order Studio CTA */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 luxury-shimmer text-[#121214] hover:brightness-105 transition-all text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 shadow-lg group"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-[#E6DED5] grid grid-cols-3 gap-3 text-center text-[10px] text-[#7F7972]">
            <div className="p-2 bg-[#F3EFEA] rounded-sm">
              <Truck className="w-4 h-4 mx-auto mb-1 text-[#C5A059]" />
              <span>Complimentary Express Shipping over ₹2,499</span>
            </div>
            <div className="p-2 bg-[#F3EFEA] rounded-sm">
              <RefreshCw className="w-4 h-4 mx-auto mb-1 text-[#C5A059]" />
              <span>7-Day Doorstep Returns & Exchanges</span>
            </div>
            <div className="p-2 bg-[#F3EFEA] rounded-sm">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#C5A059]" />
              <span>Razorpay 256-Bit SSL Secure Checkout</span>
            </div>
          </div>

          {/* Accordion Tabs for Details, Care, Shipping */}
          <div className="border-t border-[#E6DED5] pt-4 divide-y divide-[#E6DED5]">
            {/* Design & Construction */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-[#121214]"
              >
                <span>Design & Construction Details</span>
                {openAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'details' && (
                <ul className="mt-3 space-y-1.5 text-xs text-[#5C5750] list-disc list-inside">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Garment Care */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-[#121214]"
              >
                <span>Care Instructions & Longevity</span>
                {openAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'care' && (
                <div className="mt-3 text-xs text-[#5C5750] leading-relaxed">
                  <p>{product.care}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns Terms */}
            <div className="py-3">
              <button
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-[#121214]"
              >
                <span>Pan-India Shipping & Returns</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="mt-3 text-xs text-[#5C5750] space-y-2">
                  <p>• Dispatched within 24 to 48 hours via BlueDart or Delhivery Express Courier.</p>
                  <p>• Metro delivery within 2-3 business days; rest of India within 4-5 business days.</p>
                  <p>• Unworn items with original security tags eligible for return within 7 calendar days.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="border-t border-[#E6DED5] pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-semibold">
              Verified Client Feedback
            </span>
            <h2 className="font-serif text-3xl text-[#121214]">Customer Reviews</h2>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] transition-colors self-start sm:self-auto"
          >
            {showReviewForm ? 'Cancel Review' : 'Write an Atelier Review'}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 sm:p-8 rounded-sm border border-[#E6DED5] space-y-4 max-w-2xl animate-fade-in shadow-sm"
          >
            <h3 className="font-serif text-xl text-[#121214]">Share your experience</h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">Your Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-neutral-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera S."
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Sublime fabric weight"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3 py-2 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">Detailed Review *</label>
              <textarea
                required
                rows={4}
                placeholder="Share your thoughts on the drape, sizing, and tactile quality..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5C7B8] p-3 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#C5A059] transition-colors"
            >
              Submit Review
            </button>
          </form>
        )}

        {reviewSubmitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm">
            Thank you. Your review has been submitted to the KRMU atelier archive.
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-white border border-[#E6DED5] rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#121214]">{rev.title}</span>
                  </div>
                  <span className="text-[11px] text-[#8C867E]">{rev.date}</span>
                </div>

                <p className="text-xs text-[#5C5750] leading-relaxed">{rev.comment}</p>

                <div className="flex items-center space-x-2 text-[11px] text-[#7F7972]">
                  <span className="font-medium text-[#121214]">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[10px]">
                      Verified Purchaser
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#7F7972] italic">Be the first to review this atelier edition.</p>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#E6DED5] pt-12 space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-semibold">
              Complete The Look
            </span>
            <h2 className="font-serif text-3xl text-[#121214]">You May Also Admire</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl p-6 sm:p-8 border border-[#E6DED5] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-[#7F7972] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                  Atelier Tailoring Standard
                </span>
                <h3 className="font-serif text-2xl text-[#121214]">Garment Measurement Chart</h3>
                <p className="text-xs text-[#7F7972]">
                  Measurements are taken with the garment laid flat. We suggest measuring a similar garment from your wardrobe.
                </p>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#121214]">Units:</span>
                <button
                  onClick={() => setSizeUnit('inches')}
                  className={`px-3 py-1 text-xs uppercase font-medium rounded-sm border ${
                    sizeUnit === 'inches' ? 'bg-[#121214] text-white border-black' : 'bg-white text-[#7F7972]'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setSizeUnit('cm')}
                  className={`px-3 py-1 text-xs uppercase font-medium rounded-sm border ${
                    sizeUnit === 'cm' ? 'bg-[#121214] text-white border-black' : 'bg-white text-[#7F7972]'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-[#E6DED5]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] text-[#121214] uppercase tracking-wider border-b border-[#E6DED5]">
                    <tr>
                      <th className="p-3 font-semibold">Size</th>
                      <th className="p-3 font-semibold">Chest / Bust</th>
                      <th className="p-3 font-semibold">Waist</th>
                      <th className="p-3 font-semibold">Hip</th>
                      <th className="p-3 font-semibold">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE5] text-[#5C5750]">
                    {[
                      { size: 'XS', bustIn: '34 - 36', waistIn: '26 - 28', hipIn: '36 - 38', lenIn: '28', bustCm: '86 - 91', waistCm: '66 - 71', hipCm: '91 - 96', lenCm: '71' },
                      { size: 'S', bustIn: '36 - 38', waistIn: '28 - 30', hipIn: '38 - 40', lenIn: '29', bustCm: '91 - 96', waistCm: '71 - 76', hipCm: '96 - 101', lenCm: '73' },
                      { size: 'M', bustIn: '38 - 40', waistIn: '30 - 32', hipIn: '40 - 42', lenIn: '30', bustCm: '96 - 101', waistCm: '76 - 81', hipCm: '101 - 106', lenCm: '76' },
                      { size: 'L', bustIn: '41 - 43', waistIn: '33 - 35', hipIn: '43 - 45', lenIn: '31', bustCm: '104 - 109', waistCm: '83 - 88', hipCm: '109 - 114', lenCm: '78' },
                      { size: 'XL', bustIn: '44 - 46', waistIn: '36 - 38', hipIn: '46 - 48', lenIn: '32', bustCm: '111 - 116', waistCm: '91 - 96', hipCm: '116 - 121', lenCm: '81' }
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-[#FAF8F5]">
                        <td className="p-3 font-bold text-[#121214]">{row.size}</td>
                        <td className="p-3">{sizeUnit === 'inches' ? row.bustIn : row.bustCm}</td>
                        <td className="p-3">{sizeUnit === 'inches' ? row.waistIn : row.waistCm}</td>
                        <td className="p-3">{sizeUnit === 'inches' ? row.hipIn : row.hipCm}</td>
                        <td className="p-3">{sizeUnit === 'inches' ? row.lenIn : row.lenCm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#FAF8F5] p-3 text-xs text-[#7F7972] border border-[#E6DED5]">
                <p>
                  <strong>Concierge Fitting Advice:</strong> Unsure of your sizing? Contact our tailors directly at <a href="mailto:concierge@krmu-apparel.com" className="underline text-black">concierge@krmu-apparel.com</a> or WhatsApp +91 98765 43210.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

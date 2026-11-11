import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
    promoCode,
    promoSuccess,
    promoError,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
      setInputCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-[#F3EFEA] rounded-full flex items-center justify-center mx-auto text-[#121214]">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#121214]">Your Wardrobe is Empty</h1>
          <p className="text-xs sm:text-sm text-[#7F7972] max-w-md mx-auto">
            Discover our latest tailoring, hand-finished linen shirts, and minimalist silhouettes.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-all text-xs uppercase tracking-[0.25em] font-semibold"
        >
          <span>Explore The Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6DED5] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E] mb-2">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-[#121214] font-semibold">Shopping Bag</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#121214]">
            Your Selected Garments ({items.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-widest text-[#B85D43] hover:underline font-semibold self-start sm:self-auto"
        >
          Empty Bag
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="p-4 bg-[#F3EFEA] border border-[#E6DED5] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-xs text-[#121214] font-medium">
              Add <strong className="text-[#B85D43]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-black">Complimentary Pan-India Express Delivery</strong>.
            </p>
          ) : (
            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Complimentary Express Delivery Unlocked!
            </p>
          )}
          <div className="w-64 h-1.5 bg-[#E6DED5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#121214] rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-[#7F7972] font-mono">{freeShippingProgress}% of ₹2,499</span>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-[#E6DED5] rounded-sm divide-y divide-[#E6DED5]">
            {items.map((item) => (
              <div key={item.key} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                <Link to={`/product/${item.slug}`} className="shrink-0 w-24 h-32 bg-neutral-100 overflow-hidden rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>

                <div className="flex-1 space-y-1">
                  <Link to={`/product/${item.slug}`} className="font-serif text-lg text-[#121214] hover:text-[#C5A059] transition-colors block">
                    {item.name}
                  </Link>

                  <div className="flex items-center space-x-3 text-xs text-[#7F7972]">
                    <span>Size: <strong className="text-[#121214]">{item.size}</strong></span>
                  </div>

                  <div className="text-xs text-[#8C867E]">
                    Unit Price: ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity adjuster */}
                <div className="flex items-center border border-[#D5C7B8] bg-white">
                  <button
                    onClick={() => updateQuantity(item.key, -1)}
                    className="p-1.5 hover:bg-[#F3EFEA] text-[#121214] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#121214]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.key, 1)}
                    className="p-1.5 hover:bg-[#F3EFEA] text-[#121214] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right sm:min-w-24">
                  <span className="font-serif text-lg font-normal text-[#121214]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="text-xs text-[#9E988F] line-through">
                      ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.key)}
                  className="p-2 text-[#9E988F] hover:text-red-600 transition-colors"
                  title="Remove piece"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#121214] hover:text-[#C5A059] font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E6DED5] rounded-sm p-6 space-y-5 shadow-sm">
            <h3 className="font-serif text-xl text-[#121214] border-b border-[#F0ECE5] pb-3">
              Order Summary
            </h3>

            {/* VIP Royal Privilege Box */}
            {subtotal >= 45000 && subtotal <= 50000 && promoCode !== 'KRMUROYAL' && (
              <div className="bg-[#121214] text-white p-3.5 rounded-sm border border-[#C5A059] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-serif text-[#C5A059] font-semibold text-[13px]">
                    <Sparkles className="w-3.5 h-3.5" /> VIP Royal Privilege
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-0.5">
                    Order between ₹45,000–₹50,000 pays only ₹41,000!
                  </p>
                </div>
                <button
                  onClick={() => applyPromoCode('KRMUROYAL')}
                  className="ml-2 px-3 py-1.5 bg-[#C5A059] text-black font-semibold text-[10px] uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Apply KRMUROYAL
                </button>
              </div>
            )}

            {/* Promo code */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                Privilege Code / Gift Voucher
              </label>
              {promoCode ? (
                <div className="flex items-center justify-between bg-[#F3EFEA] px-3 py-2 text-xs border border-[#D5C7B8]">
                  <span className="text-emerald-700 font-semibold">{promoCode} Applied</span>
                  <button
                    onClick={removePromoCode}
                    className="text-red-500 hover:text-red-700 text-[11px] uppercase font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. KRMU10"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 bg-[#FAF8F5] border border-[#D5C7B8] px-3 py-2 text-xs uppercase focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#121214] text-white text-xs uppercase tracking-wider hover:bg-[#C5A059] transition-colors font-medium"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
              {promoSuccess && <p className="text-[11px] text-emerald-600 mt-1">{promoSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#7F7972] border-t border-[#F0ECE5] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#121214] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Privilege Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Express Shipping</span>
                <span className="text-[#121214] font-medium">
                  {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#121214] pt-3 border-t border-[#F0ECE5]">
                <span>Total Amount</span>
                <span className="font-serif text-xl">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-neutral-400 text-center">
                All Indian duties and 12% GST are inclusive in the total.
              </p>
            </div>

            {/* Order Now CTA */}
            <button
              onClick={() => navigate('/order?mode=bag')}
              className="w-full py-4 luxury-shimmer text-[#121214] hover:brightness-105 transition-all text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Assurance */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-[#8C867E]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Razorpay Verified 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

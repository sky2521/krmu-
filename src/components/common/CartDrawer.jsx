import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
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
    removePromoCode,
    isEligibleForRoyalCoupon
  } = useCart();

  const [inputCode, setInputCode] = React.useState('');
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
      setInputCode('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E6DED5] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#121214]" />
              <h2 className="font-serif text-xl tracking-wider text-[#121214]">Your Wardrobe</h2>
              <span className="text-xs bg-[#121214] text-white px-2 py-0.5 rounded-full font-sans">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-[#7F7972] hover:text-[#121214] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F3EFEA] px-6 py-3 border-b border-[#E6DED5]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              {amountNeededForFreeShipping > 0 ? (
                <span className="text-[#3E3E42]">
                  Add <strong className="text-[#B85D43]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="text-[#121214] font-bold">Complimentary Delivery</span>
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> You've unlocked Complimentary Express Delivery!
                </span>
              )}
              <span className="text-[11px] text-[#7F7972]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E6DED5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#121214] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E6DED5]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#B89F88] stroke-1" />
                <div className="space-y-1">
                  <p className="font-serif text-xl text-[#121214]">Your bag is currently empty</p>
                  <p className="text-xs text-[#7F7972]">Explore our tailoring and timeless silhouettes.</p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.key} className="py-4 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-26 object-cover bg-neutral-100 rounded-sm"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-[#121214] tracking-wide line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-[#9E988F] hover:text-red-600 transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center space-x-2 text-[11px] text-[#7F7972]">
                        <span>Size: <strong className="text-black">{item.size}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#D5C7B8] bg-white">
                        <button
                          onClick={() => updateQuantity(item.key, -1)}
                          className="p-1 hover:bg-[#F3EFEA] transition-colors text-[#3E3E42]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#121214]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, 1)}
                          className="p-1 hover:bg-[#F3EFEA] transition-colors text-[#3E3E42]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#121214]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-[10px] text-[#9E988F] line-through">
                            ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Totals */}
          {items.length > 0 && (
            <div className="border-t border-[#E6DED5] bg-white p-6 space-y-4">
              {/* VIP Royal Coupon Banner */}
              {subtotal >= 45000 && subtotal <= 50000 && promoCode !== 'KRMUROYAL' && (
                <div className="bg-[#121214] text-white p-3 rounded-sm border border-[#C5A059] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-serif text-[#C5A059] font-semibold text-[13px]">
                      <Sparkles className="w-3.5 h-3.5" /> VIP Royal Privilege
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-0.5">
                      Order between ₹45k–₹50k pays only ₹41,000!
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

              {/* Promo input */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-[#F3EFEA] px-3 py-2 text-xs border border-[#D5C7B8]">
                    <span className="text-emerald-700 font-medium">Coupon '{promoCode}' active</span>
                    <button
                      onClick={removePromoCode}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. KRMU10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 bg-[#FAF8F5] border border-[#D5C7B8] px-3 py-2 text-xs uppercase focus:outline-none focus:border-black"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#121214] text-white text-xs uppercase tracking-wider hover:bg-[#C5A059] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <p className="text-[11px] text-red-600 mt-1">{promoError}</p>}
                {promoSuccess && <p className="text-[11px] text-emerald-600 mt-1">{promoSuccess}</p>}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs text-[#7F7972] border-t border-[#F0ECE5] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#121214] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-[#121214] font-medium">
                    {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#121214] pt-2 border-t border-[#F0ECE5]">
                  <span>Total Due</span>
                  <span className="font-serif text-base text-[#121214]">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-neutral-400 text-center pt-1">
                  Taxes and GST (12%) calculated and included.
                </p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-all duration-300 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C867E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Protected by Razorpay 256-Bit SSL Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

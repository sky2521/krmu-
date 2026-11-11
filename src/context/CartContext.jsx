import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { syncCartToSupabase, fetchCartFromSupabase } from '../services/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const PROMO_CODES = {
  KRMUROYAL: {
    type: 'royal',
    minSubtotal: 45000,
    maxSubtotal: 50000,
    discount: 9000,
    label: 'VIP Atelier Privilege (Pay only ₹41,000 on ₹50,000)'
  },
  ROYAL50: {
    type: 'royal',
    minSubtotal: 45000,
    maxSubtotal: 50000,
    discount: 9000,
    label: 'VIP Atelier Privilege (Pay only ₹41,000 on ₹50,000)'
  },
  KRMU10: { type: 'percent', value: 10, label: '10% Off Sitewide' },
  FIRSTORDER: { type: 'percent', value: 15, label: '15% Off Your First Order' },
  LUXURY500: { type: 'flat', value: 500, label: '₹500 Atelier Credit' }
};

export function calculatePromoDiscount(code, subtotalAmount) {
  const clean = (code || '').trim().toUpperCase();
  const promo = PROMO_CODES[clean];
  if (!promo || subtotalAmount <= 0) return 0;

  if (promo.type === 'royal') {
    return subtotalAmount >= promo.minSubtotal ? promo.discount : 0;
  }
  if (promo.type === 'percent') {
    return Math.round((subtotalAmount * promo.value) / 100);
  }
  if (promo.type === 'flat') {
    return Math.min(subtotalAmount, promo.value);
  }
  return 0;
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('krmu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(() => {
    try {
      return localStorage.getItem('krmu_promo') || '';
    } catch (e) {
      return '';
    }
  });
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const hydratedUserIdRef = useRef(null);

  // Pull cloud cart from Supabase when logged in (merge guest items without wiping cloud cart)
  useEffect(() => {
    let active = true;
    const uid = user?.id && user.id.includes('-') ? user.id : null;

    if (!uid) {
      hydratedUserIdRef.current = null;
      return () => {
        active = false;
      };
    }

    fetchCartFromSupabase(uid).then((cloudItems) => {
      if (!active) return;

      setItems((prevLocal) => {
        const mergedMap = new Map();
        (cloudItems || []).forEach((it) => mergedMap.set(it.key, it));
        (prevLocal || []).forEach((it) => {
          const existing = mergedMap.get(it.key);
          if (existing) {
            mergedMap.set(it.key, {
              ...existing,
              quantity: Math.max(existing.quantity, it.quantity),
            });
          } else {
            mergedMap.set(it.key, it);
          }
        });
        const merged = Array.from(mergedMap.values());
        hydratedUserIdRef.current = uid;
        if (merged.length > 0 && (prevLocal || []).length > 0) {
          syncCartToSupabase(uid, merged);
        }
        return merged;
      });
    });

    return () => {
      active = false;
    };
  }, [user?.id]);

  // Persist locally & sync to Supabase (only after cloud hydration for the signed-in user)
  useEffect(() => {
    try {
      localStorage.setItem('krmu_cart', JSON.stringify(items));
      if (user?.id && user.id.includes('-') && hydratedUserIdRef.current === user.id) {
        syncCartToSupabase(user.id, items);
      }
    } catch (e) {
      console.error(e);
    }
  }, [items, user?.id]);

  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem('krmu_promo', promoCode);
      } else {
        localStorage.removeItem('krmu_promo');
      }
    } catch (e) {
      console.error(e);
    }
  }, [promoCode]);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Check if subtotal is eligible for royal 45k-50k coupon
  const isEligibleForRoyalCoupon = subtotal >= 45000;

  // Add to cart without color changing
  const addToCart = (product, size = 'M', quantity = 1) => {
    const selectedSize = size || (product.sizes && product.sizes[0]) || 'M';
    setItems((prevItems) => {
      const itemKey = `${product.id}-${selectedSize}`;
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey || (item.productId === product.id && item.size === selectedSize));

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            key: itemKey,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images[0],
            size: selectedSize,
            quantity
          }
        ];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key && `${item.productId}-${item.size}` !== key));
  };

  const updateQuantity = (key, delta) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.key === key || `${item.productId}-${item.size}` === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      setPromoError('Please enter a coupon code.');
      return false;
    }

    if (clean === 'KRMUROYAL' || clean === 'ROYAL50') {
      if (subtotal < 45000) {
        setPromoError(`Code ${clean} is valid for orders between ₹45,000 and ₹50,000. Add ₹${(45000 - subtotal).toLocaleString('en-IN')} more to your bag!`);
        return false;
      }
      setPromoCode(clean);
      setPromoError('');
      setPromoSuccess(`Applied: Save ₹9,000 (Pay ₹41,000 on ₹50,000 order)`);
      return true;
    }

    if (PROMO_CODES[clean]) {
      setPromoCode(clean);
      setPromoError('');
      setPromoSuccess(`Applied: ${PROMO_CODES[clean].label}`);
      return true;
    } else {
      setPromoError('Invalid coupon code. Try KRMU10, FIRSTORDER, or KRMUROYAL');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoSuccess('');
    setPromoError('');
  };

  const discountAmount = calculatePromoDiscount(promoCode, subtotal);

  const FREE_SHIPPING_THRESHOLD = 2499;
  const isComplimentaryTrialOrder = items.length > 0 && items.every((item) => Number(item.price) <= 10);
  const shippingFee = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD || isComplimentaryTrialOrder ? 0 : 199;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemCount,
        discountAmount,
        shippingFee,
        total,
        FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        amountNeededForFreeShipping,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        promoCode,
        promoDiscountInfo: promoCode ? PROMO_CODES[promoCode] : null,
        promoError,
        promoSuccess,
        applyPromoCode,
        removePromoCode,
        isEligibleForRoyalCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Pull cloud cart from Supabase when logged in
  useEffect(() => {
    if (user?.id && user.id.includes('-')) {
      fetchCartFromSupabase(user.id).then((cloudItems) => {
        if (cloudItems && cloudItems.length > 0) {
          setItems(cloudItems);
        }
      });
    }
  }, [user?.id]);

  // Persist locally & sync to Supabase
  useEffect(() => {
    try {
      localStorage.setItem('krmu_cart', JSON.stringify(items));
      if (user?.id && user.id.includes('-')) {
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

  let discountAmount = 0;
  if (promoCode && PROMO_CODES[promoCode]) {
    const p = PROMO_CODES[promoCode];
    if (p.type === 'royal') {
      if (subtotal >= 45000 && subtotal <= 50000) {
        // Between 45,000 and 50,000: if 50,000, pays 41,000 (9,000 discount)
        discountAmount = 9000;
      } else if (subtotal > 50000) {
        discountAmount = 9000;
      } else {
        discountAmount = 0;
      }
    } else if (p.type === 'percent') {
      discountAmount = Math.round((subtotal * p.value) / 100);
    } else if (p.type === 'flat') {
      discountAmount = Math.min(subtotal, p.value);
    }
  }

  const FREE_SHIPPING_THRESHOLD = 2499;
  const shippingFee = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 199;
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

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Crown,
  Check,
  ArrowRight,
  Truck,
  Package,
  Gift,
  Ruler,
  Star,
  Plus,
  Minus,
  Tag,
  CreditCard,
  Banknote,
  MapPin,
  User,
  Zap,
  Award,
  X,
  AlertCircle,
  Heart,
  ZoomIn
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProducts } from '../context/ProductContext';
import { useCart, PROMO_CODES, calculatePromoDiscount } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { initiateRazorpayCheckout, fetchPaymentGatewayStatus } from '../services/razorpay';
import RazorpayGatewayModal from '../components/common/RazorpayGatewayModal';
import PaymentProcessingCurtain from '../components/common/PaymentProcessingCurtain';

const INDIAN_STATES = [
  'Delhi',
  'Maharashtra',
  'Karnataka',
  'Telangana',
  'Tamil Nadu',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Haryana',
  'Punjab',
  'Kerala',
  'Other'
];

const SIZE_MEASUREMENTS = [
  { size: 'XS', chest: '36"', shoulder: '16.5"', length: '27.5"' },
  { size: 'S', chest: '38"', shoulder: '17.2"', length: '28.0"' },
  { size: 'M', chest: '40"', shoulder: '18.0"', length: '28.5"' },
  { size: 'L', chest: '42"', shoulder: '18.8"', length: '29.2"' },
  { size: 'XL', chest: '44"', shoulder: '19.5"', length: '30.0"' },
  { size: 'XXL', chest: '46"', shoulder: '20.2"', length: '30.5"' }
];

function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#141416] border border-[#C5A059]/30 text-white max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl animate-slide-up">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close Size Guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1.5 pb-4 border-b border-white/10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
            KRMU Bespoke Sizing
          </span>
          <h3 className="font-serif text-2xl font-light">Atelier Fit Measurements</h3>
          <p className="text-xs text-neutral-400">
            Tailored architectural silhouettes in inches. Free alterations within 7 days.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-[#C5A059]">
                <th className="py-2.5">Size</th>
                <th className="py-2.5">Chest</th>
                <th className="py-2.5">Shoulder</th>
                <th className="py-2.5">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {SIZE_MEASUREMENTS.map((row) => (
                <tr key={row.size} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 font-semibold text-white">{row.size}</td>
                  <td className="py-2.5 text-neutral-300">{row.chest}</td>
                  <td className="py-2.5 text-neutral-300">{row.shoulder}</td>
                  <td className="py-2.5 text-neutral-300">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getExpectedDeliveryWindow(shippingMethod) {
  const now = new Date();
  const minDays = shippingMethod === 'whiteglove' ? 1 : 3;
  const maxDays = shippingMethod === 'whiteglove' ? 2 : 5;
  const start = new Date(now.getTime() + minDays * 86400000);
  const end = new Date(now.getTime() + maxDays * 86400000);
  const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function OrderPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { products } = useProducts();
  const { items: cartItems, clearCart } = useCart();
  const { user, isAuthenticated, openLogin, addAddress } = useAuth();
  const { createOrder, recordPaymentAttempt } = useOrders();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const requestedMode = searchParams.get('mode');
  const [orderMode, setOrderMode] = useState(
    requestedMode === 'bag' && cartItems.length > 0 ? 'bag' : 'single'
  );

  // Curated catalog order for quick lookbook switching
  const [lookbookFilter, setLookbookFilter] = useState('all');
  const filteredLookbook = useMemo(() => {
    if (lookbookFilter === 'all') return products;
    return products.filter((p) => p.category === lookbookFilter);
  }, [products, lookbookFilter]);

  const initialProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    if (slug) {
      return products.find((p) => p.slug === slug) || products[0];
    }
    return products.find((p) => p.badge === 'Limited Edition') || products[0];
  }, [products, slug]);

  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50, active: false });
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Gift & Concierge customization
  const [giftWrap, setGiftWrap] = useState(true);
  const [giftNote, setGiftNote] = useState('');

  // Shipping & Payment state
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [preferredRzpMethod, setPreferredRzpMethod] = useState('all'); // all, upi, card, netbanking
  const [saveAddressToVault, setSaveAddressToVault] = useState(true);
  const [gatewayStatus, setGatewayStatus] = useState({ configured: true, mode: 'test', backend: 'Node.js Razorpay REST API' });
  const [activePromo, setActivePromo] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState({ type: '', text: '' });

  // Customer form synced with Supabase Auth profile & saved addresses
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'Delhi',
    pincode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [razorpaySandboxOpen, setRazorpaySandboxOpen] = useState(false);
  const [paymentCurtain, setPaymentCurtain] = useState({
    isOpen: false,
    stage: 'creating_order',
    error: '',
    meta: {}
  });

  useEffect(() => {
    fetchPaymentGatewayStatus().then((status) => {
      if (status) setGatewayStatus(status);
    });
  }, []);

  // Sync product when URL slug changes or catalog loads
  useEffect(() => {
    if (!initialProduct) return;
    setSelectedProduct(initialProduct);
    setActiveImageIdx(0);
    const paramSize = searchParams.get('size');
    const paramQty = parseInt(searchParams.get('qty') || '1', 10);
    setSelectedSize(
      paramSize && initialProduct.sizes.includes(paramSize) ? paramSize : initialProduct.sizes[0] || 'M'
    );
    setQuantity(Number.isFinite(paramQty) && paramQty > 0 ? Math.min(paramQty, initialProduct.stock || 5) : 1);
  }, [initialProduct, searchParams]);

  // Switch to bag mode automatically if ?mode=bag and bag has items
  useEffect(() => {
    if (requestedMode === 'bag' && cartItems.length > 0) {
      setOrderMode('bag');
    }
  }, [requestedMode, cartItems.length]);

  // Auto-fill signed-in Supabase user info & default address
  useEffect(() => {
    if (!user) return;
    const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
    const parts = (user.name || '').trim().split(/\s+/);
    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || parts[0] || '',
      lastName: prev.lastName || parts.slice(1).join(' ') || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || defaultAddr?.phone || '',
      street: prev.street || defaultAddr?.street || '',
      city: prev.city || defaultAddr?.city || '',
      state: defaultAddr?.state || prev.state || 'Delhi',
      pincode: prev.pincode || defaultAddr?.pincode || ''
    }));
  }, [user]);

  // Order items derived from mode
  const activeOrderItems = useMemo(() => {
    if (orderMode === 'bag' && cartItems.length > 0) {
      return cartItems.map((i) => ({
        productId: i.productId,
        name: i.name,
        slug: i.slug,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        image: i.image
      }));
    }
    if (!selectedProduct) return [];
    return [
      {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        slug: selectedProduct.slug,
        price: selectedProduct.price,
        quantity,
        size: selectedSize || selectedProduct.sizes?.[0] || 'M',
        image: selectedProduct.images?.[0] || ''
      }
    ];
  }, [orderMode, cartItems, selectedProduct, quantity, selectedSize]);

  // Real-time financial calculations using shared CartContext logic
  const subtotal = useMemo(
    () => activeOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [activeOrderItems]
  );

  const discountAmount = useMemo(
    () => calculatePromoDiscount(activePromo, subtotal),
    [activePromo, subtotal]
  );

  const isComplimentaryTrialOrder = useMemo(
    () => activeOrderItems.length > 0 && activeOrderItems.every((item) => Number(item.price) <= 10),
    [activeOrderItems]
  );

  const standardShippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    if (subtotal >= 2499 || isComplimentaryTrialOrder) return 0;
    return 199;
  }, [subtotal, isComplimentaryTrialOrder]);

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    if (shippingMethod === 'whiteglove') {
      return subtotal >= 45000 ? 0 : 499;
    }
    return standardShippingCost;
  }, [subtotal, shippingMethod, standardShippingCost]);

  const finalOrderTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const royalProgress = Math.min(100, Math.round((subtotal / 45000) * 100));
  const royalGap = Math.max(0, 45000 - subtotal);

  // Pipeline telemetry progress (steps 1..4)
  const contactComplete = Boolean(formData.firstName && formData.email && formData.phone);
  const addressComplete = Boolean(formData.street && formData.city && formData.pincode);
  const activePipelineStep = addressComplete ? 4 : contactComplete ? 3 : 2;

  const handleSelectLookbookPiece = (product) => {
    setOrderMode('single');
    setSelectedProduct(product);
    setActiveImageIdx(0);
    setSelectedSize(product.sizes?.[0] || 'M');
    setQuantity(1);
    setErrorMessage('');
  };

  const handleApplyPromo = (codeToApply) => {
    const clean = (codeToApply || promoInput).trim().toUpperCase();
    if (!clean) {
      setPromoFeedback({ type: 'error', text: 'Enter a privilege code to validate.' });
      return;
    }
    if (!PROMO_CODES[clean]) {
      setPromoFeedback({ type: 'error', text: 'Code not recognized. Try KRMUROYAL or KRMU10.' });
      return;
    }
    if ((clean === 'KRMUROYAL' || clean === 'ROYAL50') && subtotal < 45000) {
      setPromoFeedback({
        type: 'error',
        text: `Add ₹${royalGap.toLocaleString('en-IN')} more to unlock ₹9,000 VIP Privilege.`
      });
      return;
    }
    setActivePromo(clean);
    setPromoInput('');
    setPromoFeedback({ type: 'success', text: `${clean} unlocked: ${PROMO_CODES[clean].label}` });
  };

  const handleUseSavedAddress = (addr) => {
    const parts = (addr.name || user?.name || '').trim().split(/\s+/);
    setFormData((prev) => ({
      ...prev,
      firstName: parts[0] || prev.firstName,
      lastName: parts.slice(1).join(' ') || prev.lastName,
      phone: addr.phone || prev.phone,
      street: addr.street || prev.street,
      city: addr.city || prev.city,
      state: addr.state || prev.state || 'Delhi',
      pincode: addr.pincode || prev.pincode
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y, active: true });
  };

  const finalizeOrderToDatabase = async (paymentDetails) => {
    const deliveryLabel =
      shippingMethod === 'whiteglove'
        ? 'Atelier White Glove Courier'
        : 'Standard Express Courier';

    const orderData = {
      customer: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      },
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pincode: formData.pincode.trim(),
        phone: formData.phone.trim()
      },
      items: activeOrderItems.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        image: i.image
      })),
      pricing: {
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        total: finalOrderTotal,
        promoCodeApplied: activePromo
      },
      paymentMethod: paymentDetails.method || 'Razorpay Standard Checkout',
      paymentId: paymentDetails.paymentId || `pay_${Date.now()}`,
      razorpayOrderId: paymentDetails.orderId || null,
      razorpaySignature: paymentDetails.signature || null,
      signatureVerified: Boolean(paymentDetails.signatureVerified),
      verificationSource: paymentDetails.verificationSource || (paymentMethod === 'cod' ? 'cod_pending' : 'client'),
      paymentChannel: paymentMethod === 'cod' ? 'cod' : 'razorpay',
      rawMethod: paymentDetails.rawMethod || preferredRzpMethod || 'razorpay',
      paymentMethodDetail: paymentDetails.methodDetail || {},
      feePaise: paymentDetails.feePaise || 0,
      taxPaise: paymentDetails.taxPaise || 0,
      giftWrap: Boolean(giftWrap),
      giftNote: giftWrap ? giftNote.trim() : '',
      paymentStatus:
        paymentDetails.status === 'Authorized' || paymentDetails.status === 'captured'
          ? 'Paid'
          : 'Pending',
      deliveryMethod: giftWrap ? `${deliveryLabel} (Wax-Sealed Gift Box)` : deliveryLabel
    };

    if (isAuthenticated && saveAddressToVault && formData.street.trim() && formData.pincode.trim()) {
      const alreadySaved = user?.addresses?.some(
        (a) =>
          a.street?.trim().toLowerCase() === formData.street.trim().toLowerCase() &&
          a.pincode?.trim() === formData.pincode.trim()
      );
      if (!alreadySaved) {
        addAddress({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state,
          pincode: formData.pincode.trim(),
          isDefault: !user?.addresses?.length
        }).catch(() => {});
      }
    }

    const newOrder = await createOrder(orderData);
    setPaymentCurtain((prev) => ({ ...prev, stage: 'completed', isOpen: false }));
    if (orderMode === 'bag') {
      clearCart();
    }

    try {
      confetti({
        particleCount: 110,
        spread: 75,
        colors: ['#C5A059', '#FAF8F5', '#121214', '#E6CFA0'],
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore confetti error
    }

    navigate(`/order-success/${newOrder.id}`);
  };

  const launchRazorpayFlow = async () => {
    setErrorMessage('');
    setIsSubmitting(true);
    setPaymentCurtain({
      isOpen: true,
      stage: 'creating_order',
      error: '',
      meta: {}
    });

    try {
      const receiptId = `KRMU-${Date.now()}`;
      await initiateRazorpayCheckout({
        amount: finalOrderTotal,
        receipt: receiptId,
        preferredMethod: preferredRzpMethod,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        },
        notes: {
          shipping_city: formData.city,
          shipping_pincode: formData.pincode,
          gift_wrap: giftWrap ? 'Yes' : 'No',
          gift_note: giftNote.slice(0, 120)
        },
        onStageChange: (stage, detail = {}) => {
          setPaymentCurtain((prev) => ({
            ...prev,
            isOpen: true,
            stage,
            meta: { ...prev.meta, ...detail }
          }));
        },
        onSdkUnavailable: (reason) => {
          setIsSubmitting(false);
          setPaymentCurtain({
            isOpen: true,
            stage: 'sdk_unavailable',
            error: reason,
            meta: {}
          });
        },
        onSuccess: async (paymentResp) => {
          try {
            await finalizeOrderToDatabase(paymentResp);
          } finally {
            setIsSubmitting(false);
          }
        },
        onFailure: async (err, failureMeta = {}) => {
          setIsSubmitting(false);
          const msg = err.message || 'Payment authorization was not completed. Please try again.';
          setErrorMessage(msg);
          setPaymentCurtain((prev) => ({
            ...prev,
            isOpen: true,
            stage: 'failed',
            error: msg,
            meta: { ...prev.meta, ...failureMeta }
          }));

          // Record failed / cancelled payment attempt into Supabase payment_transactions ledger
          await recordPaymentAttempt({
            orderId: null,
            customerName: `${formData.firstName} ${formData.lastName}`.trim(),
            customerEmail: formData.email.trim(),
            customerPhone: formData.phone.trim(),
            razorpayOrderId: failureMeta.razorpayOrderId || null,
            razorpayPaymentId: failureMeta.razorpayPaymentId || null,
            signatureVerified: false,
            verificationSource: 'client_event',
            gateway: 'razorpay',
            method: preferredRzpMethod === 'all' ? 'razorpay' : preferredRzpMethod,
            amountInr: finalOrderTotal,
            amountPaise: Math.round(finalOrderTotal * 100),
            status: failureMeta.cancelled ? 'cancelled' : 'failed',
            errorCode: failureMeta.errorCode || (failureMeta.cancelled ? 'CLIENT_CANCELLED' : 'PAYMENT_FAILED'),
            errorDescription: msg
          });
        }
      });
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Unexpected error launching Razorpay Gateway.');
      setPaymentCurtain({
        isOpen: true,
        stage: 'failed',
        error: err.message || 'Unexpected error launching Razorpay Gateway.',
        meta: {}
      });
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeOrderItems.length === 0) {
      setErrorMessage('Please choose at least one atelier creation to order.');
      return;
    }

    if (
      !formData.firstName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setErrorMessage('Please complete your contact and delivery destination details.');
      document.getElementById('delivery-vault-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (paymentMethod === 'cod') {
      setIsSubmitting(true);
      setTimeout(async () => {
        try {
          await finalizeOrderToDatabase({
            method: 'Cash on Delivery',
            rawMethod: 'cod',
            paymentId: `cod_${Date.now()}`,
            signatureVerified: false,
            verificationSource: 'cod_pending',
            status: 'Pending Cash on Delivery'
          });
        } catch (err) {
          setErrorMessage(err.message || 'Could not place Cash on Delivery order.');
        } finally {
          setIsSubmitting(false);
        }
      }, 650);
      return;
    }

    await launchRazorpayFlow();
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-[#0D0D0E] flex items-center justify-center">
        <div className="text-center space-y-3 animate-pulse">
          <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto" />
          <p className="text-xs uppercase tracking-[0.35em] text-[#C5A059]">
            Preparing KRMU Bespoke Order Studio...
          </p>
        </div>
      </div>
    );
  }

  const primaryImages = selectedProduct.images?.length
    ? selectedProduct.images
    : ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'];
  const currentHeroImage = primaryImages[activeImageIdx] || primaryImages[0];
  const wished = isInWishlist(selectedProduct.id);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* 1. CINEMATIC OBSIDIAN FLAGSHIP HEADER */}
      <section className="relative overflow-hidden bg-[#0D0D0E] text-white border-b border-[#C5A059]/25">
        {/* Ambient Animated Champagne Glow Orbs */}
        <div className="pointer-events-none absolute -top-28 -left-24 w-96 h-96 rounded-full bg-[#C5A059]/15 blur-3xl animate-float-slow" />
        <div
          className="pointer-events-none absolute -bottom-32 right-0 w-[28rem] h-[28rem] rounded-full bg-[#C5A059]/10 blur-3xl animate-float-slow"
          style={{ animationDelay: '2.5s' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 animate-reveal-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#C5A059]/40 text-[10px] uppercase tracking-[0.3em] text-[#E6CFA0]">
                <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>KRMU Private Atelier • Direct Acquisition Studio</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none">
                Reserve Your <span className="luxury-text-gold italic">Signature Piece</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#BDB7AE] max-w-2xl font-light leading-relaxed">
                Hand-finished in numbered small batches with 100% traceable natural textiles. Configure your fit, bespoke wax-sealed packaging, and private insured courier in sixty seconds.
              </p>
            </div>

            {/* Right Trust & Auth Capsule */}
            <div className="flex flex-wrap items-center gap-3">
              {cartItems.length > 0 && (
                <div className="inline-flex p-1 bg-white/5 border border-white/15 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setOrderMode('single')}
                    className={`px-3.5 py-1.5 text-[10px] uppercase tracking-widest rounded-sm transition-all ${
                      orderMode === 'single'
                        ? 'bg-[#C5A059] text-[#121214] font-bold'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    Single Piece
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderMode('bag')}
                    className={`px-3.5 py-1.5 text-[10px] uppercase tracking-widest rounded-sm transition-all ${
                      orderMode === 'bag'
                        ? 'bg-[#C5A059] text-[#121214] font-bold'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    Wardrobe Bag ({cartItems.length})
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-white/5 border border-white/10 text-[11px] text-[#E6CFA0]">
                <span className={`w-2 h-2 rounded-full ${gatewayStatus.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>
                  Razorpay {gatewayStatus.mode === 'live' ? 'Live' : 'Test'} Vault • Supabase Synced
                </span>
              </div>
            </div>
          </div>

          {/* 4-Step Animated Luxury Pipeline Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            {[
              { step: 1, title: 'Curate Creation', sub: selectedProduct.name },
              { step: 2, title: 'Tailoring & Care', sub: `Size ${selectedSize || 'M'} • Qty ${quantity}` },
              { step: 3, title: 'Private Dispatch', sub: shippingMethod === 'whiteglove' ? 'White Glove 24–48h' : 'Express Courier' },
              { step: 4, title: 'Vault Settlement', sub: `₹${finalOrderTotal.toLocaleString('en-IN')} Total` }
            ].map((node) => {
              const completed = node.step < activePipelineStep;
              const current = node.step === activePipelineStep;
              return (
                <div
                  key={node.step}
                  className={`px-3.5 py-2.5 rounded-sm border transition-all duration-300 ${
                    current
                      ? 'bg-[#C5A059]/15 border-[#C5A059] shadow-lg'
                      : completed
                      ? 'bg-emerald-950/35 border-emerald-500/40'
                      : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                    <span className={current ? 'text-[#C5A059] font-bold' : 'text-neutral-400'}>
                      0{node.step}. {node.title}
                    </span>
                    {completed ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : current ? (
                      <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                    ) : null}
                  </div>
                  <p className="text-xs text-white/90 truncate mt-0.5 font-medium">{node.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. LOOKBOOK QUICK-SWITCH RAIL (in Single Piece mode) */}
      {orderMode === 'single' && (
        <section className="bg-[#F3EFEA] border-b border-[#E6DED5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#121214]">
                  Select Any KRMU Creation to Order Instantly
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Pieces' },
                  { id: 'women', label: 'Women' },
                  { id: 'men', label: 'Men' },
                  { id: 'new-arrivals', label: 'New Arrivals' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLookbookFilter(tab.id)}
                    className={`px-3 py-1 text-[10px] uppercase tracking-widest rounded-sm transition-colors whitespace-nowrap ${
                      lookbookFilter === tab.id
                        ? 'bg-[#121214] text-white'
                        : 'bg-white text-[#5C5750] hover:text-black border border-[#E6DED5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {filteredLookbook.map((item) => {
                const active = item.id === selectedProduct.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectLookbookPiece(item)}
                    className={`group shrink-0 flex items-center gap-3 p-2 pr-4 rounded-sm border text-left transition-all duration-300 ${
                      active
                        ? 'bg-[#121214] border-[#C5A059] text-white shadow-md scale-[1.01]'
                        : 'bg-white border-[#E6DED5] text-[#121214] hover:border-[#C5A059]'
                    }`}
                  >
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-sm shrink-0"
                    />
                    <div className="min-w-[130px] max-w-[165px]">
                      <p className={`text-[9px] uppercase tracking-wider ${active ? 'text-[#C5A059]' : 'text-[#8C867E]'}`}>
                        {item.subcategory || item.category}
                      </p>
                      <p className="font-serif text-xs truncate font-medium">{item.name}</p>
                      <p className={`text-[11px] font-semibold mt-0.5 ${active ? 'text-white' : 'text-[#121214]'}`}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. MAIN LUXURY ACQUISITION STUDIO GRID */}
      <form
        onSubmit={handleOrderSubmit}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
      >
        {/* LEFT COLUMN (7 Cols): Visual Showcase + Bespoke Configurator + Dispatch Details */}
        <div className="lg:col-span-7 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* A. GARMENT CONFIGURATION CARD */}
          {orderMode === 'single' ? (
            <div className="bg-white border border-[#E6DED5] rounded-sm p-5 sm:p-7 shadow-sm atelier-card-hover space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Interactive Optical Zoom Portrait Frame */}
                <div className="md:col-span-5 space-y-3">
                  <div
                    onMouseMove={handleImageMouseMove}
                    onMouseLeave={() => setZoomOrigin((z) => ({ ...z, active: false }))}
                    className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#F3EFEA] border border-[#E6DED5] cursor-zoom-in group"
                  >
                    <img
                      src={currentHeroImage}
                      alt={selectedProduct.name}
                      style={{
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        transform: zoomOrigin.active ? 'scale(1.65)' : 'scale(1)'
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out"
                    />

                    {/* Subtle Dark Foil Overlay Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                      {selectedProduct.badge && (
                        <span className="px-2.5 py-1 bg-[#121214]/90 backdrop-blur-sm text-[#E6CFA0] text-[9px] uppercase tracking-[0.25em] font-semibold rounded-sm">
                          {selectedProduct.badge}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(selectedProduct)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${wished ? 'fill-[#B85D43] text-[#B85D43]' : 'text-[#121214]'}`} />
                    </button>

                    <div className="pointer-events-none absolute bottom-2.5 right-2.5 px-2 py-1 rounded-sm bg-black/65 text-white text-[9px] uppercase tracking-wider flex items-center gap-1 opacity-80 group-hover:opacity-0 transition-opacity">
                      <ZoomIn className="w-3 h-3 text-[#C5A059]" /> Hover to Inspect Weave
                    </div>
                  </div>

                  {/* Multi-Angle Thumbnails */}
                  {primaryImages.length > 1 && (
                    <div className="flex gap-2">
                      {primaryImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-14 h-16 rounded-sm overflow-hidden border transition-all ${
                            activeImageIdx === idx
                              ? 'border-[#C5A059] ring-1 ring-[#C5A059]'
                              : 'border-[#E6DED5] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Spec & Fit Configurator */}
                <div className="md:col-span-7 space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#8C867E]">
                      <span>KRMU Atelier • {selectedProduct.category}</span>
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="w-3 h-3 fill-current" /> {selectedProduct.rating} ({selectedProduct.reviewCount})
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#121214] leading-tight">
                      {selectedProduct.name}
                    </h2>

                    <div className="flex items-baseline gap-3 pt-1">
                      <span className="text-2xl font-serif font-semibold text-[#121214]">
                        ₹{selectedProduct.price.toLocaleString('en-IN')}
                      </span>
                      {selectedProduct.originalPrice && (
                        <>
                          <span className="text-sm text-[#9E988F] line-through">
                            ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider rounded-sm">
                            Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#5C5750] leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Size Selector */}
                  <div className="space-y-2.5 pt-2 border-t border-[#F0ECE5]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="uppercase tracking-wider font-semibold text-[#121214]">
                        Tailored Size: <strong className="text-[#C5A059]">{selectedSize}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-[11px] text-[#7F7972] hover:text-[#121214] flex items-center gap-1 underline"
                      >
                        <Ruler className="w-3.5 h-3.5 text-[#C5A059]" /> Size & Fit Guide
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(selectedProduct.sizes || ['S', 'M', 'L', 'XL']).map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[46px] px-3 py-2 text-xs uppercase tracking-wider font-semibold border rounded-sm transition-all duration-200 ${
                              isSelected
                                ? 'bg-[#121214] text-white border-[#121214] shadow-md scale-[1.03]'
                                : 'bg-[#FAF8F5] text-[#2A2A2E] border-[#D5C7B8] hover:border-[#121214]'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity & Scarcity Telemetry */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#F0ECE5]">
                    <div className="space-y-1">
                      <span className="block text-[10px] uppercase tracking-wider text-[#7F7972] font-semibold">
                        Acquisition Quantity
                      </span>
                      <div className="inline-flex items-center border border-[#D5C7B8] rounded-sm bg-white">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="p-2.5 hover:bg-[#F3EFEA] text-[#121214] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-xs font-bold text-[#121214]">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(selectedProduct.stock || 8, q + 1))}
                          className="p-2.5 hover:bg-[#F3EFEA] text-[#121214] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        In Atelier Vault ({selectedProduct.stock || 5} left)
                      </span>
                      <p className="text-[10px] text-[#8C867E]">Dispatches pressed on cedar hanger</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Bag Collection Review Card */
            <div className="bg-white border border-[#E6DED5] rounded-sm p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0ECE5] pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                    Wardrobe Collection
                  </span>
                  <h2 className="font-serif text-2xl text-[#121214]">
                    Acquiring {cartItems.length} Curated {cartItems.length === 1 ? 'Piece' : 'Pieces'}
                  </h2>
                </div>
                <Link to="/cart" className="text-xs underline text-[#7F7972] hover:text-black">
                  Edit Wardrobe Bag
                </Link>
              </div>
              <div className="divide-y divide-[#F0ECE5]">
                {activeOrderItems.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-cover rounded-sm border border-[#E6DED5]" />
                      <div>
                        <p className="font-serif text-base text-[#121214]">{item.name}</p>
                        <p className="text-xs text-[#7F7972]">Size {item.size} • Qty {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#121214]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B. BESPOKE WAX-SEALED GIFT PRESENTATION & FINISHING */}
          <div className="bg-[#121214] text-white border border-[#C5A059]/30 rounded-sm p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-sm bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#C5A059]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Signature Wax-Sealed Presentation</h3>
                  <p className="text-[11px] text-[#BDB7AE]">
                    Rigid linen atelier box, cedarwood hanger & cotton garment cover
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGiftWrap((v) => !v)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-sm border transition-all ${
                  giftWrap
                    ? 'bg-[#C5A059] text-[#121214] border-[#C5A059]'
                    : 'bg-transparent text-neutral-300 border-white/25 hover:border-white'
                }`}
              >
                {giftWrap ? '✓ Complimentary Active' : 'Add Gift Box (Free)'}
              </button>
            </div>

            {giftWrap && (
              <div className="pt-3 border-t border-white/10 space-y-2 animate-fade-in">
                <label className="block text-[10px] uppercase tracking-[0.25em] text-[#E6CFA0]">
                  Optional Handwritten Calligraphy Note (Embossed Ivory Card)
                </label>
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  maxLength={180}
                  placeholder="Write a personal dedication to be hand-calligraphed by our studio..."
                  className="w-full bg-white/5 border border-white/15 rounded-sm px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            )}
          </div>

          {/* C. CONCIERGE DELIVERY VAULT */}
          <div id="delivery-vault-section" className="bg-white border border-[#E6DED5] rounded-sm p-5 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE5] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                  Destination & Client Info
                </span>
                <h3 className="font-serif text-2xl text-[#121214]">Private Courier Dispatch</h3>
              </div>

              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={openLogin}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#C5A059] hover:text-[#121214] transition-colors"
                >
                  <User className="w-3.5 h-3.5" /> Sign in for Saved Addresses
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm font-medium">
                  <Check className="w-3.5 h-3.5" /> Signed in as {user?.name}
                </span>
              )}
            </div>

            {/* Supabase Saved Address Quick-Fill Chips */}
            {isAuthenticated && user?.addresses?.length > 0 && (
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm space-y-2">
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#5C5750] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> One-Tap Saved Supabase Addresses
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleUseSavedAddress(addr)}
                      className="text-left px-3 py-2 bg-white border border-[#D5C7B8] hover:border-[#C5A059] rounded-sm text-xs transition-colors"
                    >
                      <span className="font-semibold text-[#121214] block">
                        {addr.city} — {addr.pincode}
                      </span>
                      <span className="text-[10px] text-[#7F7972] truncate max-w-[200px] block">
                        {addr.street}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="Arjun"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Kapoor"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                  Client Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="client@domain.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                  Mobile Number (Concierge SMS) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                  Street / Villa / Suite Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="House / Suite No., Building, Locality"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="New Delhi / Mumbai / Bengaluru"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#7F7972] mb-1 font-semibold">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="110001"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] rounded-sm px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#121214] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {isAuthenticated && (
              <label className="flex items-center gap-2.5 text-xs text-[#5C5750] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={saveAddressToVault}
                  onChange={(e) => setSaveAddressToVault(e.target.checked)}
                  className="accent-[#121214] rounded-sm"
                />
                <span>Save this delivery destination to my Supabase address vault</span>
              </label>
            )}

            {/* Dispatch Service Selector Cards */}
            <div className="space-y-2.5 pt-2 border-t border-[#F0ECE5]">
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#121214]">
                Select Dispatch Tier • Est. Arrival {getExpectedDeliveryWindow(shippingMethod)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingMethod('whiteglove')}
                  className={`p-4 text-left border rounded-sm transition-all flex flex-col justify-between gap-2 ${
                    shippingMethod === 'whiteglove'
                      ? 'bg-[#121214] text-white border-[#C5A059] shadow-lg'
                      : 'bg-[#FAF8F5] text-[#121214] border-[#D5C7B8] hover:border-[#121214]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 text-[#C5A059]" /> White Glove Priority
                    </span>
                    <span className="text-xs font-semibold text-[#C5A059]">
                      {subtotal >= 45000 ? 'FREE VIP' : '₹499'}
                    </span>
                  </div>
                  <p className={`text-[11px] ${shippingMethod === 'whiteglove' ? 'text-neutral-300' : 'text-[#7F7972]'}`}>
                    24–48h insured hand-delivery with garment steaming & protective hanger.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 text-left border rounded-sm transition-all flex flex-col justify-between gap-2 ${
                    shippingMethod === 'standard'
                      ? 'bg-[#121214] text-white border-[#C5A059] shadow-lg'
                      : 'bg-[#FAF8F5] text-[#121214] border-[#D5C7B8] hover:border-[#121214]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                      <Truck className="w-3.5 h-3.5 text-[#C5A059]" /> Standard Express
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">
                      {standardShippingCost === 0 ? 'FREE' : '₹199'}
                    </span>
                  </div>
                  <p className={`text-[11px] ${shippingMethod === 'standard' ? 'text-neutral-300' : 'text-[#7F7972]'}`}>
                    3–5 business days insured Pan-India courier with live SMS AWB tracking.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* D. SETTLEMENT METHOD */}
          <div className="bg-white border border-[#E6DED5] rounded-sm p-5 sm:p-7 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Payment Authorization
              </span>
              <h3 className="font-serif text-2xl text-[#121214]">Encrypted Settlement</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-4 border rounded-sm text-left transition-all space-y-1.5 ${
                  paymentMethod === 'razorpay'
                    ? 'bg-[#121214] text-white border-[#C5A059] shadow-lg'
                    : 'bg-[#FAF8F5] text-[#121214] border-[#D5C7B8] hover:border-[#121214]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-[#C5A059]" /> Razorpay Priority
                  </span>
                  {paymentMethod === 'razorpay' && <Check className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <p className={`text-[11px] ${paymentMethod === 'razorpay' ? 'text-neutral-300' : 'text-[#7F7972]'}`}>
                  UPI (GPay, PhonePe), Visa Infinite, Mastercard, Amex & NetBanking
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 border rounded-sm text-left transition-all space-y-1.5 ${
                  paymentMethod === 'cod'
                    ? 'bg-[#121214] text-white border-[#C5A059] shadow-lg'
                    : 'bg-[#FAF8F5] text-[#121214] border-[#D5C7B8] hover:border-[#121214]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                    <Banknote className="w-4 h-4 text-[#C5A059]" /> Doorstep Cash / UPI
                  </span>
                  {paymentMethod === 'cod' && <Check className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <p className={`text-[11px] ${paymentMethod === 'cod' ? 'text-neutral-300' : 'text-[#7F7972]'}`}>
                  Inspect outer parcel seal at your doorstep before paying courier
                </p>
              </button>
            </div>

            {paymentMethod === 'razorpay' && (
              <div className="p-4 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#5C5750] font-bold">
                  <span>Preferred Razorpay Express Instrument</span>
                  <span className="text-emerald-700 font-semibold">HMAC-SHA256 Server Verified</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All Options' },
                    { id: 'upi', label: 'UPI / QR Instant' },
                    { id: 'card', label: 'Cards & RuPay' },
                    { id: 'netbanking', label: 'NetBanking' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferredRzpMethod(opt.id)}
                      className={`py-2 px-2.5 text-[10px] uppercase tracking-wider font-semibold border rounded-sm transition-all ${
                        preferredRzpMethod === opt.id
                          ? 'bg-[#121214] text-[#E6CFA0] border-[#C5A059]'
                          : 'bg-white text-[#5C5750] border-[#D5C7B8] hover:border-[#121214]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Sticky Flagship Ledger, VIP Promo Engine & Shimmer CTA */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="bg-[#121214] text-white border border-[#C5A059]/35 rounded-sm p-6 sm:p-7 shadow-2xl space-y-6 animate-glow-pulse">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
                  Atelier Invoice
                </span>
                <h3 className="font-serif text-2xl font-light">Acquisition Summary</h3>
              </div>
              <Award className="w-6 h-6 text-[#C5A059]" />
            </div>

            {/* Active Piece(s) Compact Ledger */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {activeOrderItems.map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-sm border border-white/15 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-serif text-sm text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        Size {item.size} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#E6CFA0] shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* VIP Privilege Coupon Meter */}
            <div className="p-4 rounded-sm bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#E6CFA0] font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C5A059]" /> VIP Privilege Vault
                </span>
                {subtotal < 45000 ? (
                  <span className="text-neutral-400">
                    ₹{royalGap.toLocaleString('en-IN')} to ₹9,000 off
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">VIP Tier Unlocked!</span>
                )}
              </div>

              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full luxury-shimmer transition-all duration-500"
                  style={{ width: `${royalProgress}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPromo('KRMU10')}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm border transition-colors ${
                    activePromo === 'KRMU10'
                      ? 'bg-[#C5A059] text-[#121214] border-[#C5A059] font-bold'
                      : 'border-white/20 text-neutral-300 hover:border-[#C5A059]'
                  }`}
                >
                  Apply KRMU10 (10% Off)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPromo('KRMUROYAL')}
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm border transition-colors ${
                    activePromo === 'KRMUROYAL'
                      ? 'bg-[#C5A059] text-[#121214] border-[#C5A059] font-bold'
                      : 'border-white/20 text-neutral-300 hover:border-[#C5A059]'
                  }`}
                >
                  KRMUROYAL (₹9,000 Off ≥₹45k)
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Enter custom promo code"
                  className="flex-1 bg-black/40 border border-white/15 rounded-sm px-3 py-2 text-xs text-white placeholder:text-neutral-500 uppercase focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={() => handleApplyPromo()}
                  className="px-3.5 py-2 bg-white/10 hover:bg-[#C5A059] hover:text-[#121214] text-white text-[10px] uppercase tracking-widest font-semibold rounded-sm transition-colors"
                >
                  Apply
                </button>
              </div>

              {promoFeedback.text && (
                <p
                  className={`text-[11px] ${
                    promoFeedback.type === 'success' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {promoFeedback.text}
                </p>
              )}
            </div>

            {/* Breakdown Numbers */}
            <div className="space-y-2.5 text-xs text-neutral-300 border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span>Atelier Piece Total</span>
                <span className="text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Privilege Savings ({activePromo})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>
                  {shippingMethod === 'whiteglove' ? 'White Glove Priority Courier' : 'Express Courier'}
                </span>
                <span className="text-white font-medium">
                  {shippingCost === 0 ? <strong className="text-emerald-400">COMPLIMENTARY</strong> : `₹${shippingCost}`}
                </span>
              </div>

              {giftWrap && (
                <div className="flex justify-between">
                  <span>Wax-Sealed Linen Box & Hanger</span>
                  <span className="text-[#C5A059] font-medium">COMPLIMENTARY</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-white/15">
                <span className="text-sm uppercase tracking-wider text-neutral-300">Total Payable</span>
                <span className="font-serif text-3xl text-[#E6CFA0] font-semibold">
                  ₹{finalOrderTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 text-right">
                Inclusive of all duties & 12% GST
              </p>
            </div>

            {/* Flagship Shimmer Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 luxury-shimmer text-[#121214] font-bold text-xs uppercase tracking-[0.28em] rounded-sm shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Authorizing Atelier Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'cod'
                      ? `Confirm Bespoke Order • ₹${finalOrderTotal.toLocaleString('en-IN')}`
                      : `Complete Purchase • ₹${finalOrderTotal.toLocaleString('en-IN')}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center text-[10px] text-neutral-400">
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] mx-auto" />
                <span className="block">Razorpay SSL</span>
              </div>
              <div className="space-y-1">
                <Package className="w-4 h-4 text-[#C5A059] mx-auto" />
                <span className="block">Insured Transit</span>
              </div>
              <div className="space-y-1">
                <Sparkles className="w-4 h-4 text-[#C5A059] mx-auto" />
                <span className="block">7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modals */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <PaymentProcessingCurtain
        isOpen={paymentCurtain.isOpen}
        stage={paymentCurtain.stage}
        error={paymentCurtain.error}
        amount={finalOrderTotal}
        meta={paymentCurtain.meta}
        onRetry={launchRazorpayFlow}
        onLaunchFallback={() => {
          setPaymentCurtain({ isOpen: false, stage: 'creating_order', error: '', meta: {} });
          setRazorpaySandboxOpen(true);
        }}
        onClose={() => setPaymentCurtain({ isOpen: false, stage: 'creating_order', error: '', meta: {} })}
      />

      <RazorpayGatewayModal
        isOpen={razorpaySandboxOpen}
        onClose={() => setRazorpaySandboxOpen(false)}
        amount={finalOrderTotal}
        orderId={`KRMU-${Math.floor(10000 + Math.random() * 90000)}`}
        customer={{
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone
        }}
        onSuccess={(paymentData) => {
          setRazorpaySandboxOpen(false);
          finalizeOrderToDatabase({
            method: `Razorpay Sandbox (${paymentData.method || 'Online'})`,
            rawMethod: String(paymentData.method || 'upi').toLowerCase(),
            paymentId: paymentData.razorpay_payment_id,
            orderId: paymentData.razorpay_order_id,
            signature: paymentData.razorpay_signature,
            signatureVerified: false,
            verificationSource: 'sandbox_simulator',
            status: 'Authorized'
          });
        }}
      />
    </div>
  );
}

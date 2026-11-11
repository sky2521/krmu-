import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  Banknote, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { initiateRazorpayCheckout, getRazorpayKey } from '../services/razorpay';
import RazorpayGatewayModal from '../components/common/RazorpayGatewayModal';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, shippingFee, total, promoCode, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  // Shipping Form State
  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'Kabir',
    lastName: user?.name && user.name.split(' ').length > 1 ? user.name.split(' ')[1] : 'Mehra',
    email: user?.email || 'kabir@example.com',
    phone: user?.phone || '+91 98765 43210',
    street: user?.addresses?.[0]?.street || 'Villa 14, The Magnolias, Golf Course Road',
    city: user?.addresses?.[0]?.city || 'Gurugram',
    state: user?.addresses?.[0]?.state || 'Haryana',
    pincode: user?.addresses?.[0]?.pincode || '122002',
    deliveryNotes: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard'); // standard or whiteglove
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // razorpay or cod
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpaySandboxOpen, setRazorpaySandboxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl">Your Wardrobe Bag is Empty</h2>
        <p className="text-xs text-[#7F7972]">Please add garments before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block mt-4 px-6 py-3 bg-[#121214] text-white text-xs uppercase tracking-widest">
          Explore Atelier Collection
        </Link>
      </div>
    );
  }

  const shippingCost = shippingMethod === 'whiteglove' ? 499 : shippingFee;
  const finalOrderTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseSavedAddress = (addr) => {
    setFormData({
      ...formData,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone || formData.phone
    });
  };

  const completeOrderProcessing = async (paymentDetails) => {
    const orderData = {
      customer: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone
      },
      items: items.map((i) => ({
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
        promoCodeApplied: promoCode
      },
      paymentMethod: paymentDetails.method || "Razorpay Gateway",
      paymentId: paymentDetails.paymentId || `pay_${Date.now()}`,
      paymentStatus: paymentDetails.status === "Authorized" || paymentDetails.status === "captured" ? "Paid" : "Pending",
      deliveryMethod: shippingMethod === 'whiteglove' ? "Atelier White Glove Courier" : "Standard Express Courier"
    };

    const newOrder = await createOrder(orderData);
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    navigate(`/order-success/${newOrder.id}`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      setErrorMessage('Please fill in all mandatory delivery details.');
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'cod') {
      setTimeout(() => {
        setIsSubmitting(false);
        completeOrderProcessing({
          method: "Cash on Delivery",
          paymentId: `cod_${Date.now()}`,
          status: "Pending Cash on Delivery"
        });
      }, 900);
      return;
    }

    // Razorpay Online Flow
    try {
      const receiptId = `KRMU-${Date.now()}`;
      await initiateRazorpayCheckout({
        amount: finalOrderTotal,
        receipt: receiptId,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone
        },
        notes: {
          shipping_city: formData.city,
          shipping_pincode: formData.pincode
        },
        onSuccess: (paymentResp) => {
          setIsSubmitting(false);
          completeOrderProcessing({
            method: "Razorpay Standard Checkout",
            paymentId: paymentResp.paymentId,
            orderId: paymentResp.orderId,
            status: "Authorized"
          });
        },
        onFailure: (err) => {
          setIsSubmitting(false);
          console.warn("Razorpay checkout error:", err);
          setErrorMessage(err.message || 'Payment could not be completed. Please try again.');
        }
      });
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Header */}
      <div className="border-b border-[#E6DED5] pb-4 flex items-center justify-between">
        <div>
          <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E]">
            <Link to="/cart" className="hover:text-black flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Bag
            </Link>
            <span>/</span>
            <span className="text-[#121214] font-semibold">Secure Checkout</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#121214] mt-1">
            Atelier Checkout
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#8C867E] bg-[#F3EFEA] px-3 py-1.5 rounded-sm">
          <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-8">
          {/* Saved Addresses quick-picker for logged in user */}
          {isAuthenticated && user?.addresses?.length > 0 && (
            <div className="p-4 bg-[#F3EFEA] border border-[#E6DED5] rounded-sm space-y-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-[#121214]">
                Quick Select Saved Address
              </p>
              <div className="flex flex-wrap gap-2">
                {user.addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleUseSavedAddress(addr)}
                    className="text-left p-2.5 bg-white border border-[#D5C7B8] hover:border-black rounded-sm text-xs transition-colors"
                  >
                    <p className="font-semibold text-[#121214]">{addr.city}, {addr.pincode}</p>
                    <p className="text-[11px] text-[#7F7972] truncate max-w-xs">{addr.street}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#121214] border-b border-[#F0ECE5] pb-2">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  Phone (for Delivery SMS) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#121214] border-b border-[#F0ECE5] pb-2">
              2. Shipping Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                Street Address & Residence *
              </label>
              <input
                type="text"
                name="street"
                required
                placeholder="Apartment, suite, unit, building, floor"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#D5C7B8] px-3.5 py-2.5 text-xs focus:outline-none focus:border-black font-mono"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method Selection */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#121214] border-b border-[#F0ECE5] pb-2">
              3. Delivery Preference
            </h3>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                  shippingMethod === 'standard' ? 'border-black bg-white shadow-sm' : 'border-[#D5C7B8] bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-black"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#121214]">Standard Express Courier (BlueDart / Delhivery)</p>
                    <p className="text-[11px] text-[#7F7972]">Estimated delivery within 3-5 business days</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#121214]">
                  {shippingFee === 0 ? <strong className="text-emerald-700">COMPLIMENTARY</strong> : `₹${shippingFee}`}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                  shippingMethod === 'whiteglove' ? 'border-black bg-white shadow-sm' : 'border-[#D5C7B8] bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="whiteglove"
                    checked={shippingMethod === 'whiteglove'}
                    onChange={() => setShippingMethod('whiteglove')}
                    className="accent-black"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#121214]">Atelier White Glove Priority Delivery</p>
                    <p className="text-[11px] text-[#7F7972]">Custom garment box, garment hanger, priority 48-hr dispatch</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#121214]">₹499</span>
              </label>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#121214] border-b border-[#F0ECE5] pb-2">
              4. Payment Method
            </h3>

            <div className="space-y-3">
              {/* Razorpay Option */}
              <label
                className={`flex items-start justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                  paymentMethod === 'razorpay' ? 'border-[#0c2340] bg-white ring-1 ring-[#0c2340] shadow-sm' : 'border-[#D5C7B8] bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-black mt-1"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0c2340]">Razorpay Online Payment</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7F7972]">
                      Pay securely via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card, NetBanking, EMI, or Wallets.
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-neutral-500 font-mono">
                      <span>UPI</span> • <span>VISA</span> • <span>MASTERCARD</span> • <span>RUPAY</span> • <span>NETBANKING</span>
                    </div>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0" />
              </label>

              {/* Cash on Delivery Option */}
              <label
                className={`flex items-start justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-black bg-white ring-1 ring-black shadow-sm' : 'border-[#D5C7B8] bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-black mt-1"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#121214]">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-[#7F7972]">
                      Pay upon delivery via cash or courier digital QR scanner at your doorstep.
                    </p>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-[#8C867E] shrink-0" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E6DED5] rounded-sm p-6 space-y-5 shadow-sm sticky top-28">
            <h3 className="font-serif text-xl text-[#121214] border-b border-[#F0ECE5] pb-3">
              Order Bag ({items.length} garments)
            </h3>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-[#F0ECE5] pr-1">
              {items.map((item) => (
                <div key={item.key} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover bg-neutral-100 rounded-sm" />
                    <div>
                      <h4 className="font-medium text-[#121214] line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-[#7F7972]">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#121214]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#7F7972] border-t border-[#F0ECE5] pt-4">
              <div className="flex justify-between">
                <span>Garment Subtotal</span>
                <span className="text-[#121214] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Privilege Coupon ({promoCode})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Method</span>
                <span className="text-[#121214] font-medium">
                  {shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#121214] pt-3 border-t border-[#F0ECE5]">
                <span>Total Payable</span>
                <span className="font-serif text-2xl text-[#121214]">
                  ₹{finalOrderTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 text-center">
                Includes all taxes, GST (12%), and courier transit insurance.
              </p>
            </div>

            {/* Complete Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#121214] text-white hover:bg-[#C5A059] transition-all text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C5A059]" />
                  <span>Pay ₹{finalOrderTotal.toLocaleString('en-IN')} with Razorpay</span>
                </>
              )}
            </button>

            {/* Policies agreement notice */}
            <div className="pt-2 border-t border-[#F0ECE5] space-y-2">
              <label className="flex items-start gap-2 text-[11px] text-[#5C5750] cursor-pointer">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="mt-0.5 accent-black rounded-sm"
                />
                <span>
                  I have read and agree to KRMU's{' '}
                  <Link to="/terms" target="_blank" className="underline text-[#121214] font-medium hover:text-[#C5A059]">Terms & Conditions</Link>,{' '}
                  <Link to="/refund-policy" target="_blank" className="underline text-[#121214] font-medium hover:text-[#C5A059]">Cancellation & Refund Policy</Link>, and{' '}
                  <Link to="/shipping-policy" target="_blank" className="underline text-[#121214] font-medium hover:text-[#C5A059]">Shipping Policy</Link>.
                </span>
              </label>
              <p className="text-[10px] text-[#8C867E] text-center">
                Transactions are processed in INR through Razorpay Payments India Pvt. Ltd.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Razorpay Interactive Fallback Sandbox Modal */}
      <RazorpayGatewayModal
        isOpen={razorpaySandboxOpen}
        onClose={() => setRazorpaySandboxOpen(false)}
        amount={finalOrderTotal}
        orderId={`KRMU-${Math.floor(10000 + Math.random() * 90000)}`}
        customer={{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        }}
        onSuccess={(paymentData) => {
          setRazorpaySandboxOpen(false);
          completeOrderProcessing({
            method: `Razorpay (${paymentData.method || 'Online'})`,
            paymentId: paymentData.razorpay_payment_id,
            status: "Authorized"
          });
        }}
      />
    </div>
  );
}

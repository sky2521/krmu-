import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Truck,
  Printer,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  Lock,
  Gift,
  Award,
  ArrowRight
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { getOrderById, fetchOrderByIdAsync } = useOrders();

  const cachedOrder = getOrderById(orderId);
  const [order, setOrder] = useState(cachedOrder);
  const [loading, setLoading] = useState(!cachedOrder);

  useEffect(() => {
    let active = true;
    async function resolveOrder() {
      if (cachedOrder) {
        setOrder(cachedOrder);
        setLoading(false);
        return;
      }
      setLoading(true);
      const remote = await fetchOrderByIdAsync(orderId);
      if (active) {
        setOrder(remote);
        setLoading(false);
      }
    }
    resolveOrder();
    return () => {
      active = false;
    };
  }, [orderId, cachedOrder, fetchOrderByIdAsync]);

  useEffect(() => {
    if (!order) return;
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        colors: ['#C5A059', '#FAF8F5', '#121214', '#E6CFA0'],
        origin: { y: 0.5 }
      });
    } catch (e) {
      // ignore
    }
  }, [order?.id]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center space-y-3 animate-pulse">
          <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#8C867E]">
            Retrieving Verified Acquisition Certificate...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#121214]">Order Record Not Found</h2>
        <p className="text-xs text-[#7F7972]">
          We could not locate order <strong>{orderId}</strong>. Sign in with the account used at checkout to view your private order archive.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/track-order" className="px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest">
            Track Order
          </Link>
          <Link to="/order" className="px-6 py-2.5 border border-[#121214] text-xs uppercase tracking-widest">
            Return to Order Studio
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const methodDetail = order.paymentMethodDetail || {};
  const detailBadges = [
    methodDetail.vpa ? `UPI: ${methodDetail.vpa}` : null,
    methodDetail.card_network && methodDetail.card_last4
      ? `${methodDetail.card_network} •••• ${methodDetail.card_last4}`
      : null,
    methodDetail.bank ? `Bank: ${methodDetail.bank}` : null,
    methodDetail.wallet ? `Wallet: ${methodDetail.wallet}` : null
  ].filter(Boolean);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Obsidian & Gold Acquisition Certificate Hero */}
        <div className="relative overflow-hidden bg-[#0D0D0E] text-white border border-[#C5A059]/40 rounded-sm p-8 sm:p-12 text-center space-y-5 shadow-2xl">
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#C5A059]/15 blur-3xl" />

          <div className="relative w-16 h-16 bg-emerald-500/15 border border-emerald-400/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[10px] uppercase tracking-[0.28em] text-[#E6CFA0] font-semibold">
              {order.signatureVerified ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cryptographically Verified • Razorpay HMAC-SHA256</span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Atelier Order Confirmed & Logged</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
              Thank You for Your <span className="luxury-text-gold italic">Patronage</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#BDB7AE] max-w-xl mx-auto leading-relaxed">
              Your creation has been reserved and synchronized to your KRMU vault. Dispatch updates and your digital invoice have been addressed to{' '}
              <strong className="text-white">{order.customer?.email}</strong>.
            </p>
          </div>

          <div className="relative pt-3 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-2 rounded-sm text-xs font-mono">
              <span className="text-[#8C867E]">ORDER ID</span>
              <strong className="text-[#E6CFA0]">{order.id}</strong>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 px-4 py-2 rounded-sm text-xs font-mono">
              <span className="text-[#8C867E]">TRACKING AWB</span>
              <strong className="text-white">{order.trackingNumber}</strong>
            </div>
          </div>
        </div>

        {/* Formal Ledger & Tax Invoice Card */}
        <div className="bg-white border border-[#E6DED5] rounded-sm p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE5] gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                Official GST Tax Invoice & Ledger
              </span>
              <h3 className="font-serif text-2xl text-[#121214]">Atelier Order Receipt</h3>
              <p className="text-xs text-[#7F7972]">Issued on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#121214] text-xs uppercase tracking-widest text-[#121214] hover:bg-[#121214] hover:text-white transition-colors self-start sm:self-auto font-semibold rounded-sm"
            >
              <Printer className="w-4 h-4" /> Print Tax Invoice
            </button>
          </div>

          {/* 3-Column Vault Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border-b border-[#F0ECE5] pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#121214]">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> Destination Address
              </div>
              <p className="text-[#121214] font-semibold">{order.shippingAddress?.name}</p>
              <p className="text-[#7F7972]">{order.shippingAddress?.street}</p>
              <p className="text-[#7F7972]">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
              </p>
              <p className="text-[#7F7972]">Phone: {order.shippingAddress?.phone}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#121214]">
                <CreditCard className="w-3.5 h-3.5 text-[#C5A059]" /> Settlement Verification
              </div>
              <p className="text-[#121214] font-semibold">{order.paymentMethod}</p>
              {detailBadges.map((b) => (
                <p key={b} className="text-[11px] font-mono text-[#5C5750]">
                  {b}
                </p>
              ))}
              {order.razorpayOrderId && (
                <p className="text-[10px] font-mono text-[#7F7972] break-all">
                  RZP Order: {order.razorpayOrderId}
                </p>
              )}
              <p className="text-[10px] font-mono text-[#7F7972] break-all">
                Payment ID: {order.paymentId}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
                  Status: {order.paymentStatus}
                </span>
                {order.signatureVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#121214] text-[#E6CFA0] font-bold rounded text-[10px]">
                    <Lock className="w-2.5 h-2.5" /> HMAC Verified
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#121214]">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> Concierge Dispatch
              </div>
              <p className="text-[#121214] font-semibold text-sm">{order.estimatedDelivery}</p>
              <p className="text-[#7F7972]">{order.deliveryMethod || order.carrier}</p>
              <p className="text-[#7F7972]">Carrier: {order.carrier}</p>
              <span className="inline-block px-2 py-0.5 bg-neutral-100 text-[#121214] font-bold rounded text-[10px]">
                Order Status: {order.status}
              </span>
            </div>
          </div>

          {/* Gift Note Box if provided */}
          {(order.giftWrap || order.giftNote) && (
            <div className="p-4 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm flex items-start gap-3 text-xs">
              <Gift className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-[#121214]">
                  Signature Wax-Sealed Linen Box & Cedarwood Hanger
                </p>
                {order.giftNote && (
                  <p className="italic text-[#5C5750]">
                    Calligraphy Dedication: “{order.giftNote}”
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Itemized Creations */}
          <div className="space-y-4 border-b border-[#F0ECE5] pb-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">
              Tailored Creations Included
            </h4>
            <div className="divide-y divide-[#F0ECE5]">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded-sm bg-neutral-100 border border-[#E6DED5]"
                    />
                    <div>
                      <h5 className="font-serif text-base text-[#121214]">{item.name}</h5>
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
          </div>

          {/* Financial Totals */}
          <div className="space-y-2 text-xs text-[#7F7972] max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#121214] font-medium">
                ₹{Number(order.pricing?.subtotal || 0).toLocaleString('en-IN')}
              </span>
            </div>
            {order.pricing?.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Privilege Discount</span>
                <span>-₹{Number(order.pricing.discount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-[#121214] font-medium">
                {order.pricing?.shipping === 0 ? 'COMPLIMENTARY' : `₹${order.pricing?.shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#121214] pt-2 border-t border-[#F0ECE5]">
              <span>Total Settled</span>
              <span className="font-serif text-2xl">
                ₹{Number(order.pricing?.total || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F0ECE5]">
            <Link
              to={`/track-order?orderId=${order.id}`}
              className="w-full sm:w-auto px-6 py-3.5 luxury-shimmer text-[#121214] hover:brightness-105 transition-all text-xs uppercase tracking-widest font-bold text-center flex items-center justify-center gap-2 rounded-sm shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>Track Delivery Progress</span>
            </Link>

            <div className="flex items-center gap-5">
              <Link
                to="/account?tab=orders"
                className="text-xs uppercase tracking-widest text-[#7F7972] hover:text-[#121214] font-semibold"
              >
                My Order Vault
              </Link>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-widest text-[#121214] hover:text-[#C5A059] font-semibold inline-flex items-center gap-1"
              >
                <span>Continue Browsing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

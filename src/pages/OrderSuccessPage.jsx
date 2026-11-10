import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl">Order Record Not Found</h2>
        <p className="text-xs text-[#7F7972]">We could not locate this order in our atelier logs.</p>
        <Link to="/" className="inline-block px-6 py-2.5 bg-[#121214] text-white text-xs uppercase tracking-widest">
          Return Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Banner */}
      <div className="bg-white border border-[#E6DED5] rounded-sm p-8 sm:p-10 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle className="w-8 h-8" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
          Order Confirmed & Logged
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#121214] font-normal">
          Thank you for your patronage.
        </h1>

        <p className="text-xs sm:text-sm text-[#7F7972] max-w-lg mx-auto leading-relaxed">
          Your order has been authorized with Razorpay. A formal receipt and courier dispatch alert have been dispatched to <strong>{order.customer.email}</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#D5C7B8] px-4 py-2 rounded-sm text-xs font-mono">
            <span className="text-[#8C867E]">Order ID:</span>
            <strong className="text-black">{order.id}</strong>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#D5C7B8] px-4 py-2 rounded-sm text-xs font-mono">
            <span className="text-[#8C867E]">Tracking AWB:</span>
            <strong className="text-black">{order.trackingNumber}</strong>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white border border-[#E6DED5] rounded-sm p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE5] gap-2">
          <div>
            <h3 className="font-serif text-xl text-[#121214]">Atelier Order Receipt</h3>
            <p className="text-xs text-[#7F7972]">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#121214] hover:text-[#C5A059] self-start sm:self-auto font-semibold"
          >
            <Printer className="w-4 h-4" /> Print Tax Invoice
          </button>
        </div>

        {/* 3 Columns: Shipping, Payment, Estimated Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs border-b border-[#F0ECE5] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#121214]">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> Destination Address
            </div>
            <p className="text-[#121214] font-medium">{order.shippingAddress.name}</p>
            <p className="text-[#7F7972]">{order.shippingAddress.street}</p>
            <p className="text-[#7F7972]">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            <p className="text-[#7F7972]">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#121214]">
              <CreditCard className="w-3.5 h-3.5 text-[#C5A059]" /> Payment Transaction
            </div>
            <p className="text-[#121214] font-medium">{order.paymentMethod}</p>
            <p className="text-[#7F7972] font-mono text-[11px]">ID: {order.paymentId}</p>
            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded text-[10px]">
              Status: {order.paymentStatus}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#121214]">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> Estimated Delivery
            </div>
            <p className="text-[#121214] font-semibold text-sm">{order.estimatedDelivery}</p>
            <p className="text-[#7F7972]">Carrier: {order.carrier}</p>
            <span className="inline-block px-2 py-0.5 bg-neutral-100 text-[#121214] font-bold rounded text-[10px]">
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-4 border-b border-[#F0ECE5] pb-6">
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">Garments in this Shipment</h4>
          <div className="divide-y divide-[#F0ECE5]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-sm bg-neutral-100" />
                  <div>
                    <h5 className="font-medium text-[#121214]">{item.name}</h5>
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

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-xs text-[#7F7972] max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#121214] font-medium">₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Privilege Discount</span>
              <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-[#121214] font-medium">
              {order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#121214] pt-2 border-t border-[#F0ECE5]">
            <span>Total Paid</span>
            <span className="font-serif text-xl">₹{order.pricing.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F0ECE5]">
          <Link
            to={`/track-order?orderId=${order.id}`}
            className="w-full sm:w-auto px-6 py-3 bg-[#121214] text-white hover:bg-[#C5A059] transition-all text-xs uppercase tracking-widest font-semibold text-center flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Progress</span>
          </Link>

          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest text-[#121214] hover:underline font-semibold"
          >
            Continue Browsing Atelier Collection →
          </Link>
        </div>
      </div>
    </div>
  );
}

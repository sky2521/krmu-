import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const { orders, getOrderById } = useOrders();

  const queryOrderId = searchParams.get('orderId') || '';
  const [inputSearch, setInputSearch] = useState(queryOrderId);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (queryOrderId) {
      const found = getOrderById(queryOrderId);
      if (found) {
        setActiveOrder(found);
        setSearched(true);
      }
    } else if (orders.length > 0) {
      // Default to the most recent order for immediate inspection
      setActiveOrder(orders[0]);
      setInputSearch(orders[0].id);
      setSearched(true);
    }
  }, [queryOrderId, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputSearch.trim()) return;

    const found = getOrderById(inputSearch.trim());
    setActiveOrder(found || null);
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
          Live Atelier Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#121214]">
          Track Your Wardrobe Shipment
        </h1>
        <p className="text-xs sm:text-sm text-[#7F7972] max-w-lg mx-auto">
          Enter your Order ID (e.g. KRMU-2026-98102) or Courier AWB to view real-time status.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. KRMU-2026-98102"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            className="flex-1 bg-white border border-[#D5C7B8] px-4 py-3 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-black rounded-sm shadow-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>

        {/* Quick chip demo */}
        {orders.length > 0 && (
          <div className="text-[11px] text-[#7F7972] pt-1">
            <span>Recent Test Orders: </span>
            {orders.slice(0, 2).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setInputSearch(o.id);
                  setActiveOrder(o);
                  setSearched(true);
                }}
                className="underline text-[#121214] font-mono mx-1 hover:text-[#C5A059]"
              >
                {o.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Container */}
      {searched && (
        activeOrder ? (
          <div className="bg-white border border-[#E6DED5] rounded-sm p-6 sm:p-8 space-y-8 shadow-sm animate-fade-in">
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0ECE5] gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8C867E]">
                  Order Identification
                </span>
                <h3 className="font-serif text-2xl text-[#121214]">{activeOrder.id}</h3>
                <p className="text-xs text-[#7F7972]">
                  Carrier: <strong>{activeOrder.carrier}</strong> • AWB: <strong className="font-mono">{activeOrder.trackingNumber}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-[#121214] text-[#C5A059] text-xs font-bold uppercase tracking-widest rounded-sm">
                  {activeOrder.status}
                </span>
                <p className="text-xs text-[#7F7972] mt-1">
                  Estimated Delivery: <strong className="text-black">{activeOrder.estimatedDelivery}</strong>
                </p>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">
                Shipment Journey
              </h4>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E6DED5]">
                {activeOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3">
                    <div
                      className={`absolute -left-6 sm:-left-8 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                        step.completed ? 'bg-emerald-600' : 'bg-neutral-300'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="flex-1">
                      <p className={`text-xs font-semibold ${step.completed ? 'text-[#121214]' : 'text-[#8C867E]'}`}>
                        {step.status}
                      </p>
                      <p className="text-[11px] text-[#7F7972]">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Garments Accordion */}
            <div className="border-t border-[#F0ECE5] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <h4 className="uppercase tracking-widest font-bold text-[#121214] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> Destination
                </h4>
                <p className="font-semibold text-[#121214]">{activeOrder.shippingAddress.name}</p>
                <p className="text-[#7F7972]">{activeOrder.shippingAddress.street}</p>
                <p className="text-[#7F7972]">
                  {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.pincode}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="uppercase tracking-widest font-bold text-[#121214] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#C5A059]" /> Package Contents
                </h4>
                <div className="space-y-1.5">
                  {activeOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-[#7F7972]">
                      <span className="truncate max-w-[200px] text-[#121214]">{item.name} ({item.size})</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Need assistance */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm text-xs text-[#7F7972] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>Delivery delayed or require address alteration?</span>
              <Link to="/contact" className="text-[#121214] font-semibold underline hover:text-[#C5A059]">
                Contact Atelier Concierge →
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E6DED5] rounded-sm p-10 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#B85D43] mx-auto" />
            <h3 className="font-serif text-2xl text-[#121214]">Shipment Not Located</h3>
            <p className="text-xs text-[#7F7972] max-w-sm mx-auto">
              We could not find an order matching "{inputSearch}". Please verify your order number in your confirmation email or client account.
            </p>
          </div>
        )
      )}
    </div>
  );
}

import React from 'react';
import { Sparkles, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#121214] text-[#EFEBE4] text-xs py-2 px-4 overflow-hidden border-b border-[#2A2A2E] z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-6 text-[11px] tracking-widest uppercase font-medium">
          <span className="flex items-center gap-1.5 text-[#C5A059]">
            <Truck className="w-3.5 h-3.5" />
            Complimentary Pan-India Delivery on orders over ₹2,499
          </span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            Razorpay Secure 256-bit Encrypted Checkout
          </span>
        </div>

        <div className="w-full md:w-auto text-center flex items-center justify-center space-x-2 text-[11px] tracking-wider uppercase">
          <span>Use code <strong className="text-[#C5A059] font-bold tracking-widest">KRMU10</strong> for 10% off your wardrobe</span>
          <Link to="/shop" className="text-white hover:text-[#C5A059] transition-colors underline flex items-center ml-2 text-[10px]">
            Shop Now <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-4 text-[11px] text-neutral-400">
          <Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-white transition-colors">Client Concierge</Link>
        </div>
      </div>
    </div>
  );
}

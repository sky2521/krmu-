import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Twitter, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { submitSupabaseNewsletter } from '../../services/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      await submitSupabaseNewsletter(email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#121214] text-[#E5E0D8] pt-16 pb-12 border-t border-[#26262B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Atelier Invitation */}
        <div className="pb-16 border-b border-[#26262B] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
              The KRMU Atelier Dispatch
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Receive 10% off your inaugural order and private invitations to seasonal drops.
            </h3>
            <p className="text-xs text-[#9E988F] font-light max-w-lg">
              Subscribers receive priority tailoring slots, private salon invitations, and early lookbook access. Zero spam.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="bg-[#1C1C20] border border-[#C5A059] p-4 text-center rounded-sm space-y-1 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-[#C5A059] font-medium text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Welcome to the KRMU Circle
                </div>
                <p className="text-xs text-neutral-300">
                  Your complimentary 10% coupon code is: <strong className="text-white tracking-widest bg-black/40 px-2 py-0.5 border border-[#C5A059]/40 ml-1">KRMU10</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#1A1A1E] border border-[#33333A] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FAF8F5] text-[#121214] hover:bg-[#C5A059] hover:text-white transition-all text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  Join Circle <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Columns */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.25em] text-white">K R M U</span>
            </Link>
            <p className="text-xs text-[#A8A196] leading-relaxed max-w-sm">
              Founded on principles of architectural reduction and enduring fabrications. KRMU represents contemporary Indian luxury ready-to-wear engineered with sustainable natural textiles and immaculate tailoring.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#33333A] flex items-center justify-center text-[#A8A196] hover:text-white hover:border-[#C5A059] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#33333A] flex items-center justify-center text-[#A8A196] hover:text-white hover:border-[#C5A059] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-white font-semibold">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A196]">
              <li>
                <Link to="/shop?category=men" className="hover:text-white transition-colors">
                  Men's Atelier
                </Link>
              </li>
              <li>
                <Link to="/shop?category=women" className="hover:text-white transition-colors">
                  Women's Atelier
                </Link>
              </li>
              <li>
                <Link to="/shop?category=new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?subcategory=outerwear" className="hover:text-white transition-colors">
                  Trench & Outerwear
                </Link>
              </li>
              <li>
                <Link to="/shop?subcategory=trousers" className="hover:text-white transition-colors">
                  Tailored Trousers
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Craftsmanship
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge & Razorpay Compliance */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-white font-semibold">
              Client Care & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A196]">
              <li>
                <Link to="/track-order" className="hover:text-white transition-colors font-medium text-white">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery Terms
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Contact Details */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-white font-semibold">
              Atelier & Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-[#A8A196]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>
                  KRMU Atelier, Suite 402, Design Boulevard, Gurugram, Haryana 122103, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white">
                  +91 (0) 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:concierge@krmu-apparel.com" className="hover:text-white">
                  concierge@krmu-apparel.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Mon – Sat: 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Razorpay Trust & Payment Gateway Badges */}
        <div className="py-8 border-t border-b border-[#26262B] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-[#A8A196]">
            <Lock className="w-4 h-4 text-[#C5A059]" />
            <span>
              Powered by <strong className="text-white">Razorpay</strong> Payment Gateway — Bank-grade 256-bit SSL Encryption
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-semibold">Accepted Methods:</span>
            {['UPI (GPay / PhonePe / Paytm)', 'Visa', 'Mastercard', 'RuPay', 'NetBanking', 'Razorpay EMI', 'Cash on Delivery'].map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 bg-[#1C1C20] border border-[#33333A] text-[10px] text-neutral-300 rounded font-mono"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F7972] gap-4">
          <p>© {new Date().getFullYear()} KRMU Apparel Private Limited. All Rights Reserved.</p>
          <p className="text-[11px]">
            Designed for uncompromising taste • Made ethically in India
          </p>
        </div>
      </div>
    </footer>
  );
}

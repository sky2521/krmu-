import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Star, 
  CheckCircle,
  Eye,
  Instagram,
  ChevronRight
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [selectedHomeTab, setSelectedHomeTab] = useState('all');

  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestsellers = products.filter((p) => p.isBestseller);

  const filteredFeatured =
    selectedHomeTab === 'all'
      ? products.slice(0, 4)
      : selectedHomeTab === 'new-arrivals'
      ? newArrivals.slice(0, 4)
      : products.filter((p) => p.category === selectedHomeTab).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-[#121214] text-white overflow-hidden">
        {/* Editorial Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="KRMU Editorial Autumn Winter"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 pt-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Winter Solstice Atelier Drop
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-white leading-[1.1]">
            Architectural Form. <br />
            <span className="italic font-normal">Pure Drape.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D4CDC3] max-w-xl mx-auto font-light leading-relaxed">
            Contemporary silhouettes crafted from Normandy linen, Grade 6A mulberry silk, and Australian Merino wool. Designed in New Delhi for the modern collector.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/order"
              className="w-full sm:w-auto px-8 py-4 luxury-shimmer text-[#121214] hover:brightness-105 transition-all duration-300 text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 group shadow-2xl"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/shop?category=new-arrivals"
              className="w-full sm:w-auto px-8 py-4 bg-[#FAF8F5] text-[#121214] hover:bg-[#C5A059] hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2 group shadow-xl"
            >
              <span>Explore New Arrivals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/40 text-white hover:bg-white/10 hover:border-white transition-all duration-300 text-xs uppercase tracking-[0.25em] font-medium flex items-center justify-center"
            >
              The Atelier Story
            </Link>
          </div>
        </div>

        {/* Floating bottom pill */}
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">
          <div className="flex items-center space-x-6 text-[10px] uppercase tracking-[0.3em] text-white/70 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
            <span>Free Express Delivery over ₹2,499</span>
            <span>•</span>
            <span>7-Day Concierge Returns</span>
            <span>•</span>
            <span>Razorpay Secured</span>
          </div>
        </div>
      </section>

      {/* Featured Category Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-semibold">
            Seasonal Divisions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#121214]">
            Curated For The Modern Wardrobe
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men */}
          <Link
            to="/shop?category=men"
            className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
              alt="KRMU Men"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Division I</span>
              <h3 className="font-serif text-2xl tracking-wide">Men's Tailoring</h3>
              <p className="text-xs text-neutral-300 font-light flex items-center justify-between pt-1">
                <span>Structured coats, linen shirts & trousers</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A059]" />
              </p>
            </div>
          </Link>

          {/* Women */}
          <Link
            to="/shop?category=women"
            className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
              alt="KRMU Women"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Division II</span>
              <h3 className="font-serif text-2xl tracking-wide">Women's Silhouette</h3>
              <p className="text-xs text-neutral-300 font-light flex items-center justify-between pt-1">
                <span>Silk bias slips, sculptured knits & trench</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A059]" />
              </p>
            </div>
          </Link>

          {/* New Arrivals */}
          <Link
            to="/shop?category=new-arrivals"
            className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
              alt="KRMU New Arrivals"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Limited Run</span>
              <h3 className="font-serif text-2xl tracking-wide">New Arrivals</h3>
              <p className="text-xs text-neutral-300 font-light flex items-center justify-between pt-1">
                <span>Small batch atelier editions</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C5A059]" />
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products with Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E6DED5] pb-4 mb-8 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-semibold">
              The Edit
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#121214]">
              Signature Atelier Pieces
            </h2>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Curations' },
              { id: 'women', label: 'Women' },
              { id: 'men', label: 'Men' },
              { id: 'new-arrivals', label: 'New Arrivals' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedHomeTab(tab.id)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all rounded-sm font-medium whitespace-nowrap ${
                  selectedHomeTab === tab.id
                    ? 'bg-[#121214] text-white shadow-sm'
                    : 'text-[#7F7972] hover:text-black hover:bg-[#F3EFEA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {filteredFeatured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#121214] text-[#121214] hover:bg-[#121214] hover:text-white transition-all duration-300 text-xs uppercase tracking-[0.25em] font-semibold"
          >
            <span>View Complete Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Brand Story Manifesto Banner */}
      <section className="bg-[#1A1A1E] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
              Brand Philosophy & Manifesto
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
              "We reject the fleeting frenzy of fast fashion in pursuit of eternal form."
            </h2>
            <p className="text-xs sm:text-sm text-[#BDB7AE] font-light leading-relaxed">
              KRMU was born in New Delhi with a singular conviction: luxury is not an ostentatious logo, but the whispered confidence of pristine textiles, obsessive proportions, and uncompromising ethical small-batch tailoring.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10 text-center sm:text-left">
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-[#C5A059] block">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Natural & Traceable Fibers</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-[#C5A059] block">0%</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Plastic-Derived Poly</span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-[#C5A059] block">256-Bit</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400">Razorpay Protected</span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white hover:text-[#C5A059] transition-colors underline font-medium"
              >
                Read Our Full Craftsmanship Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-white/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"
                alt="KRMU Atelier Tailoring Process"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose KRMU - Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-[#E6DED5]">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#F3EFEA] rounded-sm text-[#121214]">
              <Truck className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">Complimentary Shipping</h4>
              <p className="text-xs text-[#7F7972]">Express Pan-India courier on all orders exceeding ₹2,499.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#F3EFEA] rounded-sm text-[#121214]">
              <RefreshCw className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">7-Day Hassle-Free Returns</h4>
              <p className="text-xs text-[#7F7972]">Doorstep pickup with instantaneous exchange or refund.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#F3EFEA] rounded-sm text-[#121214]">
              <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">Razorpay Certified</h4>
              <p className="text-xs text-[#7F7972]">Encrypted UPI, Cards, NetBanking, and PayLater checkout.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#F3EFEA] rounded-sm text-[#121214]">
              <Sparkles className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#121214]">Bespoke Atelier Fit</h4>
              <p className="text-xs text-[#7F7972]">Complimentary size consultations with our master tailors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-semibold">
            Client Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#121214]">
            Praised by Discriminating Wardrobes
          </h2>
          <div className="flex items-center justify-center gap-1 text-amber-500 pt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-xs text-[#121214] font-bold ml-2">4.9 / 5.0 Average Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "The Oversized Trench Coat is a masterclass in tailoring. The heavy water-resistant gabardine drapes like a dream. Razorpay checkout took literally 10 seconds.",
              name: "Nandini Sengupta",
              location: "New Delhi",
              item: "Oversized Minimalist Trench Coat"
            },
            {
              quote: "Finding a double-breasted blazer with genuine soft canvas shoulders in India was impossible until KRMU. Bespoke Savile Row feel right off the rack.",
              name: "Vikramaditya Roy",
              location: "Bengaluru",
              item: "Architectural Double-Breasted Blazer"
            },
            {
              quote: "The Mulberry Silk slip dress is pure liquid luxury. The packaging was immaculate with personalized garment bag and wooden hanger. Exceptional brand.",
              name: "Pooja Singhal",
              location: "Mumbai",
              item: "Pure Mulberry Silk Slip Dress"
            }
          ].map((rev, idx) => (
            <div key={idx} className="bg-white p-8 rounded-sm border border-[#E6DED5] flex flex-col justify-between shadow-sm space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-lg text-[#121214] italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="border-t border-[#F0ECE5] pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-[#121214]">{rev.name}</h4>
                    <p className="text-[11px] text-[#7F7972]">{rev.location}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    <CheckCircle className="w-3 h-3" /> Verified Buyer
                  </span>
                </div>
                <p className="text-[11px] text-[#C5A059] mt-1 font-medium">Item: {rev.item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-semibold">
              Live Feed
            </span>
            <h3 className="font-serif text-2xl text-[#121214]">Follow the Atelier @KRMU</h3>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#121214] hover:text-[#C5A059] uppercase tracking-widest font-semibold"
          >
            <Instagram className="w-4 h-4" />
            <span>Join 48K on Instagram</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[
            "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
          ].map((img, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden bg-neutral-100 rounded-sm">
              <img
                src={img}
                alt="Instagram Lookbook"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

export default function BrandStoryPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Editorial Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-[#121214] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop"
            alt="KRMU Atelier Craftsmanship"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6 pt-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">
            The Atelier Manifesto
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Quiet Opulence in an Age of Noise.
          </h1>
          <p className="text-sm sm:text-base text-[#D4CDC3] font-light leading-relaxed">
            KRMU was founded on a simple realization: when fabric, proportion, and craftsmanship achieve harmony, design needs no shouting.
          </p>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-bold">
              Origin & Ethos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#121214]">
              Born in New Delhi. Tailored for the World.
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5750] leading-relaxed">
              India has fostered the world’s most sophisticated textile traditions for millennia. Yet contemporary global fashion rarely reflects this heritage in minimalist, directional forms.
            </p>
            <p className="text-xs sm:text-sm text-[#5C5750] leading-relaxed">
              KRMU unites ancestral hand-loom sensibilities with brutalist architecture, Savile Row precision, and contemporary tailoring. We produce in intentional, numbered editions of fewer than 50 pieces per silhouette to eliminate waste and celebrate human dexterity.
            </p>
          </div>

          <div className="aspect-[4/5] bg-neutral-200 overflow-hidden rounded-sm shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
              alt="Fabric inspection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Material Virtues */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#E6DED5]">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#121214]">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <h3 className="font-serif text-xl text-[#121214]">Pure Natural Fibers</h3>
            <p className="text-xs text-[#7F7972] leading-relaxed">
              Every garment starts with genuine natural textiles: 100% Normandy flax linen, GOTS organic Supima cotton, pure Grade 6A mulberry silk, and renewable Australian Merino wool. Zero polyester microplastics.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#121214]">
              <Award className="w-5 h-5 text-[#C5A059]" />
            </div>
            <h3 className="font-serif text-xl text-[#121214]">Uncompromising Tailoring</h3>
            <p className="text-xs text-[#7F7972] leading-relaxed">
              French seams that sit flat against the skin, natural horn and corozo buttons, canvas-interfaced lapels that mould to your posture over time, and generous hem allowances for lifetime alterations.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#121214]">
              <Heart className="w-5 h-5 text-[#C5A059]" />
            </div>
            <h3 className="font-serif text-xl text-[#121214]">Dignified Craftsmanship</h3>
            <p className="text-xs text-[#7F7972] leading-relaxed">
              Our atelier master tailors receive triple the living wage standard, comprehensive family healthcare, and safe, sun-drenched workshop environments in Gurugram, India.
            </p>
          </div>
        </div>
      </section>

      {/* Founder's Letter Quote */}
      <section className="bg-[#FAF8F5] border-y border-[#E6DED5] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
            From The Creative Director
          </span>
          <blockquote className="font-serif text-2xl sm:text-3xl text-[#121214] italic leading-relaxed">
            "We do not design for a season or an algorithm. We craft garments that you will still reach for with reverence a decade from today."
          </blockquote>
          <div className="pt-2">
            <p className="font-serif text-lg text-[#121214]">Aria Verma & Samarjit Khurana</p>
            <p className="text-xs text-[#7F7972] uppercase tracking-widest">Founding Designers, KRMU</p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center space-y-6 max-w-xl mx-auto px-4">
        <h3 className="font-serif text-3xl text-[#121214]">Experience the Silhouette</h3>
        <p className="text-xs text-[#7F7972]">
          Discover our latest arrivals tailored with immaculate consideration.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-all text-xs uppercase tracking-[0.25em] font-semibold"
        >
          <span>Explore The Wardrobe</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

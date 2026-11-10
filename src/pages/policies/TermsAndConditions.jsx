import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#121214]">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E]">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <span className="text-[#121214] font-semibold">Policies</span>
        <span>/</span>
        <span className="text-[#121214]">Terms & Conditions</span>
      </nav>

      <div className="space-y-3 border-b border-[#E6DED5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
          Legal Agreement & Service Terms
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#7F7972]">
          Entity: KRMU Apparel Private Limited • Effective: January 1, 2026
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#5C5750] leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">1. Acceptance of Commercial Terms</h2>
          <p>
            By accessing or utilizing the digital boutique at <strong>krmu-apparel.com</strong> ("Website"), or purchasing apparel from <strong>KRMU Apparel Private Limited</strong> ("KRMU", "we", "us", or "our"), you ("Client", "User") agree to be bound unconditionally by these Terms and Conditions. If you do not accept these provisions in their entirety, please refrain from using this service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">2. Pricing & Currency</h2>
          <p>
            All prices displayed on this Website are expressed in <strong>Indian Rupees (INR ₹)</strong> and are fully inclusive of statutory Goods and Services Tax (GST at 12%) as applicable under the laws of the Republic of India. KRMU reserves the unilateral right to amend garment prices and privileges without prior notice; however, completed orders will always be honored at the confirmed checkout price.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">3. Razorpay Payment Gateway Terms</h2>
          <p>
            Online transactions on this boutique are powered by <strong>Razorpay Software Private Limited</strong> ("Razorpay"). By initiating payment:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>You authorize Razorpay and KRMU to charge the designated payment method (UPI, Debit/Credit Card, NetBanking, EMI, or Wallet) for the final order amount.</li>
            <li>All credit/debit card data is tokenized securely under PCI-DSS Level 1 compliance. KRMU never stores your raw card numbers or CVV.</li>
            <li>In the event of an erroneous or duplicate charge, verification and refund will be executed in full concordance with Razorpay's settlement protocols.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">4. Product Descriptions & Color Accuracy</h2>
          <p>
            We take tremendous care to display the true colors, drape, and texture of our textiles. However, because display monitors and mobile screens exhibit subtle chromatic variances, actual garment tones may vary minutely from photographic digital depictions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">5. Intellectual Property Rights</h2>
          <p>
            The "KRMU" trademark, wordmark, logo, visual lookbooks, editorial copy, product designs, and photographic assets are the exclusive intellectual property of KRMU Apparel Private Limited. No reproduction, imitation, or commercial use is permitted without explicit written license.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">6. Limitation of Liability & Governing Law</h2>
          <p>
            In no event shall KRMU, its founders, directors, or master tailors be liable for any indirect, punitive, or consequential damages arising out of the purchase or use of our garments. Our aggregate liability under all circumstances shall not exceed the price actually paid for the specific garment giving rise to the claim.
          </p>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any legal dispute or arbitration arising hereunder shall be subject to the exclusive jurisdiction of the Courts of <strong>New Delhi / Gurugram, Haryana, India</strong>.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-[#E6DED5]">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">7. Legal Correspondence</h2>
          <p>
            Address legal notices to: Legal Directorate, KRMU Apparel Private Limited, Suite 402, Design Boulevard, Sector 48, Gurugram, Haryana 122103, India. Email: <code>legal@krmu-apparel.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#121214]">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E]">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <span className="text-[#121214] font-semibold">Policies</span>
        <span>/</span>
        <span className="text-[#121214]">Privacy Policy</span>
      </nav>

      <div className="space-y-3 border-b border-[#E6DED5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
          Data Protection & Privacy Transparency
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#7F7972]">
          Compliant with Information Technology Act, 2000 & Digital Personal Data Protection Act (DPDPA), 2023
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#5C5750] leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">1. Information We Collect</h2>
          <p>
            When you explore the KRMU boutique, create an account, or acquire garments, we collect information necessary to fulfill your couture orders:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Contact Details:</strong> Full name, billing and physical shipping address, phone number, and email.</li>
            <li><strong>Order History & Preferences:</strong> Garment sizing preferences, wishlist selections, order timeline, and courier notes.</li>
            <li><strong>Device & Analytics:</strong> IP address, browser type, and operating system for anti-fraud validation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">2. Payment Processing Security via Razorpay</h2>
          <p>
            We take financial confidentiality with paramount seriousness. <strong>KRMU does not capture, store, or view your full credit card numbers, debit card PINs, or net banking passwords.</strong>
          </p>
          <p>
            All payment gateway interactions are handed over directly to <strong>Razorpay Software Private Limited</strong>, which holds certified PCI-DSS Level 1 compliance (the most rigorous global security benchmark in payments). Data exchanged during the checkout session is encrypted with 256-bit Secure Socket Layer (SSL) encryption.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">3. Use of Personal Information</h2>
          <p>Your data is used strictly for:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Executing orders, tailoring dispatch, and courier coordination via BlueDart/Delhivery.</li>
            <li>Transmitting real-time SMS and email tracking links for your orders.</li>
            <li>Processing authorized returns and refunds through Razorpay.</li>
            <li>Sending our monthly editorial lookbook (which you may opt out of with a single click).</li>
          </ul>
          <p className="font-medium text-[#121214]">
            We never sell, rent, or trade your personal information to third-party marketing entities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">4. Statutory Grievance Redressal Officer</h2>
          <p>
            In accordance with the Information Technology Act 2000 and the Rules made thereunder, the contact details of the designated Grievance Officer are provided below:
          </p>
          <div className="p-4 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm text-xs space-y-1">
            <p><strong>Grievance Officer:</strong> Rohan Saxena</p>
            <p><strong>Designation:</strong> Head of Client Relations & Privacy Compliance</p>
            <p><strong>Entity:</strong> KRMU Apparel Private Limited</p>
            <p><strong>Atelier Address:</strong> Suite 402, Design Boulevard, Sector 48, Gurugram, Haryana 122103, India</p>
            <p><strong>Email:</strong> <code>grievance@krmu-apparel.com</code></p>
            <p><strong>Phone:</strong> +91 (0) 98765 43210</p>
          </div>
        </section>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Clock, AlertCircle } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#121214]">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E]">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <span className="text-[#121214] font-semibold">Policies</span>
        <span>/</span>
        <span className="text-[#121214]">Cancellation, Return & Refund Policy</span>
      </nav>

      <div className="space-y-3 border-b border-[#E6DED5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
          Razorpay Compliance & Client Assurance
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl">
          Cancellation, Return & Refund Policy
        </h1>
        <p className="text-xs text-[#7F7972]">
          Effective Date: January 1, 2026 • Last Reviewed: November 2026
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#5C5750] leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">1. Order Cancellation Policy</h2>
          <p>
            At KRMU Apparel Private Limited ("KRMU"), we endeavor to dispatch all orders expeditiously. Clients may cancel any confirmed order subject to the following provisions:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong>Prior to Courier Dispatch:</strong> Orders can be cancelled free of charge within your Client Account dashboard or by writing to <code>concierge@krmu-apparel.com</code> before the courier pickup has taken place (usually within 12 to 24 hours of placing the order).
            </li>
            <li>
              <strong>After Courier Dispatch:</strong> Once the parcel is in transit with our logistics partners (BlueDart / Delhivery), cancellation is not permitted. You may however initiate a Return once the parcel is delivered.
            </li>
            <li>
              <strong>Immediate Refund:</strong> For pre-paid orders cancelled before dispatch, a full 100% refund is initiated immediately to your original payment method via the Razorpay gateway.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">2. Return & Exchange Window (7 Calendar Days)</h2>
          <p>
            We take supreme pride in the tailored fit and quality of our garments. If for any reason you are not completely satisfied with your selection, you may request a return or exchange within <strong>7 calendar days</strong> from the recorded date of delivery.
          </p>
          <div className="p-4 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#121214]">Eligibility Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>The garment must be unworn, unwashed, and free of perfumes, makeup, or alterations.</li>
              <li>All original KRMU atelier security ribbons, price tags, and packaging must remain intact.</li>
              <li>Garments marked as "Final Archive Sale" or custom bespoke sizing are non-returnable.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">3. Complimentary Doorstep Reverse Pickup</h2>
          <p>
            We arrange complimentary reverse courier pickups from your address across all serviceable Indian pincodes. Once a return request is submitted:
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>Our courier partner will arrive within 24 to 48 hours to collect the securely packed parcel.</li>
            <li>The parcel travels to our Quality Inspection Atelier in Gurugram, Haryana.</li>
            <li>Inspection is concluded within 2 business days of receipt.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">4. Refund Timelines & Razorpay Processing</h2>
          <p>
            Once our inspection team verifies that the returned garment meets our pristine quality criteria:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong>Online Payments via Razorpay (UPI, Credit/Debit Cards, NetBanking):</strong> In full compliance with RBI regulations and Razorpay merchant operating standards, refunds will be processed and credited back to the customer's original payment method (Bank Account, Credit/Debit Card, UPI, or NetBanking) through Razorpay within <strong>5 to 7 business days</strong> from the date of approval.
            </li>
            <li>
              <strong>Cash on Delivery (COD) Orders:</strong> Refunds for COD orders are transferred via IMPS / NEFT directly into your verified bank account or credited as an Atelier Gift Voucher code based on your preference within 5 to 7 business days.
            </li>
          </ul>

          <div className="p-4 bg-[#FAF8F5] border border-[#E6DED5] rounded-sm space-y-1 text-xs">
            <p className="font-bold uppercase tracking-wider text-[#121214]">Razorpay Merchant Refund Commitment:</p>
            <p className="text-[#5C5750]">
              No deduction or cancellation fee is levied on legitimate cancellations or quality returns. The exact transacted amount in INR (₹) will be reimbursed via Razorpay Payments India Pvt. Ltd.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">5. Damaged, Defective, or Incorrect Pieces</h2>
          <p>
            In the rare instance that a piece arrives damaged during transit or incorrect in size/color, please notify us within 48 hours of delivery at <code>concierge@krmu-apparel.com</code> with photographs. We will immediately expedite a priority replacement or issue an unconditional 100% refund including all shipping costs.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-[#E6DED5]">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">6. Contact Concierge Regarding Refunds</h2>
          <p>
            For any status inquiries on an ongoing refund:
          </p>
          <div className="text-xs space-y-1">
            <p><strong>Merchant Entity:</strong> KRMU Apparel Private Limited</p>
            <p><strong>Email:</strong> <a href="mailto:concierge@krmu-apparel.com" className="underline">concierge@krmu-apparel.com</a></p>
            <p><strong>Telephone:</strong> +91 98765 43210 (10:00 AM – 7:00 PM IST, Mon–Sat)</p>
            <p><strong>Atelier Address:</strong> Suite 402, Design Boulevard, Sector 48, Gurugram, Haryana 122103, India</p>
          </div>
        </section>
      </div>
    </div>
  );
}

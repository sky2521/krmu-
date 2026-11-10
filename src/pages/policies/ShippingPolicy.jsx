import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#121214]">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C867E]">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <span className="text-[#121214] font-semibold">Policies</span>
        <span>/</span>
        <span className="text-[#121214]">Shipping & Delivery Policy</span>
      </nav>

      <div className="space-y-3 border-b border-[#E6DED5] pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
          Razorpay Compliance & Logistics Terms
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-[#7F7972]">
          Effective Date: January 1, 2026 • Courier Network: BlueDart & Delhivery Express
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#5C5750] leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">1. Dispatch & Delivery Timelines (Pan-India)</h2>
          <div className="p-4 bg-[#FAF8F5] border-l-2 border-[#121214] rounded-sm space-y-1 mb-3">
            <p className="font-bold text-xs uppercase tracking-wider text-[#121214]">
              Mandatory Delivery Timeline Notice:
            </p>
            <p className="text-xs text-[#5C5750]">
              The minimum delivery timeline for all domestic orders is <strong>2 business days</strong> and the maximum delivery timeline is <strong>7 business days</strong> from the date of successful order placement.
            </p>
          </div>
          <p>
            Every KRMU garment undergoes rigorous hand-finishing, steam pressing, and strict multi-point quality control before leaving our New Delhi atelier. Orders are processed and dispatched within:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Standard Orders:</strong> Dispatched within 24 to 48 business hours of payment confirmation.</li>
            <li><strong>Bespoke / Sizing Alteration Orders:</strong> Dispatched within 3 to 4 business days.</li>
            <li>Orders placed on Sundays or gazetted public holidays are initiated on the next working business day.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">2. Transit Durations Across India</h2>
          <p>
            We partner exclusively with tier-1 air express courier networks to ensure swift and secure parcel journeys:
          </p>
          <div className="overflow-x-auto border border-[#E6DED5] my-3">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8F5] text-[#121214] border-b border-[#E6DED5] uppercase tracking-wider">
                <tr>
                  <th className="p-3 font-semibold">Destination Region</th>
                  <th className="p-3 font-semibold">Logistics Carrier</th>
                  <th className="p-3 font-semibold">Estimated Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE5]">
                <tr>
                  <td className="p-3 font-medium text-[#121214]">Delhi NCR (Local)</td>
                  <td className="p-3">BlueDart Express Air</td>
                  <td className="p-3 font-bold text-emerald-800">1 to 2 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#121214]">Metro Cities (Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad)</td>
                  <td className="p-3">BlueDart / Delhivery Priority Air</td>
                  <td className="p-3 font-bold text-emerald-800">2 to 3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#121214]">Tier 2 & Tier 3 Rest of India</td>
                  <td className="p-3">Delhivery Express Surface/Air</td>
                  <td className="p-3 font-bold text-[#121214]">3 to 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#121214]">North East & Special Pin Codes</td>
                  <td className="p-3">India Post Speed Post / BlueDart</td>
                  <td className="p-3 font-bold text-[#121214]">5 to 7 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">3. Shipping Fees & Free Delivery Threshold</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong>Complimentary Express Delivery:</strong> Orders exceeding an order value of <strong>₹2,499</strong> automatically receive 100% free pan-India express shipping.
            </li>
            <li>
              <strong>Standard Orders (under ₹2,499):</strong> A nominal flat rate of <strong>₹199</strong> is applied towards logistics packaging and courier handling.
            </li>
            <li>
              <strong>Atelier White Glove Priority Delivery:</strong> Available for <strong>₹499</strong>, which includes bespoke rigid gift boxes, breathable fabric garment covers, premium wooden hangers, and prioritized 24-hr air dispatch.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">4. Real-Time Tracking & Shipment Insurance</h2>
          <p>
            Upon courier pickup from our Gurugram facility, you will receive an automatic dispatch notification containing your unique Courier Tracking Number (AWB) via SMS and Email. You can track parcel milestones in real-time on our <Link to="/track-order" className="underline font-semibold text-black">Order Tracking Page</Link>.
          </p>
          <p>
            All KRMU shipments are 100% insured against loss, theft, or damage during transit until hand-over is recorded with the recipient's OTP or signature.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-[#E6DED5]">
          <h2 className="font-serif text-xl sm:text-2xl text-[#121214]">5. Logistics Support Inquiries</h2>
          <p>
            Should you need to update an address pre-dispatch or check on a delayed courier package, please reach out to our client concierge team:
          </p>
          <div className="text-xs space-y-1">
            <p><strong>Email:</strong> <a href="mailto:concierge@krmu-apparel.com" className="underline">concierge@krmu-apparel.com</a></p>
            <p><strong>Hotline:</strong> +91 98765 43210 (10:00 AM – 7:00 PM IST)</p>
          </div>
        </section>
      </div>
    </div>
  );
}

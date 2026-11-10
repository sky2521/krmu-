import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { submitSupabaseContactInquiry } from '../services/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    await submitSupabaseContactInquiry(formData);
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
  };

  const faqs = [
    {
      q: "What payment methods are supported via Razorpay?",
      a: "Our integrated Razorpay payment gateway accepts all Indian UPI applications (Google Pay, PhonePe, Paytm, CRED, BHIM), Indian and International Credit/Debit Cards (Visa, MasterCard, RuPay, American Express), NetBanking across 50+ banks, Razorpay EMI, and Cash on Delivery (COD)."
    },
    {
      q: "What is your return & exchange window?",
      a: "We offer a complimentary 7-day hassle-free return and exchange policy from the date of recorded delivery. Garments must be unworn, unwashed, and have their original atelier tags attached."
    },
    {
      q: "How long does shipping take across India?",
      a: "Orders are tailored, quality inspected, and dispatched within 24 to 48 hours. Metro deliveries typically arrive within 2-3 business days, while tier-2 and tier-3 cities take 4-5 business days via BlueDart Express."
    },
    {
      q: "Can I cancel my order before dispatch?",
      a: "Yes. You can cancel any order prior to courier dispatch directly from your Client Portal or by emailing concierge@krmu-apparel.com. For paid orders, Razorpay refunds are immediately triggered and take 3-5 business days to credit your bank account."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-bold">
          Concierge & Client Care
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#121214]">
          Contact The KRMU Atelier
        </h1>
        <p className="text-xs sm:text-sm text-[#7F7972] max-w-lg mx-auto">
          Whether you need bespoke sizing counsel, order assistance, or wholesale inquiries, our atelier team is at your disposal.
        </p>
      </div>

      {/* Main Grid: Details + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info & Physical Address */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-sm border border-[#E6DED5] space-y-6">
            <h3 className="font-serif text-2xl text-[#121214] border-b border-[#E6DED5] pb-3">
              Atelier Headquarters
            </h3>

            <div className="space-y-4 text-xs text-[#5C5750]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#121214] uppercase tracking-wider mb-0.5">Physical Atelier</h4>
                  <p>KRMU Apparel Private Limited</p>
                  <p>Suite 402, Design Boulevard, Sector 48</p>
                  <p>Gurugram, Haryana 122103, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#121214] uppercase tracking-wider mb-0.5">Electronic Mail</h4>
                  <p className="text-[#121214]">concierge@krmu-apparel.com</p>
                  <p className="text-[11px] text-[#7F7972]">Response turnaround within 4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#121214] uppercase tracking-wider mb-0.5">Direct Line</h4>
                  <p className="text-[#121214] font-medium">+91 (0) 98765 43210</p>
                  <p className="text-[11px] text-[#7F7972]">WhatsApp concierge available on this line</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#121214] uppercase tracking-wider mb-0.5">Atelier Hours</h4>
                  <p>Monday through Saturday: 10:00 AM – 7:00 PM IST</p>
                  <p className="text-[11px] text-[#7F7972]">Closed on Sundays and National Holidays</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-[#E6DED5] shadow-sm space-y-6">
          <h3 className="font-serif text-2xl text-[#121214] border-b border-[#F0ECE5] pb-3">
            Send a Dispatch to Concierge
          </h3>

          {submitted ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-sm animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-2xl text-emerald-950">Dispatch Transmitted</h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Thank you. An atelier associate has received your inquiry and will respond to your email within 4 business hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 bg-[#121214] text-white text-xs uppercase tracking-widest"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kabir Mehra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3 py-2.5 focus:outline-none focus:border-black"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Sizing & Fitting Advice">Sizing & Fitting Advice</option>
                    <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                    <option value="Return & Exchange Request">Return & Exchange Request</option>
                    <option value="Razorpay Payment Verification">Razorpay Payment Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1 font-medium">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide any details regarding your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] p-3 focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="border-t border-[#E6DED5] pt-12 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C867E] font-semibold">
            Common Inquiries
          </span>
          <h2 className="font-serif text-3xl text-[#121214]">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-[#E6DED5] rounded-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 flex items-center justify-between text-xs font-semibold text-[#121214] hover:bg-[#FAF8F5] transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-[#8C867E]" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-[#5C5750] leading-relaxed border-t border-[#F0ECE5]">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

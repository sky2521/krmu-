import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Building2, Smartphone, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function RazorpayGatewayModal({ isOpen, onClose, amount, orderId, customer, onSuccess }) {
  const [activeTab, setActiveTab] = useState('upi'); // upi, card, netbanking
  const [upiId, setUpiId] = useState('kabir@oksbi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const paymentResponse = {
        razorpay_payment_id: `pay_${Date.now()}_rzp`,
        razorpay_order_id: `order_${orderId}`,
        razorpay_signature: `sig_${Math.random().toString(36).substring(2, 15)}`,
        method: activeTab.toUpperCase(),
        status: "captured",
        timestamp: new Date().toISOString()
      };
      onSuccess(paymentResponse);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border border-neutral-200">
        {/* Razorpay Top Header */}
        <div className="bg-[#0c2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#0d3b66] flex items-center justify-center font-bold text-lg text-[#58a6ff]">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#58a6ff] font-semibold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Trusted Business
              </div>
              <h3 className="font-semibold text-sm text-white">KRMU Haute Apparel</h3>
              <p className="text-[11px] text-neutral-300">Order #{orderId}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase text-neutral-400">Amount Due</div>
            <div className="text-xl font-bold text-white">₹{amount.toLocaleString('en-IN')}.00</div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white mt-1 p-0.5 rounded transition-colors inline-block"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payment Methods Sidebar & Body */}
        <div className="grid grid-cols-12 min-h-[340px]">
          {/* Method Tabs */}
          <div className="col-span-4 bg-[#F8FAFC] border-r border-neutral-200 py-3">
            <button
              onClick={() => setActiveTab('upi')}
              className={`w-full text-left px-4 py-3 flex items-center space-x-2 text-xs font-medium transition-colors ${
                activeTab === 'upi'
                  ? 'bg-white text-[#0d3b66] border-l-4 border-[#0d3b66] shadow-sm font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>UPI / QR</span>
            </button>

            <button
              onClick={() => setActiveTab('card')}
              className={`w-full text-left px-4 py-3 flex items-center space-x-2 text-xs font-medium transition-colors ${
                activeTab === 'card'
                  ? 'bg-white text-[#0d3b66] border-l-4 border-[#0d3b66] shadow-sm font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setActiveTab('netbanking')}
              className={`w-full text-left px-4 py-3 flex items-center space-x-2 text-xs font-medium transition-colors ${
                activeTab === 'netbanking'
                  ? 'bg-white text-[#0d3b66] border-l-4 border-[#0d3b66] shadow-sm font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="col-span-8 p-5 flex flex-col justify-between">
            {activeTab === 'upi' && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-emerald-300">
                    <QrCode className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-950">Scan QR via any UPI App</p>
                    <p className="text-[11px] text-emerald-700">Google Pay, PhonePe, Paytm, CRED</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Or Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-[#0d3b66]"
                    placeholder="mobilenumber@upi"
                  />
                  <div className="flex gap-2 mt-2">
                    {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((suf) => (
                      <button
                        key={suf}
                        type="button"
                        onClick={() => setUpiId(customer.phone ? `${customer.phone.replace(/[^0-9]/g, '')}${suf}` : `client${suf}`)}
                        className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200"
                      >
                        {suf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-800 focus:outline-none focus:border-[#0d3b66]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-800 focus:outline-none focus:border-[#0d3b66]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono text-neutral-800 focus:outline-none focus:border-[#0d3b66]"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Razorpay tokenization enabled. Card details are encrypted end-to-end.
                </p>
              </div>
            )}

            {activeTab === 'netbanking' && (
              <div className="space-y-3">
                <label className="block text-[11px] font-semibold text-neutral-600">Select Popular Indian Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded text-left text-xs border transition-all ${
                          selectedBank === bank
                            ? 'border-[#0d3b66] bg-[#F0F7FF] text-[#0d3b66] font-semibold'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Pay CTA */}
            <div className="pt-4 mt-auto border-t border-neutral-100 space-y-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full py-3 bg-[#0c2340] hover:bg-[#1a3a60] text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#58a6ff]" />
                    <span>Authorizing with Razorpay...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{amount.toLocaleString('en-IN')}.00</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>Test Mode Sandbox Active</span>
                <span>PCI-DSS Level 1 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

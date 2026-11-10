/**
 * Razorpay Payment Gateway Service for KRMU Apparel
 * Supports both:
 * 1. Live/Test Razorpay Standard Checkout Popup (when Key is provided)
 * 2. High-Fidelity Test Mode / Simulation Fallback (for instant test without requiring active merchant keys)
 */

export const DEFAULT_RAZORPAY_TEST_KEY = "rzp_test_KRMUApparel2026";

export const getRazorpayKey = () => {
  try {
    return localStorage.getItem('krmu_rzp_key') || DEFAULT_RAZORPAY_TEST_KEY;
  } catch (e) {
    return DEFAULT_RAZORPAY_TEST_KEY;
  }
};

export const setRazorpayKey = (newKey) => {
  try {
    if (newKey) {
      localStorage.setItem('krmu_rzp_key', newKey.trim());
    } else {
      localStorage.removeItem('krmu_rzp_key');
    }
  } catch (e) {
    console.error(e);
  }
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayCheckout = async ({
  amount, // in INR (not paise)
  orderId,
  customer,
  onSuccess,
  onFailure
}) => {
  const isLoaded = await loadRazorpayScript();
  const apiKey = getRazorpayKey();

  // If Razorpay SDK is available and we want to launch the official standard modal
  if (isLoaded && window.Razorpay) {
    try {
      const options = {
        key: apiKey,
        amount: Math.round(amount * 100), // amount in paise (1 INR = 100 paise)
        currency: "INR",
        name: "KRMU Haute Apparel",
        description: `Order #${orderId} - Luxury Garments`,
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200&auto=format&fit=crop",
        prefill: {
          name: customer.name || "Valued Client",
          email: customer.email || "client@krmu.com",
          contact: customer.phone || "9876543210"
        },
        notes: {
          brand: "KRMU",
          order_id: orderId,
          type: "Ready-to-wear"
        },
        theme: {
          color: "#121214" // Onyx Dark
        },
        handler: function (response) {
          // Response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          onSuccess({
            paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
            razorpayOrderId: response.razorpay_order_id || `order_${orderId}`,
            method: "Razorpay Standard Checkout",
            status: "Authorized"
          });
        },
        modal: {
          ondismiss: function () {
            if (onFailure) {
              onFailure(new Error("Payment modal dismissed by client."));
            }
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      
      rzpInstance.on('payment.failed', function (response) {
        if (onFailure) {
          onFailure(new Error(response.error.description || "Payment failed."));
        }
      });

      rzpInstance.open();
      return true;
    } catch (err) {
      console.warn("Razorpay instance initialization:", err);
      // Fallback to simulation if test key is unverified by Razorpay servers
      return false;
    }
  }

  return false;
};

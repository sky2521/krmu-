/**
 * Razorpay Standard Web Checkout Integration for KRMU Atelier
 * Follows the official 3-step Standard Checkout flow:
 * 1. Backend Order Creation (POST /api/create-order)
 * 2. Razorpay Standard Checkout Popup (checkout.js with server order_id)
 * 3. Backend HMAC-SHA256 Signature Verification (POST /api/verify-payment)
 */

export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TyUHs3V5mxoR4o';

export const DEFAULT_RAZORPAY_TEST_KEY = RAZORPAY_KEY_ID;

export const getRazorpayKey = () => {
  try {
    return localStorage.getItem('krmu_rzp_key') || RAZORPAY_KEY_ID;
  } catch (e) {
    return RAZORPAY_KEY_ID;
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

/**
 * Step 2 helper: dynamically injects the official Razorpay checkout script
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK from checkout.razorpay.com');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Step 1: Call backend to create a genuine Razorpay Order
 * @param {number} amountInRupees - Amount in INR
 * @param {string} receipt - Unique order/receipt identifier
 */
export const createRazorpayOrder = async (amountInRupees, receipt) => {
  const amountInPaise = Math.round(Number(amountInRupees) * 100);

  if (amountInPaise < 100) {
    throw new Error('Minimum order amount must be at least ₹1.00 (100 paise).');
  }

  // Attempt API endpoints: standard /api/create-order or Netlify function
  const endpoints = ['/api/create-order', '/.netlify/functions/create-order'];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to create order`);
      }

      const data = await response.json();
      return data; // { order_id, amount, currency }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to backend order creation endpoint.');
};

/**
 * Step 3: Call backend to verify HMAC-SHA256 signature
 */
export const verifyRazorpayPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}) => {
  const endpoints = ['/api/verify-payment', '/.netlify/functions/verify-payment'];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment signature verification failed.');
      }

      return data;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Payment verification service unreachable.');
};

/**
 * Full Razorpay Standard Checkout Flow:
 * 1. Load SDK
 * 2. Create order on backend (receives order_id)
 * 3. Launch Razorpay modal with order_id
 * 4. Verify payment signature on backend on handler() callback
 */
export const initiateRazorpayCheckout = async ({
  amount, // in INR (Rupees)
  receipt,
  customer = {},
  notes = {},
  onSuccess,
  onFailure
}) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
    }

    const keyId = getRazorpayKey();

    // 1. BACKEND: Create Order (amount in paise, min 100 paise)
    const orderData = await createRazorpayOrder(amount, receipt);
    const { order_id } = orderData;

    // 2. FRONTEND: Open Checkout Modal with order_id
    const options = {
      key: keyId,
      amount: orderData.amount, // in paise
      currency: orderData.currency || 'INR',
      name: 'KRMU Haute Apparel',
      description: `Order #${receipt || order_id} - Atelier Garments`,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200&auto=format&fit=crop',
      order_id: order_id, // Server generated order_id
      prefill: {
        name: customer.name || 'Valued Client',
        email: customer.email || 'client@krmu-apparel.com',
        contact: customer.phone || '9876543210'
      },
      notes: {
        brand: 'KRMU Atelier',
        receipt: receipt || order_id,
        ...notes
      },
      theme: {
        color: '#121214'
      },
      // Handler receives payment response from Razorpay
      handler: async function (response) {
        try {
          // 3. BACKEND: Verify Signature
          const verifyResult = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (onSuccess) {
            onSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              method: 'Razorpay Standard Checkout',
              status: 'Authorized',
              verification: verifyResult
            });
          }
        } catch (verifyError) {
          console.error('Signature verification failed:', verifyError);
          if (onFailure) {
            onFailure(new Error(verifyError.message || 'Payment signature mismatch. Order rejected.'));
          }
        }
      },
      modal: {
        ondismiss: function () {
          if (onFailure) {
            onFailure(new Error('Checkout cancelled by client.'));
          }
        }
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (resp) {
      console.error('Razorpay payment.failed:', resp.error);
      if (onFailure) {
        onFailure(new Error(resp.error?.description || 'Payment transaction failed.'));
      }
    });

    rzp.open();
    return true;
  } catch (error) {
    console.error('initiateRazorpayCheckout error:', error);
    if (onFailure) {
      onFailure(error);
    }
    return false;
  }
};

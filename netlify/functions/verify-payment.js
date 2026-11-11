import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import Razorpay from 'razorpay';

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ success: false, verified: false, error: 'Server configuration error: Key Secret missing.' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    if (!order_id || !payment_id || !signature) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, verified: false, error: 'Missing required parameters' })
      };
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    const isSignatureValid =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature, 'utf-8'), Buffer.from(signature, 'utf-8'));

    if (!isSignatureValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, verified: false, error: 'Signature mismatch' })
      };
    }

    let paymentSummary = null;
    if (keyId && payment_id) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const rzpPayment = await razorpay.payments.fetch(payment_id);
        paymentSummary = {
          method: rzpPayment.method || 'razorpay',
          status: rzpPayment.status || 'authorized',
          amount_paise: Number(rzpPayment.amount || 0),
          currency: rzpPayment.currency || 'INR',
          fee_paise: Number(rzpPayment.fee || 0),
          tax_paise: Number(rzpPayment.tax || 0),
          method_detail: {
            ...(rzpPayment.vpa ? { vpa: rzpPayment.vpa } : {}),
            ...(rzpPayment.bank ? { bank: rzpPayment.bank } : {}),
            ...(rzpPayment.wallet ? { wallet: rzpPayment.wallet } : {}),
            ...(rzpPayment.card
              ? {
                  card_network: rzpPayment.card.network || null,
                  card_last4: rzpPayment.card.last4 || null,
                  card_type: rzpPayment.card.type || null
                }
              : {})
          },
          acquirer_data: rzpPayment.acquirer_data || {}
        };
      } catch (e) {
        // Non-blocking
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        verified: true,
        verification_source: 'hmac_sha256_server',
        verified_at: new Date().toISOString(),
        order_id,
        payment_id,
        payment: paymentSummary,
        message: 'Payment verified successfully'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, verified: false, error: err.message })
    };
  }
};

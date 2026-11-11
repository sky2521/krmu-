import dotenv from 'dotenv';
dotenv.config();
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

  if (!keyId || !keySecret) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'Razorpay credentials are not configured on server.' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const amount = Number(body.amount);
    const currency = (body.currency || 'INR').toUpperCase();
    const receipt = String(body.receipt || `rcpt_${Date.now()}`).slice(0, 40);

    if (!amount || Number.isNaN(amount) || amount < 100) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Amount must be at least 100 paise (₹1.00).' })
      };
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const sanitizedNotes =
      body.notes && typeof body.notes === 'object'
        ? Object.fromEntries(
            Object.entries(body.notes)
              .slice(0, 12)
              .map(([k, v]) => [String(k).slice(0, 64), String(v ?? '').slice(0, 250)])
          )
        : { service: 'KRMU Atelier Checkout' };

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      payment_capture: 1,
      notes: sanitizedNotes
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        key_id: keyId,
        mode: keyId.startsWith('rzp_live_') ? 'live' : 'test'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.error?.description || err.message || 'Order creation error' })
    };
  }
};

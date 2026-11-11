import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-razorpay-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const sig = event.headers?.['x-razorpay-signature'] || event.headers?.['X-Razorpay-Signature'];
  if (!secret) {
    return { statusCode: 503, headers, body: JSON.stringify({ error: 'Webhook secret missing' }) };
  }

  try {
    if (sig) {
      const expected = crypto.createHmac('sha256', secret).update(event.body || '').digest('hex');
      const valid =
        expected.length === sig.length &&
        crypto.timingSafeEqual(Buffer.from(expected, 'utf-8'), Buffer.from(sig, 'utf-8'));
      if (!valid) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid webhook signature' }) };
      }
    }

    const payload = JSON.parse(event.body || '{}');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true, event: payload.event || 'unknown' })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};

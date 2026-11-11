import dotenv from 'dotenv';
dotenv.config();
import Razorpay from 'razorpay';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(503).json({
      error: 'Razorpay API credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not configured on server.'
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const amount = Number(body.amount);
    const currency = (body.currency || 'INR').toUpperCase();
    const receipt = String(body.receipt || `rcpt_${Date.now()}`).slice(0, 40);

    if (!amount || Number.isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid or missing amount parameter.' });
    }

    const amountInPaise = Math.round(amount);
    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Minimum amount must be at least 100 paise (₹1.00).' });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const sanitizedNotes =
      body.notes && typeof body.notes === 'object'
        ? Object.fromEntries(
            Object.entries(body.notes)
              .slice(0, 12)
              .map(([k, v]) => [String(k).slice(0, 64), String(v ?? '').slice(0, 250)])
          )
        : { service: 'KRMU Atelier Checkout' };

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt,
      payment_capture: 1,
      notes: sanitizedNotes
    });

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      created_at: order.created_at,
      key_id: keyId,
      mode: keyId.startsWith('rzp_live_') ? 'live' : 'test'
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);

    if (
      error.statusCode === 401 ||
      (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description?.includes('auth'))
    ) {
      return res.status(401).json({ error: 'Razorpay authentication failed. Verify API credentials.' });
    }

    return res.status(500).json({
      error: error.error?.description || error.message || 'Failed to create Razorpay order',
      details: error.error || null
    });
  }
}

import dotenv from 'dotenv';
dotenv.config();
import Razorpay from 'razorpay';

export default async function handler(req, res) {
  // Support both GET (for health check) and POST
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TyUHs3V5mxoR4o';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '6OLsRKPRNu2OopLduIylC9Hr';

  if (!keyId || !keySecret) {
    return res.status(401).json({ error: 'Razorpay API credentials missing on server.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // keep as is
      }
    }
    body = body || {};

    let amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `rcpt_${Date.now()}`;

    // If amount is not provided or NaN
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid or missing amount parameter.' });
    }

    // If amount is provided in Rupees (e.g. 5000), check if client passed paise or rupees.
    // Standard spec says amount in paise, min 100 paise.
    // If client passes amount in paise (e.g. 100 or 500000):
    let amountInPaise = Math.round(amount);

    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Minimum amount must be at least 100 paise (₹1.00).' });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
      notes: body.notes || { service: 'KRMU Atelier Checkout' }
    };

    const order = await razorpay.orders.create(options);

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);

    if (error.statusCode === 401 || (error.error && error.error.code === 'BAD_REQUEST_ERROR' && error.error.description?.includes('auth'))) {
      return res.status(401).json({ error: 'Razorpay authentication failed. Invalid API credentials.' });
    }

    return res.status(500).json({
      error: error.message || 'Failed to create Razorpay order',
      details: error.error || null
    });
  }
}

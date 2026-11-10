import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET || '6OLsRKPRNu2OopLduIylC9Hr';

  if (!keySecret) {
    return res.status(500).json({ error: 'Server configuration error: RAZORPAY_KEY_SECRET missing.' });
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

    const razorpayOrderId = body.razorpay_order_id || body.order_id;
    const razorpayPaymentId = body.razorpay_payment_id || body.payment_id;
    const razorpaySignature = body.razorpay_signature || body.signature;

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    // Safe comparison: check lengths before timingSafeEqual to avoid RangeError
    let isSignatureValid = false;
    if (expectedSignature.length === razorpaySignature.length) {
      isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(razorpaySignature, 'utf-8')
      );
    }

    if (isSignatureValid) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json({
        success: true,
        message: 'Payment signature verified successfully',
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId
      });
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed: Signature mismatch. Payment has not been marked as paid.'
      });
    }
  } catch (error) {
    console.error('Payment Signature Verification Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during signature verification'
    });
  }
}

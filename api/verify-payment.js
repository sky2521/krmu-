import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import Razorpay from 'razorpay';

function buildSafePaymentSummary(rzpPayment) {
  if (!rzpPayment) return null;
  const methodDetail = {};
  if (rzpPayment.vpa) methodDetail.vpa = rzpPayment.vpa;
  if (rzpPayment.bank) methodDetail.bank = rzpPayment.bank;
  if (rzpPayment.wallet) methodDetail.wallet = rzpPayment.wallet;
  if (rzpPayment.card) {
    methodDetail.card_network = rzpPayment.card.network || null;
    methodDetail.card_last4 = rzpPayment.card.last4 || null;
    methodDetail.card_type = rzpPayment.card.type || null;
    methodDetail.issuer = rzpPayment.card.issuer || null;
  }

  return {
    method: rzpPayment.method || 'razorpay',
    status: rzpPayment.status || 'authorized',
    amount_paise: Number(rzpPayment.amount || 0),
    currency: rzpPayment.currency || 'INR',
    fee_paise: Number(rzpPayment.fee || 0),
    tax_paise: Number(rzpPayment.tax || 0),
    email: rzpPayment.email || null,
    contact: rzpPayment.contact || null,
    method_detail: methodDetail,
    acquirer_data: rzpPayment.acquirer_data || {}
  };
}

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

  if (!keySecret) {
    return res.status(503).json({
      success: false,
      verified: false,
      error: 'Server configuration error: RAZORPAY_KEY_SECRET is not configured.'
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

    const razorpayOrderId = body.razorpay_order_id || body.order_id;
    const razorpayPaymentId = body.razorpay_payment_id || body.payment_id;
    const razorpaySignature = body.razorpay_signature || body.signature;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
      });
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    let isSignatureValid = false;
    if (expectedSignature.length === razorpaySignature.length) {
      isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(razorpaySignature, 'utf-8')
      );
    }

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Payment verification failed: Cryptographic signature mismatch.'
      });
    }

    let paymentSummary = null;
    if (keyId && razorpayPaymentId) {
      try {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const rzpPayment = await razorpay.payments.fetch(razorpayPaymentId);
        paymentSummary = buildSafePaymentSummary(rzpPayment);
      } catch (fetchErr) {
        console.warn('Non-blocking Razorpay payment fetch warning:', fetchErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      verified: true,
      verification_source: 'hmac_sha256_server',
      verified_at: new Date().toISOString(),
      message: 'Payment signature cryptographically verified via HMAC-SHA256',
      order_id: razorpayOrderId,
      payment_id: razorpayPaymentId,
      payment: paymentSummary
    });
  } catch (error) {
    console.error('Payment Signature Verification Error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: 'Internal server error during signature verification'
    });
  }
}

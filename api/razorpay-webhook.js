import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-razorpay-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (!webhookSecret) {
    return res.status(503).json({ error: 'Webhook secret not configured.' });
  }

  try {
    const rawBody =
      typeof req.rawBody === 'string'
        ? req.rawBody
        : typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body || {});

    if (signature) {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const valid =
        expected.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(expected, 'utf-8'), Buffer.from(signature, 'utf-8'));

      if (!valid) {
        return res.status(400).json({ received: false, error: 'Invalid Razorpay webhook signature' });
      }
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const eventName = payload.event || 'unknown';
    const paymentEntity = payload.payload?.payment?.entity || null;

    // Optional privileged Supabase reconciliation if SUPABASE_SERVICE_ROLE_KEY is provisioned
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey && paymentEntity?.order_id) {
      const targetStatus =
        eventName === 'payment.captured' || eventName === 'order.paid'
          ? 'captured'
          : eventName === 'payment.failed'
          ? 'failed'
          : paymentEntity.status || 'authorized';

      await fetch(
        `${supabaseUrl}/rest/v1/payment_transactions?razorpay_order_id=eq.${encodeURIComponent(
          paymentEntity.order_id
        )}`,
        {
          method: 'PATCH',
          headers: {
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: targetStatus,
            razorpay_payment_id: paymentEntity.id,
            signature_verified: targetStatus === 'captured',
            verification_source: 'razorpay_webhook',
            fee_paise: Number(paymentEntity.fee || 0),
            tax_paise: Number(paymentEntity.tax || 0),
            updated_at: new Date().toISOString()
          })
        }
      ).catch((e) => console.warn('Webhook Supabase sync warning:', e.message));
    }

    return res.status(200).json({
      received: true,
      event: eventName,
      payment_id: paymentEntity?.id || null
    });
  } catch (err) {
    console.error('Razorpay webhook error:', err);
    return res.status(500).json({ received: false, error: err.message });
  }
}

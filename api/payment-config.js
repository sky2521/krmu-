import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);

  return res.status(200).json({
    configured: Boolean(keyId && hasSecret),
    key_id: keyId || null,
    mode: keyId.startsWith('rzp_live_') ? 'live' : 'test',
    currency: 'INR',
    backend: 'Node.js Razorpay REST API',
    supported_methods: ['upi', 'card', 'netbanking', 'wallet', 'emi', 'cod']
  });
}

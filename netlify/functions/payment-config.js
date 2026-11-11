import dotenv from 'dotenv';
dotenv.config();

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      configured: Boolean(keyId && hasSecret),
      key_id: keyId || null,
      mode: keyId.startsWith('rzp_live_') ? 'live' : 'test',
      currency: 'INR',
      backend: 'Netlify Serverless Razorpay API',
      supported_methods: ['upi', 'card', 'netbanking', 'wallet', 'emi', 'cod']
    })
  };
};

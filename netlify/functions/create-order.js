import dotenv from 'dotenv';
dotenv.config();
import Razorpay from 'razorpay';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TyUHs3V5mxoR4o';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '6OLsRKPRNu2OopLduIylC9Hr';

  if (!keyId || !keySecret) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Razorpay credentials missing on server.' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `rcpt_${Date.now()}`;

    if (!amount || isNaN(amount) || amount < 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Amount must be at least 100 paise.' })
      };
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Order creation error' })
    };
  }
};

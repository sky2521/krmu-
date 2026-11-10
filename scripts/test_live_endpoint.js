import crypto from 'crypto';

async function run() {
  const order_id = 'order_TyUREhKW7JDMmB';
  const payment_id = 'pay_test_987654';
  const signature = crypto
    .createHmac('sha256', '6OLsRKPRNu2OopLduIylC9Hr')
    .update(`${order_id}|${payment_id}`)
    .digest('hex');

  const resp = await fetch('http://localhost:3000/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: order_id,
      razorpay_payment_id: payment_id,
      razorpay_signature: signature
    })
  });

  const data = await resp.json();
  console.log('LIVE VITE VERIFICATION STATUS:', resp.status, data);
}

run().catch(console.error);

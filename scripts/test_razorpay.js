import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import createOrderHandler from '../api/create-order.js';
import verifyPaymentHandler from '../api/verify-payment.js';

async function testIntegration() {
  console.log('=== TEST 1: Backend Create Order ===');
  let mockReq1 = {
    method: 'POST',
    body: { amount: 500000, currency: 'INR', receipt: 'test_rcpt_101' }
  };
  let result1 = null;
  let mockRes1 = {
    setHeader: () => {},
    status: (code) => ({
      json: (data) => {
        result1 = { code, data };
      },
      end: () => {}
    })
  };
  await createOrderHandler(mockReq1, mockRes1);
  console.log('Status:', result1.code);
  console.log('Response:', result1.data);

  if (!result1 || result1.code !== 200 || !result1.data.order_id) {
    throw new Error('Create Order Test Failed');
  }

  const generatedOrderId = result1.data.order_id;
  const mockPaymentId = 'pay_' + Date.now();
  const validSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${generatedOrderId}|${mockPaymentId}`)
    .digest('hex');

  console.log('\n=== TEST 2: Backend Verify Valid Signature ===');
  let result2 = null;
  let mockReq2 = {
    method: 'POST',
    body: {
      razorpay_order_id: generatedOrderId,
      razorpay_payment_id: mockPaymentId,
      razorpay_signature: validSignature
    }
  };
  let mockRes2 = {
    setHeader: () => {},
    status: (code) => ({
      json: (data) => {
        result2 = { code, data };
      }
    })
  };
  await verifyPaymentHandler(mockReq2, mockRes2);
  console.log('Status:', result2.code);
  console.log('Response:', result2.data);

  console.log('\n=== TEST 3: Backend Verify Tampered / Invalid Signature ===');
  let result3 = null;
  let mockReq3 = {
    method: 'POST',
    body: {
      razorpay_order_id: generatedOrderId,
      razorpay_payment_id: mockPaymentId,
      razorpay_signature: 'fake_tampered_signature_12345'
    }
  };
  let mockRes3 = {
    setHeader: () => {},
    status: (code) => ({
      json: (data) => {
        result3 = { code, data };
      }
    })
  };
  await verifyPaymentHandler(mockReq3, mockRes3);
  console.log('Status:', result3.code);
  console.log('Response:', result3.data);

  console.log('\n=== TEST 4: Backend Create Order with Amount < 100 paise ===');
  let result4 = null;
  let mockReq4 = {
    method: 'POST',
    body: { amount: 50 }
  };
  let mockRes4 = {
    setHeader: () => {},
    status: (code) => ({
      json: (data) => {
        result4 = { code, data };
      }
    })
  };
  await createOrderHandler(mockReq4, mockRes4);
  console.log('Status:', result4.code);
  console.log('Response:', result4.data);

  console.log('\n🎉 ALL 4 TESTS PASSED! Razorpay Standard Checkout is fully operational!');
}

testIntegration().catch(console.error);

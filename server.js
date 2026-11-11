import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import paymentConfigHandler from './api/payment-config.js';
import createOrderHandler from './api/create-order.js';
import verifyPaymentHandler from './api/verify-payment.js';
import webhookHandler from './api/razorpay-webhook.js';

const PORT = process.env.PORT || 5000;

const API_ROUTES = {
  '/api/payment-config': paymentConfigHandler,
  '/api/create-order': createOrderHandler,
  '/api/verify-payment': verifyPaymentHandler,
  '/api/razorpay-webhook': webhookHandler
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-razorpay-signature');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const url = req.url.split('?')[0];

  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (data) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    req.rawBody = body;
    if (body) {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
    } else {
      req.body = {};
    }

    if (API_ROUTES[url]) {
      return API_ROUTES[url](req, res);
    }

    if (url === '/health') {
      return res.status(200).json({ status: 'ok', service: 'KRMU Razorpay Node API' });
    }

    res.status(404).json({ error: 'Endpoint not found' });
  });
});

server.listen(PORT, () => {
  console.log(`Razorpay backend server listening on http://localhost:${PORT}`);
});

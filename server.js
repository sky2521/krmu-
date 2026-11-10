import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import createOrderHandler from './api/create-order.js';
import verifyPaymentHandler from './api/verify-payment.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const url = req.url.split('?')[0];

  // Helper response wrapper
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
    if (body) {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
    } else {
      req.body = {};
    }

    if (url === '/api/create-order') {
      return createOrderHandler(req, res);
    }

    if (url === '/api/verify-payment') {
      return verifyPaymentHandler(req, res);
    }

    if (url === '/health') {
      return res.status(200).json({ status: 'ok', service: 'KRMU Razorpay Backend' });
    }

    res.status(404).json({ error: 'Endpoint not found' });
  });
});

server.listen(PORT, () => {
  console.log(`Razorpay backend server listening on http://localhost:${PORT}`);
});

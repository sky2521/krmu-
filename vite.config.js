import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
dotenv.config();

const API_MODULE_MAP = {
  '/api/payment-config': './api/payment-config.js',
  '/api/create-order': './api/create-order.js',
  '/api/verify-payment': './api/verify-payment.js',
  '/api/razorpay-webhook': './api/razorpay-webhook.js'
};

function razorpayApiPlugin() {
  return {
    name: 'razorpay-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url.split('?')[0];
        const modulePath = API_MODULE_MAP[url];

        if (!modulePath) {
          return next();
        }

        try {
          const { default: handler } = await import(modulePath);
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            req.rawBody = body;
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch {
              req.body = {};
            }
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            await handler(req, res);
          });
        } catch (e) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), razorpayApiPlugin()],
  server: {
    port: 3000,
    host: true,
    open: false
  }
});

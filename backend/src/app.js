import express from 'express';
import cors from 'cors';
import { ApiError } from './utils/ApiError.js';
import userRoute from './features/user/routes/user.route.js';
import vendorRoute from './features/vendor/routes/vendor.route.js';
import adminRoute from './features/admin/routes/admin.route.js';
import orderRoute from './features/order/order.route.js';
import handleStripeWebhook from './features/webhook/webhook.controller.js';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
const app = express();
//middleware

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
//routes
app.use('/api/admin', adminRoute);
app.use('/api/user', userRoute);
app.use('/api/vendor', vendorRoute);
app.use('/api/order', orderRoute);

app.use('/webhook', handleStripeWebhook);

//error handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(401).json({ message: err.message });
  }
});

export default app;

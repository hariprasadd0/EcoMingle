// src/redux/slices/paymentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to create a Payment Intent
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Adjust based on your auth
        },
      };

      const { data } = await axios.post(
        `/api/orders/${orderId}/payment`,
        {},
        config,
      );
      return data; // Assuming data contains client_secret
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
  },
);

// Async thunk to confirm payment
export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async ({ paymentIntentId, orderId }, { getState, rejectWithValue }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/orders/confirm-payment',
        {
          paymentIntentId,
          orderId,
          paymentMethod: 'card', // Adjust as needed
        },
        config,
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      );
    }
  },
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    clientSecret: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPayment: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createPaymentIntent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.client_secret;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle confirmPayment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Optionally, store any returned data
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;

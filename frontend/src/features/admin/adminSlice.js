import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getAllUsers } from './api/api';

const initialState = {
  totalRevenue: null,
  orders: null,
  customerCount: 0,
  productsCount: 0,
};

export const getCustomerCount = createAsyncThunk(
  'admin/getCustomerCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers();
      const users = response?.data?.data?.users;
      const count = users.length;
      return count;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
export const getProductsCount = createAsyncThunk(
  'admin/getProductsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProducts();
      const products = response?.data?.data;
      const count = products?.length;
      return count;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCustomerCount.fulfilled, (state, action) => {
      state.customerCount = action.payload;
    });
    builder.addCase(getProductsCount.fulfilled, (state, action) => {
      state.productsCount = action.payload;
    });
  },
});

export default adminSlice;

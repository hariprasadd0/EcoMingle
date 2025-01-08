import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import TokenService from '../../services/auth.service';
import { addNewProduct, vendorLogin, vendorRegister } from './api/api';

const initialState = {
  vendor: TokenService.getUser('vendor') || null,
  isAuth: false,
  success: false,
  error: null,
};

export const registerVendor = createAsyncThunk(
  'vendor/registerVendpr',
  async (data, { rejectWithValue }) => {
    try {
      const response = await vendorRegister(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const loginVendor = createAsyncThunk(
  'vendor/loginVendor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await vendorLogin(data);
      TokenService.setVendor(response?.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const addProduct = createAsyncThunk(
  'vendor/addProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await addNewProduct(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginVendor.fulfilled, (state, action) => {
      state.isAuth = true;
      state.vendor = action.payload?.data;
    });
    builder.addCase(registerVendor.fulfilled, (state, action) => {
      state.success = true;
    });
    builder.addCase(registerVendor.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default vendorSlice;

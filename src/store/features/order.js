import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from '@/api/order.api';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderAPI.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderAPI.getMine();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orderState',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
  .addCase(fetchOrders.pending, (state) => ({ ...state, loading: true, error: null }))
  .addCase(fetchOrders.fulfilled, (state, action) => ({ ...state, loading: false, orders: action.payload }))
  .addCase(fetchOrders.rejected, (state, action) => ({ ...state, loading: false, error: action.payload }))

  // my orders
  .addCase(fetchMyOrders.pending, (state) => ({ ...state, loading: true, error: null }))
  .addCase(fetchMyOrders.fulfilled, (state, action) => ({ ...state, loading: false, myOrders: action.payload }))
  .addCase(fetchMyOrders.rejected, (state, action) => ({ ...state, loading: false, error: action.payload }));
  },
});

export const selectOrders = (state) => state?.orderState?.orders ?? [];
export const selectMyOrders = (state) => state?.orderState?.myOrders ?? [];
export default orderSlice.reducer;

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
  reducers: {
    // Mark a specific order item as reviewed locally
    setOrderItemReviewed(state, action) {
      const { orderId, orderItemId, isReviewed = true } = action.payload || {};
      const updateList = (list) => {
        if (!Array.isArray(list)) return;
        const idx = list.findIndex(o => String(o.id) === String(orderId));
        if (idx === -1) return;
        const order = list[idx];
        if (!order || !Array.isArray(order.orderItems)) return;
        const itemIdx = order.orderItems.findIndex(it => String(it.id) === String(orderItemId));
        if (itemIdx === -1) return;
        order.orderItems[itemIdx] = { ...order.orderItems[itemIdx], isReviewed };
        // replace
        list[idx] = { ...order };
      };

      updateList(state.orders);
      updateList(state.myOrders);
    }
  },
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
export const { setOrderItemReviewed } = orderSlice.actions;
export default orderSlice.reducer;

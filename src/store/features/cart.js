/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartAPI } from '@/api/cart.api';

// {id:Number,quantity:number}

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  loading: false,
  error: null,
};

// Thunk to fetch user's carts
export const fetchUserCarts = createAsyncThunk(
  'cart/fetchUserCarts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartAPI.getUserCarts();
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const cartSlice = createSlice({
  name: "cartState",
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      const payload = action?.payload;
      // Try to find existing item by id and variant id
      const existingIndex = state.cart.findIndex((it) => {
        const sameProduct = String(it.id) === String(payload.id);
        const itVariantId = it?.variant?.id || it?.productVariantId || null;
        const payloadVariantId = payload?.variant?.id || payload?.productVariantId || null;
        const sameVariant = String(itVariantId) === String(payloadVariantId);
        return sameProduct && sameVariant;
      });

      if (existingIndex >= 0) {
        // merge: increment quantity and update subtotal
        const existing = state.cart[existingIndex];
        const newQty = (Number(existing.quantity) || 0) + (Number(payload.quantity) || 0);
        const updated = {
          ...existing,
          quantity: newQty,
          subTotal: (Number(existing.price) || 0) * newQty,
        };
        state.cart[existingIndex] = updated;
      } else {
        state.cart.push(payload);
      }
      return state;
    },
    removeFromCart: (state, action) => {
      return {
        ...state,
        cart: state?.cart?.filter(
          (item) =>
            item.id !== action?.payload?.productId &&
            item?.variant?.id !== action?.payload?.variantId
        ),
      };
    },
    updateQuantity: (state, action) => {
      return {
        ...state,
        cart: state?.cart?.map((item) => {
          if (item?.variant?.id === action?.payload?.variant_id) {
            return {
              ...item,
              quantity: action?.payload?.quantity,
              subTotal: action?.payload?.quantity * item.price,
            };
          }
          return item;
        }),
      };
    },
    deleteCart: (state, action) => {
      return {
        ...state,
        cart: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCarts.pending, (state) => ({ ...state, loading: true, error: null }))
      .addCase(fetchUserCarts.fulfilled, (state, action) => ({ ...state, loading: false, cart: action.payload }))
      .addCase(fetchUserCarts.rejected, (state, action) => ({ ...state, loading: false, error: action.payload }));
  },
});

export const { addToCart, removeFromCart, updateQuantity, deleteCart } =
  cartSlice?.actions;

export const countCartItems = (state) => state?.cartState?.cart?.length;
export const selectCartItems = (state) => state?.cartState?.cart ?? [];
export default cartSlice.reducer;

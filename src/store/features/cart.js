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
      state.cart.push(action?.payload);
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

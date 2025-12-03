// src/store/addressSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addressAPI } from "@/api/address.api";

// =================== THUNKS ===================

// GET MY ADDRESSES (authenticated user)
export const fetchMyAddresses = createAsyncThunk(
  "address/fetchMyAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await addressAPI.getMyAddresses();
      console.log("✅ My addresses res:", res);
      return res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err || "Get addresses failed");
    }
  }
);

// GET ALL
export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (params, { rejectWithValue }) => {
    try {
      const res = await addressAPI.getAll(params);
      console.log("✅ Addresses res:", res);
      return res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err || "Get addresses failed");
    }
  }
);

// GET BY ID
export const getAddress = createAsyncThunk(
  "address/getAddress",
  async (id, { rejectWithValue }) => {
    try {
      const res = await addressAPI.getById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err || "Get address failed");
    }
  }
);

// CREATE
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addressAPI.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err || "Create address failed");
    }
  }
);

// UPDATE
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await addressAPI.update(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err || "Update address failed");
    }
  }
);

// DELETE
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const res = await addressAPI.delete(id);
      return { id, ...res }; // include deleted id
    } catch (err) {
      return rejectWithValue(err?.response?.data || err || "Delete address failed");
    }
  }
);

// =================== SLICE ===================

const addressSlice = createSlice({
  name: "addressState",
  initialState: {
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,
    loaded: false,
  },
  reducers: {
    clearAddressError(state) {
      state.error = null;
    },
    resetAddressesLoaded(state) {
      state.loaded = false;
    },
    setSelectedAddress(state, action) {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress(state) {
      state.selectedAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ---------- GET MY ADDRESSES ----------
      .addCase(fetchMyAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.loaded = true;
      })
      .addCase(fetchMyAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loaded = false;
      })

      // ---------- GET ALL ----------
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.loaded = true;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loaded = false;
      })

      // ---------- GET ID ----------
      .addCase(getAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAddress = action.payload;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- CREATE ----------
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
        state.loaded = true;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- UPDATE ----------
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(
          (a) => a.id === action.payload.id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.loaded = true;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- DELETE ----------
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (a) => a.id !== action.payload.id
        );
        state.loaded = true;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAddressError,
  resetAddressesLoaded,
  setSelectedAddress,
  clearSelectedAddress,
} = addressSlice.actions;

// Selectors
export const selectAddressState = (state) => state.addressState;
export const selectAddresses = (state) => state.addressState.addresses;
export const selectSelectedAddress = (state) => state.addressState.selectedAddress;
export const selectAddressLoading = (state) => state.addressState.loading;
export const selectAddressError = (state) => state.addressState.error;

export default addressSlice.reducer;


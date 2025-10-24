// src/redux/slices/resourceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resourceAPI } from "@/api/resource.api";

const initialState = {
  resources: [],
  loading: false,
  error: null,
};

/* ================= Async Thunks ================= */

// GET ALL RESOURCES
export const fetchResources = createAsyncThunk(
  "resource/fetchResources",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await resourceAPI.getAll(productId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch resources failed");
    }
  }
);

// UPLOAD RESOURCES
export const uploadResource = createAsyncThunk(
  "resource/uploadResource",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const res = await resourceAPI.upload(productId, formData);
      return res.data; // trả array hoặc object tùy API
    } catch (err) {
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);

// SET PRIMARY
export const setPrimaryResource = createAsyncThunk(
  "resource/setPrimaryResource",
  async ({ productId, resourceId }, { rejectWithValue }) => {
    try {
      const res = await resourceAPI.setPrimary(productId, resourceId);
      return { productId, ...res.data, resourceId };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Set primary failed");
    }
  }
);

// DELETE
export const deleteResource = createAsyncThunk(
  "resource/deleteResource",
  async ({ productId, resourceId }, { rejectWithValue }) => {
    try {
      const res = await resourceAPI.delete(productId, resourceId);
      return { resourceId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);


/* ================= Slice ================= */

const resourceSlice = createSlice({
  name: "resourceState",
  initialState,
  reducers: {
    clearResourceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ========== FETCH ==========
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== UPLOAD ==========
      .addCase(uploadResource.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadResource.fulfilled, (state, action) => {
        state.loading = false;

        // Backend trả 1 resource hoặc list?
        if (Array.isArray(action.payload)) {
          state.resources = [...state.resources, ...action.payload];
        } else {
          state.resources.push(action.payload);
        }
      })
      .addCase(uploadResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== SET PRIMARY ==========
      .addCase(setPrimaryResource.fulfilled, (state, action) => {
        const resourceId = action.payload.resourceId;

        state.resources = state.resources.map((r) => ({
          ...r,
          isPrimary: r.id === resourceId,
        }));
      })

      // ========== DELETE ==========
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter(
          (r) => r.id !== action.payload.resourceId
        );
      });
  },
});

export const { clearResourceError } = resourceSlice.actions;
export default resourceSlice.reducer;

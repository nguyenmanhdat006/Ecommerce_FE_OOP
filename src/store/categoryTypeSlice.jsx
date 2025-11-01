import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryTypeAPI } from "@/api/categoryType.api";

// =================== THUNKS ===================

// GET ALL
export const fetchCategoryTypes = createAsyncThunk(
  "categoryType/fetchCategoryTypes",
  async (params, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.getAll(params);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Get category types failed");
    }
  }
);

// GET BY ID
export const getCategoryType = createAsyncThunk(
  "categoryType/getCategoryType",
  async (id, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.getById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Get category type failed");
    }
  }
);

// CREATE
export const createCategoryType = createAsyncThunk(
  "categoryType/createCategoryType",
  async (data, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.create(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create category type failed");
    }
  }
);

// UPDATE
export const updateCategoryType = createAsyncThunk(
  "categoryType/updateCategoryType",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.update(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update category type failed");
    }
  }
);

// DELETE
export const deleteCategoryType = createAsyncThunk(
  "categoryType/deleteCategoryType",
  async (id, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.delete(id);
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete category type failed");
    }
  }
);

// =================== SLICE ===================

const categoryTypeSlice = createSlice({
  name: "categoryTypeState",
  initialState: {
    categoryTypes: [],
    selectedCategoryType: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryTypeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- GET ALL ----------
      .addCase(fetchCategoryTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryTypes = action.payload;
      })
      .addCase(fetchCategoryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- GET ID ----------
      .addCase(getCategoryType.fulfilled, (state, action) => {
        state.selectedCategoryType = action.payload;
      })

      // ---------- CREATE ----------
      .addCase(createCategoryType.fulfilled, (state, action) => {
        state.categoryTypes.push(action.payload);
      })

      // ---------- UPDATE ----------
      .addCase(updateCategoryType.fulfilled, (state, action) => {
        const index = state.categoryTypes.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categoryTypes[index] = action.payload;
        }
      })

      // ---------- DELETE ----------
      .addCase(deleteCategoryType.fulfilled, (state, action) => {
        state.categoryTypes = state.categoryTypes.filter(
          (c) => c.id !== action.payload.id
        );
      });
  },
});

export const { clearCategoryTypeError } = categoryTypeSlice.actions;
export default categoryTypeSlice.reducer;
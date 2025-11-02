import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryTypeAPI } from "@/api/categoryType.api";

// =================== THUNKS ===================

// GET ALL
export const fetchCategoryTypes = createAsyncThunk(
  "categoryTypeSlice/fetchCategoryTypes",
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
  "categoryTypeSlice/getCategoryType",
  async (id, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.getById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Get category type failed");
    }
  }
);

// CREATE
export const createCategoryType = createAsyncThunk(
  "categoryTypeSlice/createCategoryType",
  async (data, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create category type failed");
    }
  }
);

// UPDATE
export const updateCategoryType = createAsyncThunk(
  "categoryTypeSlice/updateCategoryType",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await categoryTypeAPI.update(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update category type failed");
    }
  }
);

// DELETE
export const deleteCategoryType = createAsyncThunk(
  "categoryTypeSlice/deleteCategoryType",
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
  name: "categoryTypeSlice",
  initialState: {
    categoryTypes: [],
    selectedCategoryType: null,
    loading: false,
    error: null,
    loaded: false,
  },
  reducers: {
    clearCategoryTypeError(state) {
      state.error = null;
    },
    resetCategoryTypesLoaded(state) {
      state.loaded = false;
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
        state.loaded = true;
      })
      .addCase(fetchCategoryTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loaded = false;
      })

      // ---------- GET ID ----------
      .addCase(getCategoryType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryType.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategoryType = action.payload;
      })
      .addCase(getCategoryType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loaded = false;
      })

      // ---------- CREATE ----------
      .addCase(createCategoryType.fulfilled, (state, action) => {
        console.log("Create success", action.payload);
        state.categoryTypes.push(action.payload);
        state.loaded = true ;
      })

      // ---------- UPDATE ----------
      .addCase(updateCategoryType.fulfilled, (state, action) => {
        const index = state.categoryTypes.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categoryTypes[index] = action.payload;
        }
        state.loaded = true;
      })

      // ---------- DELETE ----------
      .addCase(deleteCategoryType.fulfilled, (state, action) => {
        state.categoryTypes = state.categoryTypes.filter(
          (c) => c.id !== action.payload.id
        );
        state.loaded = true;
      });
  },
});

export const { clearCategoryTypeError, resetCategoryTypesLoaded } = categoryTypeSlice.actions;
export default categoryTypeSlice.reducer;

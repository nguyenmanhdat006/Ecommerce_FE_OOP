// src/redux/slices/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryAPI } from "@/api/category.api";

// =================== THUNKS ===================

// GET ALL
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (params, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.getAll(params);
      console.log("✅ Category res:", res);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Get categories failed");
    }
  }
);

// GET BY ID
export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.getById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Get category failed");
    }
  }
);

// CREATE
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.create(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create category failed");
    }
  }
);

// UPDATE
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.update(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update category failed");
    }
  }
);

// DELETE
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const res = await categoryAPI.delete(id);
      return { id, ...res.data }; // include deleted id
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete category failed");
    }
  }
);



// =================== SLICE ===================

const categorySlice = createSlice({
  name: "categoryState",
  initialState: {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ---------- GET ALL ----------
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ---------- GET ID ----------
      .addCase(getCategory.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      })


      // ---------- CREATE ----------
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })


      // ---------- UPDATE ----------
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })


      // ---------- DELETE ----------
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload.id
        );
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;

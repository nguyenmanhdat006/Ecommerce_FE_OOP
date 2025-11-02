import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminUserAPI } from "@/api/adminUser.api";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminUserAPI.getAll();
      // axiosClient interceptor may return response.data directly
      return Array.isArray(res) ? res : res?.data || res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || 'Fetch failed');
    }
  }
);

export const createUser = createAsyncThunk(
  "adminUsers/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await adminUserAPI.create(payload);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || 'Create failed');
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminUsers/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await adminUserAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || 'Delete failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  "adminUsers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await adminUserAPI.update(id, data);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message || 'Update failed');
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        // Server may return created user
        state.users.unshift(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in the list
        const index = state.users.findIndex((u) => u.id === action.payload?.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export default adminUserSlice.reducer;

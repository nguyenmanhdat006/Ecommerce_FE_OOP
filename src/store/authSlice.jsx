// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "@/api/auth.api";
import {
  saveToken,
  saveUser,
  clearTokens,
  clearUser,
} from "@/utils/jwt-helper";

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(data);
      saveToken(res.accessToken);
      saveUser(res.user);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);


// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Register failed");
    }
  }
);

// REFRESH TOKEN
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const res = await authAPI.refreshToken(refreshToken);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Refresh token failed");
    }
  }
);

// LOGOUT
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // const res = await authAPI .logout();
      // return res.data;
      clearTokens();
      clearUser();
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setCredentials(state, action) {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = !!action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
    
    // ---------- LOGIN ----------
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // ---------- REGISTER ----------
    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      // tùy backend trả gì, thường trả user + token
      state.user = action.payload?.user;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    // ---------- REFRESH TOKEN ----------
    .addCase(refreshToken.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
    })
    
    // ---------- LOGOUT ----------
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

export const { setCredentials } = authSlice.actions;
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "@/api/auth.api";
import {
  saveToken,
  saveUser,
  clearTokens,
  clearUser,
} from "@/utils/jwt-helper";
import { normalizeUser } from "@/utils/roleNormalizer";
import { clearUserProfile, loadUserProfile } from "@/store/userProfileSlice";

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      console.log("Login data:", data);
      const res = await authAPI.login(data);
      console.log("Login res:", res);
      console.log("Login res.data:", res.token);
      saveToken(res.token);
      // Normalize user before saving
      const normalizedUser = normalizeUser(res.user);
      saveUser(normalizedUser);
      
      // Clear old userProfile and load fresh user profile from backend
      dispatch(clearUserProfile());
      dispatch(loadUserProfile());
      
      return { ...res, user: normalizedUser };
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
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // const res = await authAPI .logout();
      // return res.data;
      clearTokens();
      clearUser();
      // Clear userProfileSlice to prevent showing old user data
      dispatch(clearUserProfile());
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
      // Normalize user before setting
      state.user = action.payload.user ? normalizeUser(action.payload.user) : null;
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
      // tùy backend trả gì, thường trả user + token - normalize user
      state.user = action.payload?.user ? normalizeUser(action.payload.user) : null;
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
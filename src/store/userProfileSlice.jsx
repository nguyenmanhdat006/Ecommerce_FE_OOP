import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/";

const buildUrl = (path) => `${API_BASE}${path}`;

async function defaultFetch(path) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(buildUrl(path), { 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw err;
  }

  return res.json();
}

// Thunk: load authenticated user's profile 
export const loadUserProfile = createAsyncThunk(
  "userProfile/loadUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await defaultFetch("/api/user/profile");
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: {
    profile: null,
    loadingProfile: false,
    error: null,
  },
  reducers: {
    clearUserProfile(state) {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // profile
      .addCase(loadUserProfile.pending, (state) => {
        state.loadingProfile = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error = action.payload || action.error;
      });
  },
});

export const { clearUserProfile } = userProfileSlice.actions;
// Selectors
export const selectUserProfile = (state) => state.userProfile?.profile || null;
export const selectUserId = (state) => state.userProfile?.profile?.id || null;
export const selectUserProfileLoading = (state) => state.userProfile?.loadingProfile || false;

export default userProfileSlice.reducer;

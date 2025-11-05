// src/store/userProfileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAPI } from "@/api/user.api";

export const loadUserProfile = createAsyncThunk(
  "userProfile/loadUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await userAPI.getProfile();
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
    loaded: false,
  },
  reducers: {
    clearUserProfile(state) {
      state.profile = null;
      state.error = null;
      state.loaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserProfile.pending, (state) => {
        state.loadingProfile = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload;
        state.loaded = true;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.loadingProfile = false;
        state.error = action.payload || action.error;
      });
  },
});

export const { clearUserProfile } = userProfileSlice.actions;

export const selectUserProfile = (state) => state.userProfile?.profile || null;
export const selectUserId = (state) => state.userProfile?.profile?.id || null;
export const selectUserProfileLoading = (state) =>
  state.userProfile?.loadingProfile || false;

export default userProfileSlice.reducer;

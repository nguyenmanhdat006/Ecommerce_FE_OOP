// src/redux/slices/fileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fileAPI } from "@/api/file.api";

const initialState = {
  files: [],
  fileInfo: null,
  loading: false,
  error: null,
};

/* =============== Async Thunks =============== */

// Upload single
export const uploadSingleFile = createAsyncThunk(
  "file/uploadSingle",
  async (file, { rejectWithValue }) => {
    try {
      const res = await fileAPI.uploadSingle(file);
      // axiosClient interceptor đã trả về response.data rồi
      // nên res ở đây chính là data rồi, không cần .data nữa
      console.log("res:", res);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);

// Upload multiple
export const uploadMultipleFiles = createAsyncThunk(
  "file/uploadMultiple",
  async (files, { rejectWithValue }) => {
    try {
      const res = await fileAPI.uploadMultiple(files);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);

// Get file info
export const getFileInfo = createAsyncThunk(
  "file/getInfo",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await fileAPI.getInfo(fileId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch info failed");
    }
  }
);

// Delete file
export const deleteFile = createAsyncThunk(
  "file/delete",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await fileAPI.delete(fileId);
      return { fileId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

/* =============== Slice =============== */

const fileSlice = createSlice({
  name: "fileState",
  initialState,
  reducers: {
    clearFileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== Upload Single =====
      .addCase(uploadSingleFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadSingleFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files.push(action.payload);
      })
      .addCase(uploadSingleFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Upload Multiple =====
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
        state.loading = false;

        if (Array.isArray(action.payload)) {
          state.files = [...state.files, ...action.payload];
        } else {
          state.files.push(action.payload);
        }
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Get info =====
      .addCase(getFileInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFileInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.fileInfo = action.payload;
      })
      .addCase(getFileInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Delete =====
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter(
          (f) => f.id !== action.payload.fileId
        );
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFileError } = fileSlice.actions;
export default fileSlice.reducer;

// src/redux/chat/connectionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const chatConnectionSlice = createSlice({
  name: "chatConnection",
  initialState: {
    status: "disconnected",
  },
  reducers: {
    setConnectionStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setConnectionStatus } = chatConnectionSlice.actions;
export default chatConnectionSlice.reducer;

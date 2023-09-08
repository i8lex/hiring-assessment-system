import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;

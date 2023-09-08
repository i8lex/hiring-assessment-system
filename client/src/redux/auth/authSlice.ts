import { createSlice } from "@reduxjs/toolkit";
import { Answer } from "../../types";
type AuthState = {
  token: string | null;
  answers: Answer[];
  isAuthenticated: boolean;
  role: string;
  userId: string;
};

const initialState: AuthState = {
  token: null,
  answers: [],
  isAuthenticated: false,
  role: "",
  userId: "",
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.answers = action.payload.answers;
      state.userId = action.payload.userId;
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.role = "";
      state.answers = [];
      state.userId = "";
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload); // Добавляем ответ в конец массива
    },
  },
});

export const { loginSuccess, logoutSuccess, addAnswer } = authSlice.actions;

export default authSlice.reducer;

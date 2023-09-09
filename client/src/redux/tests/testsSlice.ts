import { createSlice } from "@reduxjs/toolkit";
import { Answer } from "../../types";
type TestsState = {
  fileState: {
    file: string;
    mimeType: string;
  };
};

const initialState: TestsState = {
  fileState: {
    file: "",
    mimeType: "",
  },
};
export const testsSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    fileState: (state, action) => {
      state.fileState = action.payload;
    },
  },
});

export const { fileState } = testsSlice.actions;

export default testsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const testsSlice = createSlice({
  name: "tests",
  initialState: [],
  reducers: {
    toggleTest: (state, action) => {
      const { itemId, isChecked } = action.payload;

      // if (isChecked) {
      //   state.push(itemId);
      // } else {
      //   const index = state.indexOf(itemId);
      //   if (index !== -1) {
      //     state.splice(index, 1);
      //   }
      // }
    },
    clearTests: (state) => {
      return [];
    },
  },
});

export const { toggleTest, clearTests } = testsSlice.actions;
export default testsSlice.reducer;

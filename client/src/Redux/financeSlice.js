import { createSlice } from "@reduxjs/toolkit";
import { createFinance, fetchFinanceList } from "./financeThunks";

const financeSlice = createSlice({
  name: "finance",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createFinance.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFinance.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createFinance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LIST
      .addCase(fetchFinanceList.pending, (state) => {
        state.loading = true;
      })
    .addCase(fetchFinanceList.fulfilled, (state, action) => {
  state.loading = false;
  state.list = action.payload;
})

      .addCase(fetchFinanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default financeSlice.reducer;

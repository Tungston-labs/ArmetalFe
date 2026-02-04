import { createSlice } from "@reduxjs/toolkit";
import { createFinance, fetchFinanceList, deleteFinance } from "./financeThunks";


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

  state.list = action.payload.results;

  state.pagination = {
    totalItems: action.payload.total_items,
    totalPages: action.payload.total_pages,
    currentPage: action.payload.current_page,
    next: action.payload.next,
    previous: action.payload.previous,
  };
})

      .addCase(fetchFinanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFinance.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteFinance.fulfilled, (state, action) => {
        state.loading = false;

        // remove deleted item from list
        state.list = state.list.filter(
          (item) => item.id !== action.payload
        );
      })

      .addCase(deleteFinance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default financeSlice.reducer;

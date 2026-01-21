import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCompanySelf,
  updateCompanySelf,
} from "../services/companyService";

// GET
export const getCompanySelf = createAsyncThunk(
  "company/getSelf",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCompanySelf();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// PATCH
export const patchCompanySelf = createAsyncThunk(
  "company/updateSelf",
  async (data, { rejectWithValue }) => {
    try {
      return await updateCompanySelf(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCompanyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getCompanySelf.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCompanySelf.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(getCompanySelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PATCH
      .addCase(patchCompanySelf.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(patchCompanySelf.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
        state.success = true;
      })
      .addCase(patchCompanySelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;

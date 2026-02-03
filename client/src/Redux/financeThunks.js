import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createFinanceService,
  listFinanceService,
} from "../services/financeService";

export const createFinance = createAsyncThunk(
  "finance/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createFinanceService(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFinanceList = createAsyncThunk(
  "finance/list",
  async (_, { rejectWithValue }) => {
    try {
      const response = await listFinanceService();

      // ✅ normalize response
      if (Array.isArray(response)) return response;
      if (Array.isArray(response.results)) return response.results;
      if (Array.isArray(response.data)) return response.data;

      return []; // fallback
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


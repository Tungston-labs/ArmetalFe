import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createFinanceService,
  listFinanceService,
  deleteFinanceService
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
  async (
    { page = 1, pageSize = 20, search = "", payment_type = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await listFinanceService(
        page,
        pageSize,
        search,
        payment_type
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



export const deleteFinance = createAsyncThunk(
  "finance/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFinanceService(id);
      return id; // return deleted id
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

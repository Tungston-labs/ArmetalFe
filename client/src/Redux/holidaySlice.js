// src/Redux/holidaySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchHolidays,
  createHolidays,
  updateHolidays,
  deleteHolidays,
  
} from "../services/holidayService";

// Thunks
export const getHolidays = createAsyncThunk("holidays/get", async () => {
  return await fetchHolidays();
});

export const addHoliday = createAsyncThunk("holidays/add", async (data) => {
  return await createHolidays(data);
});

export const editHoliday = createAsyncThunk("holidays/update", async ({ id, data }) => {
  return await updateHolidays(id, data);
});

export const removeHoliday = createAsyncThunk("holidays/delete", async (id) => {
  await deleteHolidays(id);
  return id;
});

export const getHolidayById = createAsyncThunk("holidays/getOne", async (id) => {
  return await fetchHolidaysById(id);
});

// Slice
const holidaySlice = createSlice({
  name: "holidays",
  initialState: {
    list: [],
    loading: false,
    error: null,
    selected: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHolidays.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addHoliday.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(removeHoliday.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
      });
  }
});

export default holidaySlice.reducer;
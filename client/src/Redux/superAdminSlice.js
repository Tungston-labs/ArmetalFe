import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCompany,
  createCompany,
  fetchCompanyById,
  updateCompany,
  deleteCompany
} from '../services/superAdminService';

// Async thunk for fetching paginated company list
export const getCompanies = createAsyncThunk(
    'superAdmin/getCompanies',
    async ({ page = 1, search = '' }) => {
      return await fetchCompany(page, search);
    }
  );
  

// Create company
export const addCompany = createAsyncThunk(
  'superAdmin/addCompany',
  async (data) => {
    return await createCompany(data);
  }
);

// Get single company by ID
export const getCompanyById = createAsyncThunk(
  'superAdmin/getCompanyById',
  async (id) => {
    return await fetchCompanyById(id);
  }
);

// Edit company
export const editCompany = createAsyncThunk(
  'superAdmin/editCompany',
  async ({ id, data }) => {
    return await updateCompany(id, data);
  }
);

// Delete company
export const removeCompany = createAsyncThunk(
  'superAdmin/removeCompany',
  async (id) => {
    await deleteCompany(id);
    return id;
  }
);

// Slice definition
const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState: {
    companies: [],
    pagination: {
      total_pages: 0,
      current_page: 1,
      total_items: 0,
      next: null,
      previous: null,
    },
    selectedCompany: null,
    loading: false,
    error: null,
    searchQuery: "", 
  },
  reducers: {
    clearSelectedCompany(state) {
      state.selectedCompany = null;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies with pagination
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.results;
        state.pagination = {
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
          total_items: action.payload.total_items,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add company
      .addCase(addCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })

      // Get company by ID
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.selectedCompany = action.payload;
      })

      // Edit company
      .addCase(editCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })

      // Delete company
      .addCase(removeCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(c => c.id !== action.payload);
      });
  }
});

export const { clearSelectedCompany,setSearchQuery } = superAdminSlice.actions;

export default superAdminSlice.reducer;

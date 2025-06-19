import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createEmployee,
  updateEmployee,
  createBankPayment,
  updateBankPayment,
  getBankPayment,
  uploadTempImage,
  saveEmployeeDocuments
} from '../services/employeeService';

// --- Submit Basic Info ---
export const submitEmployee = createAsyncThunk(
  'employee/submitEmployee',
  async (data, thunkAPI) => {
    const { employee } = thunkAPI.getState();
    try {
      let response;
      if (employee.employeeCreated && employee.employeeId) {
        response = await updateEmployee(employee.employeeId, data);
      } else {
        response = await createEmployee(data);
      }
      return response;
    } catch (err) {
      let message = 'Something went wrong.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api'; // your axios instance
// src/Redux/employeeSlice.js
import { fetchAllEmployees } from '../services/employeeService';
// ✅ DELETE thunk
export const deleteEmployeeById = createAsyncThunk(
  'employees/deleteEmployeeById',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/employees/${employeeId}/`);
      return employeeId; // Return the deleted ID to update local state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Submit or Update Bank Payment ---
export const submitBankPayment = createAsyncThunk(
  'employee/submitBankPayment',
  async ({ employeeId, data }, thunkAPI) => {
    const { employee } = thunkAPI.getState();
    try {
      let response;
      if (employee.bankPaymentId) {
        response = await updateBankPayment(employeeId, employee.bankPaymentId, data);
      } else {
        const created = await createBankPayment(employeeId, data);
        thunkAPI.dispatch(setBankPaymentId(created.id));
        response = created;
      }
      return response;
    } catch (err) {
      let message = 'Error saving bank payment.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);



export const getAllEmployees = createAsyncThunk(
  'employees/getAll',
  async ({ page, search }, thunkAPI) => {
    try {
      return await fetchAllEmployees(page, search);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Server error');
    }
  }
);

// --- Fetch Bank Payment ---
export const fetchBankPayment = createAsyncThunk(
  'employee/fetchBankPayment',
  async (employeeId, thunkAPI) => {
    try {
      const response = await getBankPayment(employeeId);
      if (Array.isArray(response) && response.length > 0) {
        thunkAPI.dispatch(setBankPaymentId(response[0].id));
        return response[0];
      }
      return null;
    } catch (err) {
      let message = 'Failed to fetch bank payment.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Upload Image ---
export const uploadImage = createAsyncThunk(
  'employee/uploadImage',
  async (file) => {
    return await uploadTempImage(file);
  }
);

export const submitDocuments = createAsyncThunk(
  'employee/submitDocuments',
  async ({ employeeId, documents }) => {
 return await saveEmployeeDocuments(employeeId, documents);// not submitAllDocuments
  }
);

// --- Slice ---
const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    status: 'idle',
    error: null,
    employeeId: null,
    employeeCreated: false,
    bankPaymentId: null,
    bankPayment: null,
    formData: {},
    documentUrls: {
      passport: [],
      workPermit: [],
      contract: [],
      insurance: [],
      certificate: [],
    },
  },
  reducers: {
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload;
    },
    setBankFormData: (state, action) => {
      state.formData.bank = action.payload;
    },
    setBasicFormData: (state, action) => {
      state.formData.basic = action.payload;
    },
    setBankPaymentId: (state, action) => {
      state.bankPaymentId = action.payload;
    },
    addDocumentUrl: (state, action) => {
      const { type, url } = action.payload;
      state.documentUrls[type].push(url);
    },
    removeDocumentUrl: (state, action) => {
      const { type, index } = action.payload;
      state.documentUrls[type].splice(index, 1);
    },
    clearDocumentUrls: (state) => {
      state.documentUrls = {
        passport: [],
        workPermit: [],
        contract: [],
        insurance: [],
        certificate: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeId = action.payload?.id || action.payload?.employee?.id || null;
        state.employeeCreated = true;
      })
      .addCase(submitEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to save employee';
      })
      .addCase(submitBankPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBankPayment.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitBankPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Bank payment failed';
      })
      .addCase(fetchBankPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBankPayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bankPayment = action.payload;
      })
      .addCase(fetchBankPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.bankPayment = null;
      })
      .addCase(uploadImage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
    .addCase(submitDocuments.pending, (state) => {
  state.status = 'loading';
  state.error = null;
})
.addCase(submitDocuments.fulfilled, (state) => {
  state.status = 'succeeded';
})
.addCase(submitDocuments.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.error.message;
})
      
  },
});

export const {
  setEmployeeId,
  setBankFormData,
  setBasicFormData,
  setBankPaymentId,
  addDocumentUrl,
  removeDocumentUrl,
  clearDocumentUrls,
} = employeeSlice.actions;

export default employeeSlice.reducer;




const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    loading: false,
    employeeList: [],
    pagination: { count: 0, next: null, previous: null },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load employees';
      })
      // DELETE employee
      .addCase(deleteEmployeeById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = state.employeeList.filter(emp => emp.id !== action.payload);
      })
      
      .addCase(deleteEmployeeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Delete failed';
      });
  },
});



export default employeeSlice.reducer;



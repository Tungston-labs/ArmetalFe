import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createEmployee,
  updateEmployee,
  createBankPayment,
  updateBankPayment,
  getBankPayment,
  uploadTempImage,
  saveEmployeeDocuments,
  fetchAllEmployees,
} from '../services/employeeService';
import axios from 'axios';

// --- Submit Basic Info ---
// Redux employeeSlice.js
import API from '../services/api';

export const submitEmployee = createAsyncThunk(
  'employee/submitEmployee',
  async (formData, thunkAPI) => {
    const { employee } = thunkAPI.getState();

    try {
      let response;
      if (employee.employeeCreated && employee.employeeId) {
        console.log("bhbh",employee.employeeCreated , employee.employeeId);
        
        response = await updateEmployee(employee.employeeId, formData);
      } else {
        response = await createEmployee(formData);
      }
      return response;
    } catch (err) {
      console.error('❌ Error submitting employee:', err.response?.data || err.message);
      const message = err.response?.data?.message || 'Something went wrong.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);




// --- Delete Employee ---
export const deleteEmployeeById = createAsyncThunk(
  'employees/deleteEmployeeById',
  async (employeeId, { rejectWithValue }) => {
    try {
      await API.delete(`/employees/${employeeId}/`);
      return employeeId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Delete failed');
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
      let message = err.response?.data?.message || 'Error saving bank payment.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Fetch All Employees ---
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
      let message = err.response?.data?.message || 'Failed to fetch bank payment.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- Upload Temp Image ---
export const uploadImage = createAsyncThunk(
  'employee/uploadImage',
  async (file) => {
    return await uploadTempImage(file);
  }
);

// --- Submit Employee Documents ---
export const submitDocuments = createAsyncThunk(
  'employee/submitDocuments',
  async ({ employeeId, documents }) => {
    return await saveEmployeeDocuments(employeeId, documents);
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    // Creation-related
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

    // List-related
    loading: false,
    employeeList: [],
    pagination: { count: 0, next: null, previous: null },
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
      // Create/Update Employee
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
        state.error = action.payload;
      })

      // Submit/Update Bank Payment
      .addCase(submitBankPayment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitBankPayment.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitBankPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Bank Payment
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

      // Upload Image
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

      // Submit Documents
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

      // Get All Employees
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load employees';
      })

      // Delete Employee
      .addCase(deleteEmployeeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = state.employeeList.filter(emp => emp.id !== action.payload);
      })
      .addCase(deleteEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Delete failed';
      });
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

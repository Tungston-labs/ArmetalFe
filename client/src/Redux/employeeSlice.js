import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createEmployee,
  updateEmployee,
  createBankPayment,
  updateBankPayment,
  deleteBankPayment as deleteBankPaymentAPI,
  uploadTempImage,
  saveEmployeeDocuments,
  fetchAllEmployees,
  fetchEmployeeById,
  fetchAllBankPaymentsByEmployee,
  fetchEmployeeDocuments,
  deleteEmployeeDocument,
} from '../services/employeeService';
import API from '../services/api';

// Submit Employee
export const submitEmployee = createAsyncThunk(
  'employee/submitEmployee',
  async (formData, thunkAPI) => {
    const { employee } = thunkAPI.getState();
    try {
      return employee.employeeCreated && employee.employeeId
        ? await updateEmployee(employee.employeeId, formData)
        : await createEmployee(formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Something went wrong.');
    }
  }
);

// Delete Employee
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

// Submit Bank Payment
export const submitBankPayment = createAsyncThunk(
  'employee/submitBankPayment',
  async ({ employeeId, data, paymentId = null }, thunkAPI) => {
    try {
      const response = paymentId
        ? await updateBankPayment(employeeId, paymentId, data)
        : await createBankPayment(employeeId, data);
      if (!paymentId) thunkAPI.dispatch(setBankPaymentId(response.id));
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Error saving bank payment.');
    }
  }
);

// Delete Bank Payment
export const deleteBankPayment = createAsyncThunk(
  'employee/deleteBankPayment',
  async ({ employeeId, paymentId }, { rejectWithValue }) => {
    try {
      await deleteBankPaymentAPI(employeeId, paymentId);
      return paymentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete bank payment');
    }
  }
);

// Get Single Employee
export const getEmployeeById = createAsyncThunk(
  'employees/getById',
  async (id, thunkAPI) => {
    try {
      return await fetchEmployeeById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch employee');
    }
  }
);

// Fetch All Employees
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

// Fetch All Bank Payments
export const fetchAllBankPaymentsThunk = createAsyncThunk(
  'employee/fetchAllBankPayments',
  async (employeeId) => await fetchAllBankPaymentsByEmployee(employeeId)
);

// Upload Temp Image
export const uploadImageThunk = createAsyncThunk(
  'documents/uploadTempImage',
  async (file, { rejectWithValue }) => {
    try {
      const response = await uploadTempImage(file);
      return response.url;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Upload failed');
    }
  }
);

// Submit Documents
export const submitDocumentsThunk = createAsyncThunk(
  'documents/submit',
  async ({ employeeId, documents }, { rejectWithValue }) => {
    try {
      return await saveEmployeeDocuments(employeeId, documents);
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Document submission failed');
    }
  }
);

// Fetch Employee Documents
export const getEmployeeDocumentsThunk = createAsyncThunk(
  'documents/getByEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      return await fetchEmployeeDocuments(employeeId);
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Fetch failed');
    }
  }
);

// Delete Document
export const deleteDocumentThunk = createAsyncThunk(
  'documents/delete',
  async (docId, { rejectWithValue }) => {
    try {
      await deleteEmployeeDocument(docId);
      return docId;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Delete failed');
    }
  }
);

// Slice
const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    status: 'idle',
    error: null,
    loading: false,
    employeeCreated: false,
    employeeId: null,
    bankPaymentId: null,
    formData: {},
    documentUrls: {
      passport: [],
      workPermit: [],
      contract: [],
      insurance: [],
      certificate: [],
    },
    documentList: [],
    employeeDocuments: [],
    employeeBankPayments: [],
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
      Object.keys(state.documentUrls).forEach(key => state.documentUrls[key] = []);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEmployee.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(submitEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeId = action.payload?.id || action.payload?.employee?.id;
        state.employeeCreated = true;
      })
      .addCase(submitEmployee.rejected, (state, action) => {
        state.status = 'failed'; state.error = action.payload;
      })

      .addCase(submitBankPayment.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.employeeBankPayments.findIndex(p => p.id === updated.id);
        if (index !== -1) state.employeeBankPayments[index] = updated;
        else state.employeeBankPayments.push(updated);
      })
      .addCase(deleteBankPayment.fulfilled, (state, action) => {
        state.employeeBankPayments = state.employeeBankPayments.filter(p => p.id !== action.payload);
      })
      .addCase(fetchAllBankPaymentsThunk.fulfilled, (state, action) => {
        state.employeeBankPayments = action.payload;
      })

      .addCase(uploadImageThunk.fulfilled, (state, action) => {
        // you can optionally push to documentUrls or tempUrls here
      })

      .addCase(submitDocumentsThunk.fulfilled, (state, action) => {
        state.documentList = action.payload;
        state.documentUrls = { passport: [], workPermit: [], contract: [], insurance: [], certificate: [] };
      })

      .addCase(getEmployeeDocumentsThunk.fulfilled, (state, action) => {
        state.employeeDocuments = action.payload;
      })
      .addCase(deleteDocumentThunk.fulfilled, (state, action) => {
        state.employeeDocuments = state.employeeDocuments.filter(doc => doc.id !== action.payload);
      })

      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.employeeList = action.payload.results;
        state.pagination = {
          count: action.payload.count,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })

      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.employeeDetail = action.payload;
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

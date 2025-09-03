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
  updateEmployeeDocument,
    updateEmployeeDocuments
} from '../services/employeeService';
import API from '../services/api';

export const submitEmployee = createAsyncThunk(
  "employee/submitEmployee",
  async (formData, thunkAPI) => {
    try {
      const form = new FormData();

      const flatten = (obj) => {
        Object.entries(obj || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "profile_pic" || key === "idcard") {
              if (value instanceof File) {
                form.append(key, value);
              }
            } else if (key === "department") {
              form.append("department_id", value);
            } else {
              form.append(key, value);
            }
          }
        });
      };

      // flatten both sections
      flatten(formData.basic);
      flatten(formData.bank);

      console.log("📦 Final FormData before sending:");
      for (let pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (formData.id) {
        return await updateEmployee(formData.id, form);
      } else {
        return await createEmployee(form);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
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
  async ({ employeeId, data, paymentId = null, bankProofImage = null }, thunkAPI) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (bankProofImage) {
        formData.append('bank_proof_image', bankProofImage);
      }

      const response = paymentId
        ? await updateBankPayment(employeeId, paymentId, formData)
        : await createBankPayment(employeeId, formData);

      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err|| 'Error saving bank payment.');
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
  async ({ page, search, department_id }, thunkAPI) => {
    try {
      return await fetchAllEmployees(page, search, department_id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Server error');
    }
  }
);

export const getUpcomingExpiryEmployees = createAsyncThunk(
  "employees/getUpcomingExpiry",
  async ({ expiryType, page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/employees/upcoming-expiry/?type=${expiryType}&page=${page}&search=${search}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Fetch All Bank Payments
export const fetchAllBankPaymentsThunk = createAsyncThunk(
  'employee/fetchAllBankPayments',
  async (employeeId) => await fetchAllBankPaymentsByEmployee(employeeId)
);

// Upload Temp Image


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
  "employees/getDocuments",
  async (employeeId, thunkAPI) => {
    try {
      const data = await fetchEmployeeDocuments(employeeId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching documents");
    }
  }
);
export const updateEmployeeDocumentThunk = createAsyncThunk(
  "employees/updateSingleDocument",
  async ({ docId, data }, thunkAPI) => {
    try {
      const res = await updateEmployeeDocument(docId, data);
      return res; // optionally you can return { docId, data: res } if you want to handle merge
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error updating document");
    }
  }
);
export const updateEmployeeDocumentsThunk = createAsyncThunk(
  "employees/updateDocuments",
  async ({ id, form }, thunkAPI) => {
    try {
      const response = await updateEmployeeDocuments(id, form);
      thunkAPI.dispatch(getEmployeeDocumentsThunk(id)); // Refresh after update
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Update failed");
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
export const deleteEmployeeDocumentImageThunk = createAsyncThunk(
  "employees/deleteDocumentImage",
  async ({ id, field, url }, thunkAPI) => {
    try {
      const response = await axiosPrivate.delete(`/employees/${id}/documents/delete-image/`, {
        data: { field, url },
      });
      thunkAPI.dispatch(getEmployeeDocumentsThunk(id));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);
export const uploadImageThunk = createAsyncThunk(
  "documents/uploadTempImage",
  async (file, { rejectWithValue }) => {
    try {
      const response = await uploadTempImage(file);
      return response.url;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Upload failed");
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
     clearBankPayment: (state) => {
      state.bankPayment = null;
      state.formData.bank = null;
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
  .addCase(updateEmployeeDocumentThunk.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateEmployeeDocumentThunk.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.employeeDocuments = {
          ...state.employeeDocuments,
          ...action.payload, // update returned fields only
        };
      })
      .addCase(updateEmployeeDocumentThunk.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })
       // getUpcomingExpiryEmployees
       .addCase(getUpcomingExpiryEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUpcomingExpiryEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeList = action.payload.results;
        state.pagination = {
          total_pages: action.payload.total_pages,
          count: action.payload.count
        };
      })
      .addCase(getUpcomingExpiryEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

          .addCase(submitBankPayment.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!Array.isArray(state.employeeBankPayments)) {
          state.employeeBankPayments = []; // fallback
        }

        const index = state.employeeBankPayments.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          state.employeeBankPayments[index] = updated;
        } else {
          state.employeeBankPayments.push(updated);
        }
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
          total_pages: action.payload.total_pages,
          current_page: action.payload.current_page,
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
  clearBankPayment,
} = employeeSlice.actions;

export default employeeSlice.reducer;

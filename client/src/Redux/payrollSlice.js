import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchPayrollData,
  createOrUpdatePayroll,
  updateEmployeePayrollStatus,
  getPayrollDetailById,
  verifyPayroll,
} from "../services/payrollService";

// 1. Fetch payroll data with pagination and search

// export const getPayrollData = createAsyncThunk(
//   "payroll/getPayrollData",
//   async ({ month, year, search = "", page = 1, department = "" }, { rejectWithValue }) => {
//     try {
//       const data = await fetchPayrollData(month, year, search, page, department); 
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to fetch payroll data");
//     }
//   }
// );
export const getPayrollData = createAsyncThunk(
  "payroll/getPayrollData",
  async ({ month, year, search = "", page = 1, department = "" }, { rejectWithValue }) => {
    try {
      // normalize department ID if it comes like "17:1"
      const deptId = department ? String(department).split(":")[0] : "";
      const data = await fetchPayrollData(month, year, search, page, deptId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payroll data");
    }
  }
);



// 2. Create or update payroll for selected employees
export const submitPayrollRecords = createAsyncThunk(
  "payroll/submitPayrollRecords",
  async ({ month, year, employee_ids, status }, { rejectWithValue }) => {
    try {
      const data = await createOrUpdatePayroll({ month, year, employee_ids, status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit payroll records");
    }
  }
);

// 3. Update payroll status for a single employee
export const updatePayrollStatus = createAsyncThunk(
  "payroll/updatePayrollStatus",
  async ({ employeeId, month, year, status }, { rejectWithValue }) => {
    try {
      const data = await updateEmployeePayrollStatus({ employeeId, month, year, status });
      return { employeeId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update payroll status");
    }
  }
);

// ✅ 4. Get payroll detail by record ID (for payslip)
export const getPayrollDetail = createAsyncThunk(
  "payroll/getPayrollDetail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getPayrollDetailById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch payroll detail");
    }
  }
);
// ✅ 5. Verify payroll for employee
export const verifyEmployeePayroll = createAsyncThunk(
  "payroll/verifyEmployeePayroll",
  async ({ employeeId, month, year }, { rejectWithValue }) => {
    try {
      const data = await verifyPayroll({ employeeId, month, year });
      return { employeeId, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to verify payroll");
    }
  }
);


const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    submitSuccess: false,
    updateStatusSuccess: false,
    verifySuccess: false,
    payrollDetail: null, // ✅ New state
  },
  reducers: {
    resetPayrollState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.totalPages = 1;
      state.submitSuccess = false;
      state.updateStatusSuccess = false;
      state.verifySuccess = false;
      state.payrollDetail = null;
    },
    resetSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },
    resetUpdateStatusSuccess: (state) => {
      state.updateStatusSuccess = false;
    },
    resetVerifySuccess: (state) => {
      state.verifySuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET all payrolls
      .addCase(getPayrollData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
        state.updateStatusSuccess = false;
      })
      .addCase(getPayrollData.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.data = payload;
          state.totalPages = 1;
        } else {
          state.data = payload.results || payload.data || [];
          state.totalPages = payload.total_pages || 1;
        }
      })
      .addCase(getPayrollData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // POST payroll
      .addCase(submitPayrollRecords.pending, (state) => {
        state.loading = true;
        state.submitSuccess = false;
      })
      .addCase(submitPayrollRecords.fulfilled, (state) => {
        state.loading = false;
        state.submitSuccess = true;
      })
      .addCase(submitPayrollRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.submitSuccess = false;
      })

      // PATCH payroll status
      .addCase(updatePayrollStatus.pending, (state) => {
        state.loading = true;
        state.updateStatusSuccess = false;
      })
      .addCase(updatePayrollStatus.fulfilled, (state) => {
        state.loading = false;
        state.updateStatusSuccess = true;
      })
      .addCase(updatePayrollStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateStatusSuccess = false;
      })

      // ✅ GET single payroll detail
      .addCase(getPayrollDetail.pending, (state) => {
        state.loading = true;
        state.payrollDetail = null;
        state.error = null;
      })
      .addCase(getPayrollDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollDetail = action.payload;
      })
      .addCase(getPayrollDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.payrollDetail = null;
      })
     
      // ✅ Verify Payroll
      .addCase(verifyEmployeePayroll.pending, (state) => {
        state.loading = true;
        state.verifySuccess = false;
      })
      .addCase(verifyEmployeePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.verifySuccess = true;
        state.data = state.data.map((emp) =>
          emp.employee?.id === action.payload.employeeId
            ? action.payload.data  // replace with fresh record from backend
            : emp
        );
      })
      
      .addCase(verifyEmployeePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.verifySuccess = false;
      });


  },
});

export const { resetPayrollState, 
  resetSubmitSuccess, 
  resetUpdateStatusSuccess, 
  resetVerifySuccess  } = payrollSlice.actions;

export default payrollSlice.reducer;

// services/payrollService.js
import API from "./api"; // Axios instance

export const fetchPayrollData = async (month, year, search = "", page = 1) => {
  const response = await API.get("/payroll/", {
    params: { month, year, search, page },
  });
  console.log("✅ Payroll API Response:", response.data);  // <-- Add this line
  return response.data;
};



// 2. Create or update payroll records for selected employees
export const createOrUpdatePayroll = async ({ month, year, employee_ids, status }) => {
  const response = await API.post("/payroll/", {
    month,
    year,
    employee_ids,
    status,
  });
  return response.data;
};

// 3. Update payroll status for a single employee
export const updateEmployeePayrollStatus = async ({ employeeId, month, year, status }) => {
  const response = await API.patch(`/payroll/${employeeId}/status/update/`, {
    month,
    year,
    status,
  });
  return response.data;
};

export const getPayrollDetailById = async (id) => {
  const response = await API.get(`/payroll/record/${id}/`);
  return response.data;
};
// services/payrollService.js
import API from "./api"; // Axios instance


export const fetchPayrollData = async (month, year, search = "", page = 1, department = "") => {
  const response = await API.get("/payroll/", {
    params: { month, year, search, page, department },  // 👈 include department
  });
  console.log("✅ Payroll API Response:", response.data);
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
// 3. verify payroll records by 2 hr admins
export const verifyPayroll = async ({ employeeId, month, year }) => {
  try {
    const response = await API.post(`/payroll/${employeeId}/verify/`, {
      month,
      year,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying payroll:", error.response?.data || error.message);
    throw error;
  }
};

// 4. Update payroll status for a single employee
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


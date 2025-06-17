// services/employeeService.js
import API from './api';

// 1. Create employee
export const createEmployee = async (data) => {
  try {
    const res = await API.post("employees/", data);
    return res.data;
  } catch (error) {
    console.error("❌ Error creating employee:", error.response?.data || error.message);
    throw error;
  }
}

// 2. Create bank payment
export const createBankPayment = async (employeeId, data) => {
  const res = await API.post(`employees/${employeeId}/bank-payments/`, data);
  return res.data;
};

// 3. Upload documents
export const uploadEmployeeDocument = async (employeeId, formData) => {
  const res = await API.post(`employees/${employeeId}/documents/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// 4. Optional: Get my department employees
export const getMyDepartmentEmployees = async () => {
  const res = await API.get('employees/my-department/');
  return res.data;
};

export const getBankPayment = async (employeeId) => {
  const res = await API.get(`employees/${employeeId}/bank-payments/`);
  return res.data;
};
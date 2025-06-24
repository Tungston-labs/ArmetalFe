import { data } from 'react-router-dom';
import API from './api';

// 1. Create employee
export const createEmployee = async (formData) => {
  try {
    const res = await API.post("/employees/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error creating employee:", error.response?.data || error.message);
    throw error;
  }
};



// 2. Create bank payment
// export const createBankPayment = async (employeeId, data) => {
//   try {
//     const res = await API.post(`/employees/${employeeId}/bank-payments/`, data);
//     return res.data;
//   } catch (error) {
//     console.error("❌ Error creating bank payment:", error.response?.data || error.message);
//     throw error;
//   }
// };

// ✅ 2B. Update bank payment
// export const updateBankPayment = async (employeeId, bankPaymentId, data) => {
//   try {
//     const res = await API.patch(`/bank-payments/${bankPaymentId}/`, data);
//     return res.data;
//   } catch (error) {
//     console.error("❌ Error updating bank payment:", error.response?.data || error.message);
//     throw error;
//   }
// };

// 4. Get employees in my department
export const getMyDepartmentEmployees = async () => {
  const res = await API.get('/employees/my-department/');
  return res.data;
};

// 5. Fetch bank payment list
// export const getBankPayment = async (employeeId) => {
//   const res = await API.get(`/employees/${employeeId}/bank-payments/`);
//   return res.data;
// };

// 6. Update employee
export const updateEmployee = async (employeeId, data) => {
  try {
    const res = await API.patch(`/employees/${employeeId}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error updating employee:", error.response?.data || error.message);
    throw error;
  }
};
// services/employeeServices.js


export const deleteEmployee = async (employeeId) => {
  const response = await API.delete(`/employees/${employeeId}/`);
  return response.data;
};

export const fetchAllEmployees = async (page = 1, search = '') => {
  const response = await API.get(`/employees/?page=${page}&search=${search}`);
  return response.data;
};

export const fetchEmployeeById = async (id) => {
  const res = await API.get(`/employees/${id}/`);
  return res.data;
};


// ✅ Fetch all bank payments by employee ID
// export const fetchAllBankPaymentsByEmployee = async (employeeId) => {
//   const res = await API.get(`/bank-payments/${employeeId}/`);
//   return res.data; // returns an array of payment objects
// };

// 1. Get all bank payments for a specific employee
export const fetchBankPaymentsByEmployee = async (employeeId) => {
  try {
    const res = await API.get(`/employees/${employeeId}/bank-payments/`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching bank payments:", error.response?.data || error.message);
    throw error;
  }
};

// 2. Create a new bank payment for a specific employee
export const createBankPayment = async (employeeId, data) => {
  try {
    const res = await API.post(`/employees/${employeeId}/bank-payments/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Error creating bank payment:", error.response?.data || error.message);
    throw error;
  }
};

// 3. Update a specific bank payment under a specific employee
export const updateBankPayment = async (employeeId, paymentId, data) => {
  try {
    const res = await API.put(`/employees/${employeeId}/bank-payments/${paymentId}/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Error updating bank payment:", error.response?.data || error.message);
    throw error;
  }
};

// 4. Delete a specific bank payment under a specific employee
export const deleteBankPayment = async (employeeId, paymentId) => {
  try {
    const res = await API.delete(`/employees/${employeeId}/bank-payments/${paymentId}/`);
    return res.data;
  } catch (error) {
    console.error("❌ Error deleting bank payment:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchAllBankPaymentsByEmployee = async (employeeId) => {
  const response = await API.get(`/employees/${employeeId}/bank-payments/`);
  return response.data;
};

export const uploadTempImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await API.post('/upload-image/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data; // { url: 'http://.../media/file.jpg' }
};

// 2. Save employee document URLs
export const saveEmployeeDocuments = async (employeeId, data) => {
  const res = await API.post(`/employees/${employeeId}/documents/`, payload);
  return res.data;
};

// 3. Get employee documents
export const fetchEmployeeDocuments = async (employeeId) => {
  const res = await API.get(`/employees/${employeeId}/documents/`);
  return res.data;
};

// 4. Delete single document
export const deleteEmployeeDocument = async (docId) => {
  const res = await API.delete(`/documents/${docId}/`);
  return res.data;
};

// 5. Update single document (if needed)
export const updateEmployeeDocument = async (docId, data) => {
  const res = await API.put(`/documents/${docId}/`, data);
  return res.data;
};
 export const updateEmployeeDocuments = async (id, formData) => {
  const response = await API.patch(`/employees/${id}/documents/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
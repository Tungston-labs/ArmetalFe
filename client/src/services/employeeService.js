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
};

// 2. Create bank payment
export const createBankPayment = async (employeeId, data) => {
  try {
    const res = await API.post(`employees/${employeeId}/bank-payments/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Error creating bank payment:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 2B. Update bank payment
export const updateBankPayment = async (employeeId, bankPaymentId, data) => {
  try {
    const res = await API.patch(`/bank-payments/${bankPaymentId}/`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Error updating bank payment:", error.response?.data || error.message);
    throw error;
  }
};

// 3. Upload documents
export const uploadTempImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await API.post('upload-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.url; // return image URL
};

// Submit final employee documents
export const saveEmployeeDocuments = async (employeeId, data) => {
  const res = await API.post(`employees/${employeeId}/documents/`, data);
  return res.data;
};

// 4. Get employees in my department
export const getMyDepartmentEmployees = async () => {
  const res = await API.get('employees/my-department/');
  return res.data;
};

// 5. Fetch bank payment list
export const getBankPayment = async (employeeId) => {
  const res = await API.get(`employees/${employeeId}/bank-payments/`);
  return res.data;
};

// 6. Update employee
export const updateEmployee = async (employeeId, data) => {
  try {
    const res = await API.patch(`employees/${employeeId}/`, data);
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


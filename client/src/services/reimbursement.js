import API from './api';

// Fetch reimbursements grouped by date
export const getGroupedReimbursements = async () => {
  const response = await API.get("/reimbursements/grouped/");
  return response.data;
};



// Fetch reimbursements of a department by its ID
export const fetchReimbursementsByDepartment = async (departmentId, page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const response = await API.get(
    `/reimbursements/department/${departmentId}/?offset=${offset}&limit=${pageSize}`
  );
  return response.data;
};



// ✅ Update reimbursement status by Admin
export const updateReimbursementStatus = async (reimbursementId, status) => {
  try {
    const response = await API.patch(
      `/reimbursements/${reimbursementId}/`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating reimbursement status:", error);
    throw error.response?.data || error.message;
  }
};
// 🔹 Get reimbursement detail by ID
export const fetchReimbursementDetail = async (id) => {
  const response = await API.get(`/reimbursements/${id}/`);
  return response.data;
};
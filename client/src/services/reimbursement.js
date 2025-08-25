import API from './api';

// Fetch reimbursements grouped by date
export const getGroupedReimbursements = async () => {
  const response = await API.get("/reimbursements/grouped/");
  return response.data;
};



// Fetch reimbursements of a department by its ID
export const fetchReimbursementsByDepartment = async (departmentId) => {
  const response = await API.get(`/reimbursements/department/${departmentId}/`);
  return response.data;
};

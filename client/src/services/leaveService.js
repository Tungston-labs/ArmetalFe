import API from './api';

// Fetch all leave requests with optional filters
export const fetchAllLeaveRequests = async ({ page = 1, status, department_id, search }) => {
  const params = new URLSearchParams({ page });

  if (status) params.append('status', status);
  if (department_id) params.append('department_id', department_id);
  if (search) params.append('search', search);

  const response = await API.get(`/leave/admin/?${params.toString()}`);
  return response.data;
};

// Fetch leave details by ID
export const fetchLeaveDetailsById = async (id) => {
  const response = await API.get(`/leave/admin/${id}/`);
  return response.data;
};

// Update leave status
export const updateLeaveStatus = async (leaveId, status) => {
  const response = await API.patch(`/leave/admin/${leaveId}/`, { status });
  return response.data;
};

// ✅ Fixed: fetch on-leave employees by department
export const fetchOnLeaveEmployees = async (departmentId) => {
  const response = await API.get(`/departments/${departmentId}/on-leave-employees/`);
  return response.data;
};

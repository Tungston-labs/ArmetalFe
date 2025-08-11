// src/services/leaveServices.js
import API from './api';

// fetchAllLeaveRequests.js
export const fetchAllLeaveRequests = async ({ page = 1, status, department_id, search }) => {
  const params = new URLSearchParams({ page });

  if (status) params.append('status', status);
  if (department_id) params.append('department_id', department_id);
  if (search) params.append('search', search);

  const response = await API.get(`/leave/admin/?${params.toString()}`);
  return response.data;
};




export const fetchLeaveDetailsById = async (id) => {
  const response = await API.get(`/leave/admin/${id}/`);
  return response.data;
};


export const updateLeaveStatus = async (leaveId, status) => {
  const response = await API.patch(`/leave/admin/${leaveId}/`, { status });
  return response.data;
};

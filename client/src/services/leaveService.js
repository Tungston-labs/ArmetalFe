// src/services/leaveServices.js
import API from './api';

export const fetchAllLeaveRequests = async () => {
  const response = await API.get('/leave/admin/?status=pending');
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

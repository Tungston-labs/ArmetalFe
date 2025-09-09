// services/attendanceService.js
import API from './api';

export const fetchAttendanceList = async (params = {}) => {
  const response = await API.get('/admin/attendance/', { params });
  console.log('📥 Attendance API response:', response.data);
  return response.data;
};

export const fetchAttendanceDetail = async (id) => {
  console.log("idds===>",id)
  const response = await API.get(`/admin/attendance/${id}/`);
  return response.data;
};
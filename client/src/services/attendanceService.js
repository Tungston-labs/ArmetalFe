// services/attendanceService.js
import API from './api';

export const fetchAttendanceList = async (params = {}) => {
  const response = await API.get('/admin/attendance/', { params });
  console.log('📥 Attendance API response:', response.data);
  return response.data;
};

export const fetchAttendanceDetail = async (attendanceId, date) => {
  const url = date
    ? `/admin/attendance/${attendanceId}/?date=${date}`
    : `/admin/attendance/${attendanceId}/`;
  const response = await API.get(url);
  return response.data;
};

export const searchEmployees = async (params = {}) => {
  const response = await API.get("/employees/search/", { params });
  return response.data;
};

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
export const fetchDepartmentsAttendance = async ({ page = 1, search = '' }) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (page) queryParams.append('page', page);

  const response = await API.get(`/dept-attendance/?${queryParams.toString()}`);
  return response.data; // ✅ should contain results + pagination
};
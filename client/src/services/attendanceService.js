// services/attendanceService.js
import API from "./api"; // your axios instance (adjust path if needed)

export const fetchAttendanceList = async (params = {}) => {
  const response = await API.get("/admin/attendance/", { params });
  // console.log("📥 Attendance API response:", response.data);
  return response.data;
};

export const fetchAttendanceDetail = async (attendanceId, date) => {
  const url = date
    ? `/admin/attendance/${attendanceId}/?date=${encodeURIComponent(date)}`
    : `/admin/attendance/${attendanceId}/`;
  const response = await API.get(url);
  return response.data;
};

export const fetchDepartmentsAttendance = async ({ page = 1, search = "" }) => {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  const response = await API.get(`/dept-attendance/?${query.toString()}`);
  return response.data;
};

export const fetchAttendanceSummary = async ({
  year,
  month,
  token,
  page = 1,
}) => {
  const config = {
    params: { year, month, page, page_size: 20 },
  };

  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  const response = await API.get(
    "/employee-attendance/summary/",
    config
  );

  return response.data;
};

export const updateAttendance = async ({
  employee,
  date,
  status,
  day_limit,
  remark,
}) => {
  const payload = {
    employee,
    date,
    status,
    day_limit,
    remark,
  };

  console.log(
    "📤 Updating attendance:",
    payload
  );

  const response = await API.patch(
    "/attendance/update/",
    payload
  );

  console.log(
    "📥 Attendance update response:",
    response.data
  );

  return response.data;
};

// =====================================================
// SEARCH EMPLOYEES (for attendance employee lookup)
// NOTE: This is a placeholder implementation — update the
// endpoint URL/param name ("search") to match your actual
// backend route if it differs.
// =====================================================
export const searchEmployees = async (search = "") => {
  const query = new URLSearchParams();
  if (search) query.append("search", search);

  const response = await API.get(
    `/employees/search/?${query.toString()}`
  );

  return response.data;
};
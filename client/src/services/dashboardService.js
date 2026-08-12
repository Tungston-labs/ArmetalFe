// services/dashboardService.js
import API from "./api"; // Axios instance

const BASE = "/admindashboard/";

export const fetchDashboardSummary = async () => {
  const response = await API.get('/admin/dashboard-summary/');
  return response.data;
};



export const fetchDashCounts = async () => {
  const response = await API.get(`${BASE}counts/`);
  return response.data;
};

export const fetchReimbursementCounts = async () => {
  const response = await API.get(`${BASE}reimbursement/counts/`);
  return response.data;
};

export const fetchReimbursementMonthwise = async () => {
  const response = await API.get(`${BASE}reimbursement/monthwise/`);

  return response.data;
};

export const fetchDepartmentDashboard = async () => {
  const response = await API.get(`${BASE}department/`);
  return response.data;
};

export const fetchRecentEmployees = async () => {
  const response = await API.get(`${BASE}recentemployees/`);
  return response.data;
};

export const fetchContractExpiry = async () => {
  const response = await API.get(`${BASE}contract-expiry/30-days/`);
  return response.data;
};

export const fetchSimpleNotifications = async () => {
  const response = await API.get(`${BASE}simple-notifications/`);
  return response.data;
};

export const fetchTodayEmployeeStats = async () => {
  const response = await API.get(`${BASE}today-employee-stats/`);
  return response.data;
};

export const fetchHolidaySummary = async () => {
  const response = await API.get(`${BASE}holiday-summary/`);
  return response.data;
};

export const fetchProjectEmployeeCount = async () => {
  const response = await API.get(`${BASE}project/employee-count/`);
  return response.data;
};

export const fetchDashboardCounts = async () => {
  const response = await API.get(`${BASE}counts/`);
  return response.data;
};


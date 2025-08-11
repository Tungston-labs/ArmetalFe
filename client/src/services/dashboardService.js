import API from "./api"; // Your Axios instance with baseURL & headers


export const fetchDashboardSummary = async () => {
    const response = await API.get('/admin/dashboard-summary/');
    return response.data;
  };
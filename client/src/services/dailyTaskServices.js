// services/dailyTaskServices.js
import API from "./api"; // Your Axios instance with baseURL & headers


// Fetch all employees
export const fetchEmployees = async () => {
    const response = await API.get('/employees/');
    return response.data.results || [];
  };
  

// Fetch tasks for a specific employee and date
export const fetchTasksByEmployeeAndDate = async (employeeId, date) => {
    const response = await API.get(`/admin/tasks/employee/${employeeId}/`, {
      params: { date }
    });
  
    // ✅ Extract only the task list from 'results'
    return response.data.results || [];
  };
  
  
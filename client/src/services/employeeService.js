// services/employeeServices.js
import API from './api';

export const deleteEmployee = async (employeeId) => {
  const response = await API.delete(`/employees/${employeeId}/`);
  return response.data;
};



export const fetchAllEmployees = async (page = 1, search = '') => {
  const response = await API.get(`/employees/?page=${page}&search=${search}`);
  return response.data;
};


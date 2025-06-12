import API from "./api"; // Your Axios instance with baseURL & headers

// GET: List all departments
export const fetchDepartments = async () => {
  const response = await API.get("/api/departments/");
  return response.data;
};

// POST: Create a department
export const createDepartment = async (data) => {
  const response = await API.post("/api/departments/", data);
  return response.data;
};

// GET: Department detail by ID
export const fetchDepartmentById = async (id) => {
  const response = await API.get(`/api/departments/${id}/`);
  return response.data;
};

// PUT: Update department by ID
export const updateDepartment = async (id, data) => {
  const response = await API.put(`/api/departments/${id}/`, data);
  return response.data;
};

// DELETE: Delete department by ID
export const deleteDepartment = async (id) => {
  const response = await API.delete(`/api/departments/${id}/`);
  return response.data;
};




  
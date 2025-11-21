import API from "./api"; // Your Axios instance with baseURL & headers

// GET: List all departments
// services/departmentService.js

// services/departmentServices.js
export const fetchDepartments = async ({ page = 1, search = '' }) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  if (page) queryParams.append('page', page);

  const response = await API.get(`/departments/?${queryParams.toString()}`);
  return response.data; // ✅ should contain results + pagination
};

// services/departmentServices.js
export const fetchDepartmentMin = async () => {
  const response = await API.get(`/deptlist/`);
  console.log("API raw response:", response.data); // optional: for debugging
  return response.data; // returns { results: [...] }
};



// POST: Create a department
export const createDepartment = async (data) => {
  const response = await API.post("/departments/", data);
  return response.data;
};

// GET: Department detail by ID
export const fetchDepartmentById = async (id) => {
  const response = await API.get(`/departments/${id}/`);
  return response.data;
};

// list employees of a department

export const fetchEmployeesByDepartment = async (departmentId) => {
  const response = await API.get(`/employees/department/${departmentId}/`);
  return response.data;
};

// PUT: Update department by ID

export const updateDepartment = async (id, data) => {
  const response = await API.patch(`/departments/${id}/`, data); // ✅ partial update
  return response.data;
};


// DELETE: Delete department by ID
export const deleteDepartment = async (id) => {
  const response = await API.delete(`/departments/${id}/`);
  return response.data;
};


// GET: Employees by Department (Mini API: id, name, profile_pic)
export const fetchEmployeesByDepartmentMini = async (departmentId) => {
  const response = await API.get(`/employees/dep/${departmentId}/`);
  return response.data; // Returns only id, name, profile_pic
};



  
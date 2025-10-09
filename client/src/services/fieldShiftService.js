// src/services/projectService.js
import API from "./api";

// Create a new project
const createProject = async (projectData) => {
  const response = await API.post("/project/", projectData);
  return response.data;
};

// Get all projects
const getProjects = async (search = "", page = 1) => {
  const response = await API.get("/project/", {
    params: { search, page },
  });
  return response.data; 
}


// Get a single project by ID
const getProjectById = async (id) => {
  const response = await API.get(`/project/${id}/`);
  return response.data;
};

// Update a project
const updateProject = async ({ id, projectData }) => {
  const response = await API.put(`/project/${id}/`, projectData);
  return response.data;
};

// Delete a project
const deleteProject = async (id) => {
  const response = await API.delete(`/project/${id}/`);
  return response.data;
};

// Get employees not in a specific project
const getEmployeesNotInProject = async (projectId) => {
  const response = await API.get(`/project/${projectId}/employees-not-in-project/`);
  return response.data;
};


const projectService = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getEmployeesNotInProject
};

export default projectService;

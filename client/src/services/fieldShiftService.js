// src/services/projectService.js
import API from "./api";

// Create a new project
const createProject = async (projectData) => {
  const response = await API.post("/project/", projectData);
  return response.data;
};

// Get all projects
const getProjects = async () => {
  const response = await API.get("/project/");
  return response.data;
};

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

const projectService = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

export default projectService;

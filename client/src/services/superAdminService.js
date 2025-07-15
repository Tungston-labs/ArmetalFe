

// list or search comapany
import API from './api'; // axios instance

export const fetchCompany = async (page = 1, search = '') => {
  let url = `/companies/list/?page=${page}`;
  if (search && search.trim() !== '') {
    url += `&search=${search}`;
  }
  const response = await API.get(url);
  return response.data;
};


// POST: Create a Company
export const createCompany = async (data) => {
  const response = await API.post("/create-company/",data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// GET: company detail by ID
export const fetchCompanyById = async (id) => {
  const response = await API.get(`/companies/${id}/`);
  return response.data;
};

// PUT: compny  by ID
export const updateCompany = async (id, data) => {
  const response = await API.put(`/companies/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// DELETE: Delete Company by ID
export const deleteCompany = async (id) => {
  const response = await API.delete(`/companies/${id}/`);
  return response.data;
};




  
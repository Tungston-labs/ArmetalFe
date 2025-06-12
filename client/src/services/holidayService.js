import API from "./api"; // Your Axios instance with baseURL & headers


export const fetchHolidayTypes = async () => {
  const response = await API.get("/api/holiday-types/");
  return response.data;  // Expects: [{key: "public", label: "Public Holiday"}, ...]
};


// GET: List all holidays
export const fetchHolidays = async () => {
  const response = await API.get("/api/holidays/");
  return response.data.results;
};

// POST: Create a holiday
export const createHolidays = async (data) => {
  const response = await API.post("/api/holidays/",data);
  return response.data;
};

// GET: holiday detail by ID
export const fetchHolidaysById = async (id) => {
  const response = await API.get(`/api/holidays/${id}/`);
  return response.data;
};

// PUT: Update holidays by ID
export const updateHolidays = async (id, data) => {
  const response = await API.put(`/api/holidays/${id}/`, data);
  return response.data;
};

// DELETE: Delete holidays by ID
export const deleteHolidays = async (id) => {
  const response = await API.delete(`/api/holidays/${id}/`);
  return response.data;
};




  
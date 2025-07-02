import axios from "axios";

const API = axios.create({
  baseURL: "http://178.248.112.16:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ✅ Response Interceptor
API.interceptors.response.use(
  (response) => {
    // You can log or modify the response here
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    // Optional: handle global errors here
    console.error("API Error Response:", error.response);
    return Promise.reject(error);
  }
);

export default API;

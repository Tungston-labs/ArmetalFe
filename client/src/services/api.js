// src/utils/API.js or wherever you saved it
import axios from "axios";

const API = axios.create({
  baseURL: "http://178.248.112.16:8001/api",
  // baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach access token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post("http://178.248.112.16:8001/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("accessToken", newAccessToken);

        // Update and retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        localStorage.clear(); // Clear all tokens
        window.location.href = "/login"; // Or use navigate("/login")
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;

import axios from "axios";
import {toast} from "react-toastify";


const API = axios.create({
  baseURL: "http://178.248.112.16:8001/api",
  // baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (localStorage.getItem("refreshToken")|| sessionStorage.getItem("refreshToken"))
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken")|| sessionStorage.getItem("refreshToken");

        const res = await axios.post("http://178.248.112.16:8001/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        const newRefreshToken = res.data.refresh; 

        if(localStorage.getItem("refreshToken")){
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
      }else{
        sessionStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          sessionStorage.setItem("refreshToken", newRefreshToken);
        }
      }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);


export default API;

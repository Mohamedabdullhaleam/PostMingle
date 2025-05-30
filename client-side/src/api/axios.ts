// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:4500",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    const customError = new Error();
    customError.name = error.response?.status || "Unknown Status";
    customError.message = error.response?.data?.message || "An error occurred";
    return Promise.reject(customError);
  }
);

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:4500",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = new Error();
    customError.name = error.response?.status || "Unknown Status";
    customError.message = error.response?.data?.message || "An error occurred";
    return Promise.reject(customError);
  }
);

export default api;

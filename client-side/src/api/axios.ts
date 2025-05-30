// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:4500",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default api;

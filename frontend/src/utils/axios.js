import axios from "axios";

// Use environment variable in production. Set REACT_APP_API_URL to your backend base URL (e.g. https://your-backend.onrender.com/api)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

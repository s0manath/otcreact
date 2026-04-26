import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5218/LMSOTCWEBAPP/api", // Correct port from launchSettings.json
  // baseURL: "https://192.168.70.12:8667/LMSOTCWEBAPP/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

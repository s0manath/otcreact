import axios from "axios";
import { encrypt, decrypt } from "../utils/crypto-utils";

const api = axios.create({
  baseURL: "http://localhost:5218/api", // Correct port from launchSettings.json
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Encrypt POST request body
  if (config.method === "post") {
    config.data = { encryptedata: encrypt(config.data || {}) };
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Decrypt response if it contains encryptedata
    if (response.data && response.data.encryptedata) {
      try {
        response.data = decrypt(response.data.encryptedata);
      } catch (error) {
        console.error("Decryption failed:", error);
      }
    }
    return response;
  },
  (error) => {
    // Handle response with encrypted error data if needed
    if (
      error.response &&
      error.response.data &&
      error.response.data.encryptedata
    ) {
      try {
        error.response.data = decrypt(error.response.data.encryptedata);
      } catch (decError) {
        console.error("Error decryption failed:", decError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

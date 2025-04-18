import axios from "axios";

// Buat instance axios dengan konfigurasi dasar
const client = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke semua request
client.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");
  
  if (authToken && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  
  return config;
});

// Interceptor untuk menangani error response
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error untuk debugging
    console.error("API Error:", error);
    
    // Jika error 401 (Unauthorized), hapus token
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("authToken");
    }
    
    return Promise.reject(error);
  }
);

export default client;

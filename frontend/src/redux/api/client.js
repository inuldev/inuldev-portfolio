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

    // Jika error 401 (Unauthorized) atau 403 (Forbidden), hapus token dan redirect ke login
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log("Unauthorized access detected, redirecting to login");
      localStorage.removeItem("authToken");

      // Cek apakah kita sudah berada di halaman login untuk menghindari redirect loop
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        // Gunakan timeout untuk memastikan redirect terjadi setelah response handling selesai
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default client;

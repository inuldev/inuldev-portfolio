import axios from "axios";

/**
 * Konfigurasi Axios client untuk API calls
 * - Mendukung cookies untuk autentikasi
 * - Menambahkan token ke header Authorization jika tersedia
 * - Menangani error autentikasi
 */
const client = axios.create({
  withCredentials: true, // Mengaktifkan pengiriman cookies
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout 10 detik
});

/**
 * Request interceptor
 * Menambahkan token ke header Authorization jika tersedia di localStorage
 */
client.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");

    // Tambahkan token ke header jika tersedia dan belum ada
    if (authToken && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Menangani error response, terutama untuk masalah autentikasi
 */
client.interceptors.response.use(
  // Untuk response sukses, langsung kembalikan
  (response) => response,

  // Untuk response error, tangani sesuai status code
  (error) => {
    // Jika tidak ada response, kemungkinan network error
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject({
        ...error,
        message: "Koneksi ke server gagal. Periksa koneksi internet Anda.",
      });
    }

    // Tangani error autentikasi (401, 403)
    if (error.response.status === 401 || error.response.status === 403) {
      console.log("Unauthorized access detected, clearing token");

      // Hapus token dari localStorage
      localStorage.removeItem("authToken");

      // Hapus cookie token dengan berbagai cara
      const domain = window.location.hostname;
      const isSecure = window.location.protocol === "https:";

      // Opsi dasar
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Dengan domain
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;

      // Dengan secure dan sameSite jika https
      if (isSecure) {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none;";
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; secure; samesite=none;`;
      }

      console.log("Cleared token cookie due to auth error");

      // Tidak ada redirect otomatis ke halaman login
      // Sesuai dengan preferensi user untuk portfolio pribadi
    }

    return Promise.reject(error);
  }
);

export default client;

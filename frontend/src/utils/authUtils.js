/**
 * Utilitas untuk manajemen autentikasi
 * Berisi fungsi-fungsi yang digunakan di berbagai komponen
 */

/**
 * Menghapus token cookie dengan berbagai cara untuk memastikan benar-benar terhapus
 * di berbagai lingkungan (development dan production)
 */
export const clearAuthCookies = () => {
  // Dapatkan domain saat ini
  const domain = window.location.hostname;
  const isSecure = window.location.protocol === "https:";
  const isLocalhost = domain === "localhost" || domain === "127.0.0.1";
  
  console.log(`Clearing auth cookies for domain: ${domain}, secure: ${isSecure}`);
  
  // Opsi dasar
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
  // Dengan domain
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
  
  // Dengan secure dan sameSite jika https
  if (isSecure) {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none;";
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; secure; samesite=none;`;
  }
  
  // Jika bukan localhost, coba dengan domain level atas
  if (!isLocalhost) {
    const domainParts = domain.split(".");
    if (domainParts.length > 2) {
      const topDomain = domainParts.slice(-2).join(".");
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${topDomain};`;
      
      if (isSecure) {
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${topDomain}; secure; samesite=none;`;
      }
    }
  }
  
  console.log("Auth cookies cleared");
};

/**
 * Menghapus token dari localStorage dan cookie
 */
export const clearAuthData = () => {
  // Hapus token dari localStorage
  localStorage.removeItem("authToken");
  console.log("Auth token removed from localStorage");
  
  // Hapus cookie
  clearAuthCookies();
};

/**
 * Memeriksa apakah ada cookie token
 * @returns {boolean} True jika ada cookie token
 */
export const hasTokenCookie = () => {
  const cookies = document.cookie.split(";");
  return cookies.some((cookie) => cookie.trim().startsWith("token="));
};

import { User } from "../model/User.js";
import jwt from "jsonwebtoken";

/**
 * Middleware untuk autentikasi user berdasarkan token JWT
 * Token dapat disediakan melalui cookie atau header Authorization
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    // Ambil token dari cookie atau header Authorization
    let token = req.cookies.token;

    // Jika tidak ada di cookies, coba ambil dari header Authorization
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // Jika tidak ada token, kembalikan error
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Silakan login terlebih dahulu.",
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Cari user berdasarkan ID dari token
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Tambahkan user ke request
    req.user = user;
    next();
  } catch (error) {
    // Tangani error verifikasi token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid",
      });
    }

    // Tangani token kadaluarsa
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Sesi Anda telah berakhir. Silakan login kembali.",
      });
    }

    // Error lainnya
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada autentikasi",
    });
  }
};

import { User } from "../model/User.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    // Log untuk debugging
    console.log("Auth check - Cookies:", req.cookies);
    console.log("Auth check - Headers:", {
      authorization: req.headers.authorization ? "Present" : "Not present",
      origin: req.headers.origin,
      referer: req.headers.referer,
    });

    // Coba ambil token dari cookies
    let token = req.cookies.token;
    let tokenSource = "cookie";

    // Jika tidak ada di cookies, coba ambil dari header Authorization
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      // Format header: "Bearer <token>"
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        tokenSource = "header";
      }
    }

    // Jika masih tidak ada token, kembalikan error
    if (!token || token === "" || token === "undefined" || token === "null") {
      console.log("Auth failed: No valid token found");
      // Hapus cookie yang mungkin tidak valid
      res.clearCookie("token");
      return res
        .status(401)
        .json({ success: false, message: "Login to Access the resources" });
    }

    console.log(`Auth: Token found in ${tokenSource}`);

    // Verifikasi token
    let decode;
    try {
      decode = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Auth: Token verified, user ID:", decode._id);
    } catch (jwtError) {
      console.log("Auth failed: Invalid token", jwtError.message);
      // Hapus cookie yang tidak valid
      res.clearCookie("token");
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid or expired token. Please login again.",
        });
    }

    // Cari user berdasarkan ID dari token
    const user = await User.findById(decode._id);

    if (!user) {
      console.log("Auth failed: User not found for ID:", decode._id);
      // Hapus cookie yang tidak valid
      res.clearCookie("token");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("Auth successful for user:", user._id);

    // Tambahkan user ke request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    // Hapus cookie yang mungkin tidak valid
    res.clearCookie("token");
    return res.status(401).json({
      success: false,
      message: "Authentication failed: " + error.message,
    });
  }
};

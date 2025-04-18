import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    // Arahkan ke homepage, bukan ke halaman login
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;

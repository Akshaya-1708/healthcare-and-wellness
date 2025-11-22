import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// import DashboardLayout from "../Layout/DashboardLayout";

export default function ProtectedRoute() {
  const isAuthenticated = true; // replace with real auth
  const loading = false;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    // <DashboardLayout>
    //   <Outlet />  
    // </DashboardLayout>
    <Outlet />
  );
}

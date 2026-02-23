import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  // لسه بنشيّك السيشن
  if (loading) return null; // أو spinner component

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
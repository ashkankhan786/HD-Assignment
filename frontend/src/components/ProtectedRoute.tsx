import React from "react";
import { isAuthenticated } from "../utils/auth";
import { Navigate } from "react-router";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

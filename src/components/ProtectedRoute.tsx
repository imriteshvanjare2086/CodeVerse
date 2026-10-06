import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}


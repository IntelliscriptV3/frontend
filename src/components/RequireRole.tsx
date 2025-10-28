import React from "react";
import { Navigate } from "react-router-dom";

interface RequireRoleProps {
  allowed: string | string[];
  children: React.ReactElement;
}

const toArray = (v: string | string[]) => (Array.isArray(v) ? v : [v]);

export const RequireRole: React.FC<RequireRoleProps> = ({ allowed, children }) => {
  const allowedArr = toArray(allowed).map((s) => s.toLowerCase());
  // Role is stored in localStorage as 'user_role'
  const role = (typeof window !== "undefined" && localStorage.getItem("user_role")) || null;

  if (!role) {
    // no role selected -> redirect to index
    return <Navigate to="/" replace />;
  }

  if (!allowedArr.includes(role.toLowerCase())) {
    // role not permitted
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;

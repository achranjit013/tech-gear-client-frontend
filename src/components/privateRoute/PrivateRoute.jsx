import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.userInfo);

  return user?._id && user?.role === "user" && user?.status === "active" ? (
    children
  ) : (
    <Navigate
      to="/login"
      state={{
        from: { location },
      }}
    />
  );
};

export default PrivateRoute;

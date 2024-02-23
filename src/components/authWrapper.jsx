import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Router from "next/router";

function AuthWrapper({ allowedRoles = ["admin"], children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      Router.push("/login");
    }

    if (user && !allowedRoles.includes(user?.role)) {
      Router.push("/");
    }
  }, [user, allowedRoles]);

  return children;
}

export default AuthWrapper;

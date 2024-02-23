import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function AuthWrapper({ authRoles, children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    } else {
      if (!authRoles.includes(user.role)) {
        router.replace("/");
      }
    }
  }, [user, authRoles, router]);
  return authRoles.includes(user?.role) ? <>{children}</> : null;
}

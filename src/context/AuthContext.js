import Router, { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const saveUser = async (newUser) => {
    setUser(newUser);
  };

  const removeUser = () => {
    setUser(null);
  };

  useEffect(() => {
    if (Router.pathname === "/login" || Router.pathname === "/register") {
      if (user) Router.push("/");
    } else {
      if (!user) Router.push("/login");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, saveUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within a <AuthProvider />");
  }

  return value;
}

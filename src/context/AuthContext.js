import { useRouter } from "next/router";
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

  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/login" || router.pathname === "/register") {
      if (user) router.push("/");
    } else {
      if (!user) router.push("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

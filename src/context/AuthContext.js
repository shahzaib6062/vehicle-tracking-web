import DefaultSpinner from "@/components/ui/defaultSpinner";
import { auth, firestore } from "@/firebase/firebase";
import { collection, doc, getDoc } from "@firebase/firestore";
import Router from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUser = async (newUser) => {
    setUser(newUser);
  };

  const removeUser = () => {
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (Router.pathname === "/login" || Router.pathname === "/register") {
          if (user) Router.push("/");
        } else {
          if (!user) Router.push("/login");
        }

        if (!user) {
          setUser(null);
          return;
        }

        const docRef = doc(collection(firestore, "users"), user.uid);
        const userDoc = await getDoc(docRef);

        const userData = {
          id: userDoc.id,
          ...userDoc.data(),
        };

        setUser(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, saveUser, removeUser }}>
      {loading ? <DefaultSpinner /> : children}
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

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Router from "next/router";

function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        Router.replace("/admin");
      } else {
        Router.replace("/user");
      }
    } else {
      Router.replace("/login");
    }
  }, [user]);

  return null;
}

export default Home;

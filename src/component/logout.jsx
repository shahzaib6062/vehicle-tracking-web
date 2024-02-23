import React from "react";
import { Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";

const Logout = () => {
  const { removeUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();

      removeUser();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button colorScheme="teal" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;

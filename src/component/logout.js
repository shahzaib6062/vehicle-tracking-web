// Logout.js
import React from "react";
import { Button } from "@chakra-ui/react";
import { auth } from "../../firebase/firebase";
import { useUser } from "../../context/UsersContext";
import { useRouter } from "next/router";

const Logout = () => {
  const { updateUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Perform the logout operation
      await auth.signOut();

      // Update user context with empty values
      updateUser({
        uid: null,
        email: "",
        username: "",
        role: "",
      });

      // Redirect to the login page
      router.push("/login");
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

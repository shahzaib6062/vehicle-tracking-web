import React from "react";
import { Button } from "@chakra-ui/react";
import { auth } from "../../firebase/firebase";
import { useUser } from "../context/UsersContext";
import { useRouter } from "next/router";

const Logout = () => {
  const { updateUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();

      updateUser({
        uid: null,
        email: "",
        username: "",
        role: "",
      });
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

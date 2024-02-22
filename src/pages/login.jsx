import React, { useState } from "react";
import { Flex, Box, Heading, Input, Button, useToast } from "@chakra-ui/react";
import { firestore } from "../../firebase/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";
import { useUser } from "../context/UsersContext";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const router = useRouter();
  const { updateUser } = useUser();

  const handleLogin = async () => {
    try {
      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        authInstance,
        email,
        password,
      );

      const user = userCredential.user;

      const docRef = doc(collection(firestore, "users"), user.uid);

      const userDoc = await getDoc(docRef);

      if (!userDoc.exists())
        toast({
          title: "Login failed",
          description: "User data not found",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

      const userData = userDoc.data();
      const userRole = userData.role;

      updateUser({
        uid: userDoc.id,
        email: user.email,
        username: userData.username,
        role: userRole,
      });

      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh" bg="gray.100">
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Box textAlign="center">
          <Heading>Login</Heading>
        </Box>
        <Box my={4} textAlign="left">
          <Input
            placeholder="Email"
            size="lg"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            size="lg"
            type="password"
            mt={2}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button colorScheme="teal" size="lg" mt={4} onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
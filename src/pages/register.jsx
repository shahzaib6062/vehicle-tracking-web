import React, { useState } from "react";
import { Flex, Box, Heading, Input, Button, useToast } from "@chakra-ui/react";
import { auth, firestore } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const toast = useToast();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      const usersCollection = collection(firestore, "users");
      await addDoc(usersCollection, {
        uid: user.uid,
        email: user.email,
        username: username,
        role: role,
      });

      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
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
          <Heading>Register</Heading>
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
          <Input
            placeholder="Username"
            size="lg"
            mt={2}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Role (admin/user)"
            size="lg"
            mt={2}
            onChange={(e) => setRole(e.target.value)}
          />
          <Button colorScheme="teal" size="lg" mt={4} onClick={handleRegister}>
            Register
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default Register;

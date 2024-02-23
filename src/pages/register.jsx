import React, { useCallback, useState } from "react";
import { auth, firestore } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Head from "next/head";

const registerFormSchema = z.object({
  username: z.string().min(1, "Please provide a username"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const handleRegister = async ({ username, email, password }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username,
    });

    const docRef = doc(collection(firestore, "users"), user.uid);
    await setDoc(docRef, {
      username,
      email,
      role: "admin",
      uid: user.uid,
    });

    const userDoc = await getDoc(docRef);

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error(
        "The email address is already in use by another account.",
      );
    }

    throw new Error("Something went wrong.");
  }
};

function Register() {
  const toast = useToast();
  const router = useRouter();
  const { saveUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: registerUser, isPending: isRegistering } = useMutation({
    mutationFn: handleRegister,
    onSuccess: (data) => {
      saveUser(data);

      toast({
        title: "Registration successful",
        status: "success",
        isClosable: true,
      });

      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerFormSchema),
  });

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
      <Head>
        <title>Register | Vehicle Tracker</title>
      </Head>

      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          {/* <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text> */}
        </Stack>

        <form onSubmit={handleSubmit(registerUser)}>
          <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8} minW={"md"}>
            <Stack spacing={4}>
              <FormControl id="username" isInvalid={errors.username}>
                <FormLabel htmlFor="username">User Name</FormLabel>
                <Input type="text" {...register("username")} />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>

              <FormControl id="email" isInvalid={errors.email}>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input type="text" {...register("email")} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl id="password" isInvalid={errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />

                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{ bg: "blue.500" }}
                  type="submit"
                  isLoading={isRegistering}
                  loadingText="Registering..."
                >
                  Register
                </Button>
              </Stack>

              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    color="blue.400"
                    _hover={{ color: "blue.500" }}
                    href="/login"
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
}

export default Register;

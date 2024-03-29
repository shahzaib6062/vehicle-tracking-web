import React, { useState } from "react";
import { auth, firestore } from "@/firebase/firebase";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";
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
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Head from "next/head";
import { Link } from "@chakra-ui/next-js";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Please provide a password"),
});

const handleLogin = async ({ email, password }) => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    const docRef = doc(collection(firestore, "users"), user.uid);

    const userDoc = await getDoc(docRef);

    if (!userDoc.exists())
      throw new Error("Invalid Credentials. Please try again.");

    if (!userDoc.data().isActive) {
      await signOut(auth);

      throw new Error("Your account is disabled. Please contact an Admin.");
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      throw new Error("Invalid Credentials. Please try again.");
    }

    throw error;
  }
};

function Login() {
  const toast = useToast();
  const router = useRouter();
  const { saveUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: login, isPending: isLoggingIn } = useMutation({
    mutationFn: handleLogin,
    onSuccess: async (data) => {
      saveUser(data);

      if (data.role === "admin") {
        toast({
          title: "Login successful",
          status: "success",
          isClosable: true,
        });

        router.push("/admin");
      } else {
        await auth.signOut();

        toast({
          title: "Login Failed",
          description: "You are not authorized to access admin panel. Please use the mobile app.",
          status: "warning",
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Login failed",
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
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
      <Head>
        <title>Login | RoadRanger</title>
      </Head>

      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
          {/* <Text fontSize={"lg"} color={"gray.600"}>
          to enjoy all of our cool features ✌️
        </Text> */}
        </Stack>

        <form onSubmit={handleSubmit(login)}>
          <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8} minW={"md"}>
            <Stack spacing={4}>
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
                  isLoading={isLoggingIn}
                  loadingText="Logging in..."
                >
                  Login
                </Button>
              </Stack>

              {/* <Stack pt={6}>
                <Text align={"center"}>
                  Don&apos;t have an account?{" "}
                  <Link
                    color="blue.400"
                    _hover={{ color: "blue.500" }}
                    href="/register"
                  >
                    Register
                  </Link>
                </Text>
              </Stack> */}
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
}

export default Login;

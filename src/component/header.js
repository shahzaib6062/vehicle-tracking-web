import React from "react";
import {
  Box,
  Flex,
  Spacer,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import Logout from "./logout";
import { useUser } from "../../context/UsersContext";
const Header = () => {
  const { currentUser } = useUser();
  console.log("🚀 ~ Header ~ currentUser:", currentUser);

  return (
    <Flex p={4} bg="teal.500" color="white">
      <Box>
        <span>Your App Name</span>
      </Box>
      <Spacer />
      <Avatar
        size="sm"
        name={currentUser?.username}
        src={currentUser?.avatar}
      />
      {currentUser?.username}
      <Logout />
    </Flex>
  );
};

export default Header;

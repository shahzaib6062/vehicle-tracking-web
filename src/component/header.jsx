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
import { useAuth } from "../context/AuthContext";
const Header = () => {
  const { currentUser } = useAuth();

  return (
    <Flex
      p={4}
      bg="teal.500"
      color="white"
      align={"center"}
      justifyContent={"space-between"}
    >
      <Box>
        <span className="App-Logo">View Tech</span>
      </Box>

      <Flex align={"center"} gap={"10px"}>
        <Avatar
          size="sm"
          name={currentUser?.username}
          src={currentUser?.avatar}
        />
        {currentUser?.username}

        <Logout />
      </Flex>
    </Flex>
  );
};

export default Header;

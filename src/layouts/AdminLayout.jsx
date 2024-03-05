import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/firebase";
import { Link } from "@chakra-ui/next-js";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { signOut } from "@firebase/auth";
import Router from "next/router";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiMenu,
  FiChevronDown,
} from "react-icons/fi";

const linkItems = [
  { name: "Home", icon: FiHome, href: "/admin" },
  { name: "Users", icon: FiUsers, href: "/admin/users" },
  {
    name: "Service Providers",
    icon: FiSettings,
    href: "/admin/service-providers",
  },
];

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={"white"}
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={{ base: "full", md: 256 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        mb="4"
      >
        <Text fontSize="xl" fontFamily="monospace" fontWeight="bold">
          RoadRanger
        </Text>
        <CloseButton onClick={onClose} display={{ base: "flex", md: "none" }} />
      </Flex>

      <VStack alignItems="stretch">
        {linkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} href={link.href}>
            {link.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link href={rest.href} style={{ textDecoration: "none" }}>
      <Box _focus={{ boxShadow: "none" }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={
            Router.pathname === rest.href
              ? {}
              : { bg: "blue.200", color: "white" }
          }
          bg={Router.pathname === rest.href ? "blue.400" : "transparent"}
          color={Router.pathname === rest.href ? "white" : "gray.900"}
          transition={"all 0.1s ease"}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    </Link>
  );
};

const Header = ({ onOpen, ...rest }) => {
  const { user, removeUser } = useAuth();

  const { username, role } = user || {};

  const logout = async () => {
    await signOut(auth);
    removeUser();
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={"white"}
      borderBottomWidth="1px"
      borderBottomColor={"gray.200"}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        RoadRanger
      </Text>

      <Flex alignItems={"center"}>
        <Menu>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: "none" }}
          >
            <HStack>
              <Avatar size={"sm"} name={username} />
              <VStack
                display={{ base: "none", md: "flex" }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
                mr="6"
              >
                <Text fontSize="sm">{username}</Text>
                <Text fontSize="xs" color="gray.600">
                  {role === "admin" ? "Admin" : "Normal User"}
                </Text>
              </VStack>
              <Box display={{ base: "none", md: "flex" }}>
                <FiChevronDown />
              </Box>
            </HStack>
          </MenuButton>
          <MenuList bg={"white"} borderColor={"gray.200"}>
            <MenuItem>Profile</MenuItem>
            <MenuDivider />
            <MenuItem onClick={logout}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

const AdminLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={"gray.100"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Header onOpen={onOpen} />

      <Box ml={{ base: 0, md: 256 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;

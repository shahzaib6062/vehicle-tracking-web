import React, { useRef, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  HStack,
  Badge,
  Heading,
  useDisclosure,
  Button,
  Text,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Flex,
  Avatar,
  Image,
} from "@chakra-ui/react";
import {
  useAllUsers,
  useDisableUser,
  useEnableUser,
} from "@/lib/users";
import DefaultSpinner from "@/components/ui/defaultSpinner";
import { CheckCircleIcon, NotAllowedIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";

function UserStatusConfirmationDialog({
  isOpen,
  onClose,
  user,
  action = "disable",
}) {
  const cancelRef = useRef();

  const { mutateAsync: disableUser, isPending: disableIsLoading } =
    useDisableUser();

  const { mutateAsync: enableUser, isPending: enableIsLoading } =
    useEnableUser();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {action === "disable" ? "Disable" : "Enable"} User
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to{" "}
            {action === "disable" ? "disable " : "enable "}
            <Text fontWeight={"bold"} display={"inline"}>
              {user?.username}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>

            {action === "disable" && (
              <Button
                colorScheme="red"
                onClick={async () => {
                  await disableUser(user.uid);
                  onClose();
                }}
                ml={3}
                isLoading={disableIsLoading}
                loadingText="Disabling..."
              >
                Disable
              </Button>
            )}

            {action === "enable" && (
              <Button
                colorScheme="green"
                onClick={async () => {
                  await enableUser(user.uid);
                  onClose();
                }}
                ml={3}
                isLoading={enableIsLoading}
                loadingText="Enabling..."
              >
                Enable
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

function UserInfoModal({ isOpen, onClose, user }) {
  const { data: users } = useAllUsers();
  const currentUser = users.find((u) => u.uid === user?.uid);
  const { uid, username, email, role, isActive } = currentUser || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Info</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w={"full"} bg={"white"} rounded={"md"} overflow={"hidden"}>
            <Image
              h={"120px"}
              w={"full"}
              src={
                "https://images.unsplash.com/photo-1563197527-b5677321c356?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              }
              objectFit="cover"
              alt="#"
            />
            <Flex justify={"center"} mt={-12}>
              <Avatar
                size={"xl"}
                name={username}
                css={{ border: "2px solid white" }}
                bg={"cyan.200"}
                color={"cyan.800"}
              />
            </Flex>

            <Box p={6}>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={500}>
                  {username}
                </Heading>
                <Text color={"gray.500"}>{email}</Text>
              </Stack>

              <Stack direction={"row"} justify={"center"} spacing={10}>
                <Stack spacing={1} align={"center"}>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Status
                  </Text>

                  <Badge colorScheme={isActive ? "green" : "yellow"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </Stack>
                <Stack spacing={1} align={"center"}>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Role
                  </Text>
                  <Badge colorScheme={role === "admin" ? "cyan" : "gray"}>
                    {role === "admin" ? "Admin" : "User"}
                  </Badge>
                </Stack>
              </Stack>

              <Link href={`/admin/users/${uid}`}>
                <Button w={"full"} mt={8} rounded={"md"} colorScheme={"blue"}>
                  Go to Details
                </Button>
              </Link>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default function UsersTable() {
  const { data: users, isLoading } = useAllUsers();
  const {
    isOpen: isStatusChangeOpen,
    onClose: onStatusChangeClose,
    onOpen: onStatusChangeOpen,
  } = useDisclosure();
  const {
    isOpen: isUserInfoOpen,
    onClose: onUserInfoClose,
    onOpen: onUserInfoOpen,
  } = useDisclosure();
  const [activeUser, setActiveUser] = useState(null);
  const [action, setAction] = useState("disable");

  const initUserDisable = (user) => {
    setAction("disable");
    setActiveUser(user);
    onStatusChangeOpen();
  };

  const initUserEnable = (user) => {
    setAction("enable");
    setActiveUser(user);
    onStatusChangeOpen();
  };

  const cancelStatusChange = () => {
    setAction("disable");
    setActiveUser(null);
    onStatusChangeClose();
  };

  const openUserInfoModal = (user) => {
    setActiveUser(user);
    onUserInfoOpen();
  };

  const closeUserInfoModal = () => {
    setActiveUser(null);
    onUserInfoClose();
  };

  if (isLoading) return <DefaultSpinner />;

  return (
    <Box borderRadius="md" bg="white" p="4" m="4" minH="320" shadow="sm">
      <Heading size="xl">All Users</Heading>

      <UserStatusConfirmationDialog
        isOpen={isStatusChangeOpen}
        onClose={cancelStatusChange}
        user={activeUser}
        action={action}
      />

      <UserInfoModal
        isOpen={isUserInfoOpen}
        onClose={closeUserInfoModal}
        user={activeUser}
      />

      <TableContainer mt="6">
        <Table variant="simple">
          <Thead>
            <Tr bg="blue.400">
              <Th
                borderTopLeftRadius={"lg"}
                borderBottomLeftRadius={"lg"}
                p={0}
                w={0}
              />
              {["Username", "Email Address", "Role", "Status", "Actions"].map(
                (title) => (
                  <Th key={title} color="white" py="6">
                    {title}
                  </Th>
                ),
              )}
              <Th
                borderTopRightRadius={"lg"}
                borderBottomRightRadius={"lg"}
                p={0}
              />
            </Tr>
          </Thead>

          <Tbody>
            {users?.map((user) => (
              <Tr key={user.uid}>
                <Td />
                <Td fontWeight={"medium"}>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge colorScheme={user.role === "admin" ? "cyan" : "gray"}>
                    {user.role === "admin" ? "Admin" : "User"}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={user.isActive ? "green" : "yellow"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <HStack>
                    <Tooltip label="View User Details">
                      <IconButton
                        variant={"ghost"}
                        colorScheme="blue"
                        icon={<ViewIcon />}
                        onClick={() => openUserInfoModal(user)}
                      />
                    </Tooltip>

                    {user.isActive ? (
                      <Tooltip label="Disable User">
                        <IconButton
                          variant={"ghost"}
                          colorScheme={user.role === "admin" ? "white" : "red"}
                          opacity={user.role === "admin" ? 0.5 : 1}
                          icon={<NotAllowedIcon />}
                          disabled={user.role === "admin"}
                          cursor={user.role === "admin" ? "default" : "pointer"}
                          onClick={() =>
                            user.role !== "admin" && initUserDisable(user)
                          }
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip label="Enable User">
                        <IconButton
                          variant={"ghost"}
                          colorScheme={
                            user.role === "admin" ? "white" : "green"
                          }
                          opacity={user.role === "admin" ? 0.5 : 1}
                          icon={<CheckCircleIcon />}
                          disabled={user.role === "admin"}
                          cursor={user.role === "admin" ? "default" : "pointer"}
                          onClick={() =>
                            user.role !== "admin" && initUserEnable(user)
                          }
                        />
                      </Tooltip>
                    )}
                  </HStack>
                </Td>
                <Td />
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

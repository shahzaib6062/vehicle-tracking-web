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
  Link,
  IconButton,
  HStack,
  Badge,
  Heading,
  useDisclosure,
  Button,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useActiveUsers, useDisableUser, useEnableUser } from "@/lib/users";
import DefaultSpinner from "@/components/ui/defaultSpinner";
import {
  CheckCircleIcon,
  CheckIcon,
  DeleteIcon,
  NotAllowedIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";

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

export default function UsersTable() {
  const { data: users, isLoading } = useActiveUsers();
  const {
    isOpen: isStatusChangeOpen,
    onClose: onStatusChangeClose,
    onOpen: onStatusChangeOpen,
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

import React from "react";
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
} from "@chakra-ui/react";
import Router from "next/router";
import { useAllUsers } from "@/lib/users";
import DefaultSpinner from "@/components/ui/defaultSpinner";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";

export default function UsersTable() {
  const { data: users, isLoading } = useAllUsers();

  const handleRowClick = (id) => {
    Router.push(`/admin/users/${id}`);
  };

  if (isLoading) return <DefaultSpinner />;

  return (
    <Box borderRadius="md" bg="white" p="4" m="4" minH="320" shadow="sm">
      <Heading size="xl">All Users</Heading>

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
              {["Username", "Email Address", "ID", "Role", "Actions"].map(
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
                <Td>{user.uid}</Td>
                <Td>
                  <Badge colorScheme={user.role === "admin" ? "blue" : "green"}>
                    {user.role === "admin" ? "Admin" : "User"}
                  </Badge>
                </Td>
                <Td>
                  <HStack>
                    <Link href={`/admin/users/${user.uid}`}>
                      <IconButton
                        variant={"ghost"}
                        colorScheme="blue"
                        icon={<ViewIcon />}
                      />
                    </Link>

                    <IconButton
                      variant={"ghost"}
                      colorScheme={user.role === "admin" ? "white" : "red"}
                      opacity={user.role === "admin" ? 0.5 : 1}
                      icon={<DeleteIcon />}
                      disabled={user.role === "admin"}
                    />
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

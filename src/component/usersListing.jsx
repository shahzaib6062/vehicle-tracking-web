import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  TableContainer,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setAllUsers(users);
      setLoading(false);
    };

    fetchData();
  }, []);
  const handleRowClick = (id) => {
    router.push(`/admin/${id}`);
  };

  return loading ? (
    <Spinner size="xl" />
  ) : (
    <ChakraProvider>
      <Box p={4}>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allUsers.map((user) => (
                <Tr
                  key={user.uid}
                  onClick={() => handleRowClick(user.uid)}
                  style={{ cursor: "pointer" }}
                >
                  <Td>{user.uid}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </ChakraProvider>
  );
}

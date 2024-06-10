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
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useAllQueries, useDeleteQuery } from "@/lib/users";
import DefaultSpinner from "@/components/ui/defaultSpinner";
import { DeleteIcon } from "@chakra-ui/icons";

function QueryDeletionConfirmationDialog({ isOpen, onClose, selectedQuery }) {
  const cancelRef = useRef();

  const { mutateAsync: deleteQuery, isPending: deleteIsLoading } =
    useDeleteQuery();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Query
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete the query from{" "}
            <Text fontWeight={"bold"} display={"inline"}>
              {selectedQuery?.email}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>

            <Button
              colorScheme="red"
              onClick={async () => {
                await deleteQuery(selectedQuery.uid);
                onClose();
              }}
              ml={3}
              isLoading={deleteIsLoading}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default function QueriesProviderTable() {
  const [selectedQuery, setSelectedQuery] = useState(null);

  const {
    isOpen: isQueryDeletionConfirmationOpen,
    onOpen: openQueryDeletionConfirmation,
    onClose: closeQueryDeletionConfirmation,
  } = useDisclosure();

  const { data: queries, isLoading: queriesIsLoading } = useAllQueries();
  console.log("🚀 ~ QueriesProviderTable ~ queries:", queries);

  const openDeleteQueryDialog = (query) => {
    setSelectedQuery(query);
    openQueryDeletionConfirmation();
  };

  const closeDeleteQueryDialog = () => {
    setSelectedQuery(null);
    closeQueryDeletionConfirmation();
  };

  if (queriesIsLoading) return <DefaultSpinner />;

  return (
    <Box borderRadius="md" bg="white" p="4" m="4" minH="320" shadow="sm">
      <Flex alignItems={"center"} mb={"4"}>
        <Heading size="xl">All Queries</Heading>

        <Spacer />
      </Flex>

      <QueryDeletionConfirmationDialog
        isOpen={isQueryDeletionConfirmationOpen}
        selectedQuery={selectedQuery}
        onClose={closeDeleteQueryDialog}
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
              {["Email", "Message", "Actions"].map((label) => (
                <Th key={label} color="white" py="6">
                  {label}
                </Th>
              ))}
              <Th
                borderTopRightRadius={"lg"}
                borderBottomRightRadius={"lg"}
                p={0}
              />
            </Tr>
          </Thead>

          <Tbody>
            {queries?.map((query) => (
              <Tr key={query.uid}>
                <Td />
                <Td fontWeight={"medium"}>{query.email}</Td>
                <Td>{query.message}</Td>
                <Td>
                  <HStack>
                    <Tooltip label="Delete Query">
                      <IconButton
                        variant={"ghost"}
                        colorScheme="red"
                        icon={<DeleteIcon />}
                        onClick={() => openDeleteQueryDialog(query)}
                      />
                    </Tooltip>
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

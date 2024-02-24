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
  Spacer,
  Grid,
} from "@chakra-ui/react";
import { useAllUsers, useDisableUser, useEnableUser } from "@/lib/users";
import DefaultSpinner from "@/components/ui/defaultSpinner";
import {
  CheckCircleIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { FiPlus } from "react-icons/fi";
import UpsertServiceProviderForm from "./upsertServiceProviderForm";
import {
  useAllServiceProviders,
  useDeleteServiceProvider,
} from "@/lib/serviceProviders";
import { SERVICES } from "@/utils/constants";

function ProviderDeletionConfirmationDialog({
  isOpen,
  onClose,
  selectedProvider,
}) {
  const cancelRef = useRef();

  const { mutateAsync: deleteProvider, isPending: deleteIsLoading } =
    useDeleteServiceProvider();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Service Provider
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete{" "}
            <Text fontWeight={"bold"} display={"inline"}>
              {selectedProvider?.title}
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
                await deleteProvider(selectedProvider.uid);
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

function UpsertServiceProviderModal({ isOpen, onClose, selectedProvider }) {
  const isEditing = !!selectedProvider;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Edit" : "Add"} Service Provider</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UpsertServiceProviderForm
            closeModal={onClose}
            selectedProvider={selectedProvider}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const servicesColorMap = {
  fuel: "blue",
  tire: "yellow",
  jumpStart: "green",
  lockout: "red",
};

export default function ServiceProvidersTable() {
  const [selectedProvider, setSelectedProvider] = useState(null);

  const {
    isOpen: isUpsertModalOpen,
    onOpen: openUpsertModal,
    onClose: closeUpsertModal,
  } = useDisclosure();

  const {
    isOpen: isProviderDeletionConfirmationOpen,
    onOpen: openProviderDeletionConfirmation,
    onClose: closeProviderDeletionConfirmation,
  } = useDisclosure();

  const { data: serviceProviders, isLoading: serviceProvidersIsLoading } =
    useAllServiceProviders();

  const openEditProviderModal = (provider) => {
    setSelectedProvider(provider);
    openUpsertModal();
  };

  const closeEditProviderModal = () => {
    setSelectedProvider(null);
    closeUpsertModal();
  };

  const openDeleteProviderDialog = (provider) => {
    setSelectedProvider(provider);
    openProviderDeletionConfirmation();
  };

  const closeDeleteProviderDialog = () => {
    setSelectedProvider(null);
    closeProviderDeletionConfirmation();
  };

  if (serviceProvidersIsLoading) return <DefaultSpinner />;

  return (
    <Box borderRadius="md" bg="white" p="4" m="4" minH="320" shadow="sm">
      <Flex alignItems={"center"} mb={"4"}>
        <Heading size="xl">All Service Providers</Heading>

        <Spacer />

        <Button
          variant={"outline"}
          colorScheme="blue"
          size="sm"
          onClick={() => openUpsertModal()}
          leftIcon={<FiPlus />}
          mt="1"
        >
          Add Service Provider
        </Button>
      </Flex>

      <UpsertServiceProviderModal
        isOpen={isUpsertModalOpen}
        onClose={selectedProvider ? closeEditProviderModal : closeUpsertModal}
        selectedProvider={selectedProvider}
      />

      <ProviderDeletionConfirmationDialog
        isOpen={isProviderDeletionConfirmationOpen}
        selectedProvider={selectedProvider}
        onClose={closeDeleteProviderDialog}
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
              {["Title", "Email", "Services", "Actions"].map((title) => (
                <Th key={title} color="white" py="6">
                  {title}
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
            {serviceProviders?.map((serviceProvider) => (
              <Tr key={serviceProvider.uid}>
                <Td />
                <Td fontWeight={"medium"}>{serviceProvider.title}</Td>
                <Td>{serviceProvider.email}</Td>
                <Td>
                  <Flex wrap={"wrap"} gap={"2"} maxW={340}>
                    {serviceProvider.availableServices.map((service) => (
                      <Badge
                        key={service}
                        colorScheme={servicesColorMap[service]}
                        mr="2"
                      >
                        {SERVICES.find((s) => s.value === service).label}
                      </Badge>
                    ))}
                  </Flex>
                </Td>

                <Td>
                  <HStack>
                    <Tooltip label="Edit Service Provider">
                      <IconButton
                        variant={"ghost"}
                        colorScheme="blue"
                        icon={<EditIcon />}
                        onClick={() => openEditProviderModal(serviceProvider)}
                      />
                    </Tooltip>

                    <Tooltip label="Delete Service Provider">
                      <IconButton
                        variant={"ghost"}
                        colorScheme="red"
                        icon={<DeleteIcon />}
                        onClick={() => openDeleteProviderDialog(serviceProvider)}
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

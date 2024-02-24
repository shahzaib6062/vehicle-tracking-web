import {
  useAddServiceProvider,
  useUpdateServiceProvider,
} from "@/lib/serviceProviders";
import { SERVICES } from "@/utils/constants";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Checkbox,
  FormErrorMessage,
  CheckboxGroup,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const serviceProviderFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  availableServices: z
    .array(z.string())
    .nonempty("Please select at least one service"),
});

function UpsertServiceProviderForm({ closeModal, selectedProvider }) {
  const {
    mutateAsync: addServiceProvider,
    isPending: addServiceProviderIsLoading,
  } = useAddServiceProvider();

  const {
    mutateAsync: updateServiceProvider,
    isPending: updateServiceProviderIsLoading,
  } = useUpdateServiceProvider();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
  } = useForm({
    defaultValues: {
      title: "",
      email: "",
      availableServices: [],
    },
    resolver: zodResolver(serviceProviderFormSchema),
  });
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectedProvider) {
      setValue("title", selectedProvider?.title);
      setValue("email", selectedProvider?.email);
      setValue("availableServices", selectedProvider?.availableServices);
      setSelectAll(
        selectedProvider?.availableServices?.length === SERVICES.length,
      );
    }
  }, [selectedProvider, setValue]);

  const allServicesChangeHandler = (e) => {
    clearErrors("availableServices");
    const { checked } = e.target;

    setSelectAll(checked);

    const updatedAvailableServices = checked
      ? SERVICES.map((s) => s.value)
      : [];

    setValue("availableServices", updatedAvailableServices);
  };

  const handleServiceChange = (checked, service) => {
    clearErrors("availableServices");
    const availableServices = getValues("availableServices");

    const updatedAvailableServices = checked
      ? [...availableServices, service]
      : availableServices.filter((s) => s !== service);

    setValue("availableServices", updatedAvailableServices);
    setSelectAll(updatedAvailableServices.length === SERVICES.length);
  };

  const handleFormSubmit = async (data) => {
    if (selectedProvider) {
      await updateServiceProvider({
        ...data,
        uid: selectedProvider.uid,
      });
    } else {
      await addServiceProvider(data);
    }

    closeModal();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={4} pb="4">
        <FormControl id="title" isRequired isInvalid={errors.title}>
          <FormLabel>Service Provider Title</FormLabel>
          <Input
            placeholder="Awesome Services Inc."
            type="text"
            {...register("title")}
          />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl id="email" isRequired isInvalid={errors.email}>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="service.provider@example.com"
            type="email"
            {...register("email")}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          id="availableServices"
          isInvalid={errors.availableServices}
        >
          <FormLabel>Available Services</FormLabel>
          <Checkbox onChange={allServicesChangeHandler} isChecked={selectAll}>
            Select All
          </Checkbox>
          <CheckboxGroup
            colorScheme="cyan"
            value={getValues("availableServices")}
          >
            <Stack ml={2} mt={2}>
              {SERVICES.map((service) => (
                <Checkbox
                  key={service.value}
                  onChange={(e) =>
                    handleServiceChange(e.target.checked, service.value)
                  }
                  isChecked={getValues("availableServices").includes(
                    service.value,
                  )}
                >
                  {service.label}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>

          <FormErrorMessage>
            {errors.availableServices?.message}
          </FormErrorMessage>
        </FormControl>

        <Stack mt="4">
          <Button
            w="full"
            size={"lg"}
            colorScheme={selectedProvider ? "blue" : "green"}
            type="submit"
            loadingText={selectedProvider ? "Updating..." : "Adding..."}
            isLoading={
              selectedProvider
                ? updateServiceProviderIsLoading
                : addServiceProviderIsLoading
            }
          >
            {selectedProvider ? "Update " : "Add "} Service Provider
          </Button>
          <Button w="full" colorScheme="red" onClick={closeModal}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default UpsertServiceProviderForm;

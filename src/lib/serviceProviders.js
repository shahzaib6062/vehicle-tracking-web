import { firestore } from "@/firebase/firebase";
import { useToast } from "@chakra-ui/toast";
import {
  collection,
  doc,
  getDocs,
  query,
  addDoc,
  setDoc,
  deleteDoc,
  where
} from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllServiceProviders() {
  return useQuery({
    queryKey: ["serviceProviders"],
    queryFn: async () => {
      const q = query(collection(firestore, "users"), where("isServiceAccount", "==", true));
      const querySnapshot = await getDocs(q);

      const serviceProviders = [];

      querySnapshot.forEach((doc) => {
        serviceProviders.push({
          uid: doc.id,
          id: doc.id,
          ...doc.data(),
        });
      });

      return serviceProviders;
    },
  });
}

export function useAddServiceProvider(mutationArgs) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceProvider) => {
      const docRef = await addDoc(
        collection(firestore, "serviceProviders"),
        serviceProvider,
      );

      return docRef.id;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });

      toast({
        title: "Service Provider added successfully",
        status: "success",
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Failed to add service provider",
        status: "error",
        isClosable: true,
      });
    },
    ...mutationArgs,
  });
}

export function useUpdateServiceProvider(mutationArgs) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceProvider) => {
      const docRef = doc(firestore, "serviceProviders", serviceProvider.uid);

      await setDoc(docRef, serviceProvider, { merge: true });

      return serviceProvider.uid;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });

      toast({
        title: "Service Provider updated successfully",
        status: "success",
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Failed to update service provider",
        status: "error",
        isClosable: true,
      });
    },
    ...mutationArgs,
  });
}

export function useDeleteServiceProvider(mutationArgs) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid) => {
      const docRef = doc(firestore, "serviceProviders", uid);

      await deleteDoc(docRef);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["serviceProviders"] });

      toast({
        title: "Service Provider deleted successfully",
        status: "success",
        isClosable: true,
      });
    },
    ...mutationArgs,
  });
}

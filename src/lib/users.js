import { firestore } from "@/firebase/firebase";
import { useToast } from "@chakra-ui/toast";
import {
  collection,
  doc,
  getDocs,
  query,
  deleteDoc,
  setDoc,
  where,
} from "@firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const q = query(
        collection(firestore, "users"),
        where("isServiceAccount", "==", false),
      );
      const querySnapshot = await getDocs(q);

      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        users.push({
          uid: doc.id,
          role: userData.role || "user",
          ...userData,
        });
      });

      return users;
    },
  });
}

export function useDisableUser(mutationArgs) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid) => {
      const docRef = doc(firestore, "users", uid);
      await setDoc(docRef, { isActive: false }, { merge: true });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "User disabled successfully",
        status: "success",
        isClosable: true,
      });
    },
    ...mutationArgs,
  });
}

export function useEnableUser(mutationArgs) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid) => {
      const docRef = doc(firestore, "users", uid);
      await setDoc(docRef, { isActive: true }, { merge: true });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast({
        title: "User enabled successfully",
        status: "success",
        isClosable: true,
      });
    },
    ...mutationArgs,
  });
}

export function useAllQueries() {
  return useQuery({
    queryKey: ["queries"],
    queryFn: async () => {
      const q = query(collection(firestore, "userQueries"));
      const querySnapshot = await getDocs(q);
      const queries = [];
      querySnapshot.forEach((doc) => {
        const queryData = doc.data();
        queries.push({
          uid: doc.id,
          ...queryData,
        });
      });
      return queries;
    },
  });
}

export function useDeleteQuery(mutationArgs) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid) => {
      const docRef = doc(firestore, "userQueries", uid);
      await deleteDoc(docRef);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["queries"] });

      toast({
        title: "Query deleted successfully",
        status: "success",
        isClosable: true,
      });
    },
    ...mutationArgs,
  });
}

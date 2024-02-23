import { db } from "@/firebase/firebase";
import { collection, getDocs, query } from "@firebase/firestore";
import { useQuery } from "@tanstack/react-query";

export function useAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);

      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // if (userData.role !== "admin")
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

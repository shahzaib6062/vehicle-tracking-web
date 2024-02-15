import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, firestore } from "../../../firebase/firebase";
<<<<<<< HEAD:src/pages/admin/[id].js
import { collection, query, where, getDocs } from "firebase/firestore";
import AuthWrapper from "@/component/authWrapper";
=======
import { collection, query, where, getDocs, doc } from "firebase/firestore";
>>>>>>> 1b9198d39fab32cd32af237b7c2b45fd363db386:src/pages/admin/[id].jsx
export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, "users", id);
      const q = query(collection(db, "users"), where("uid", "==", id));
      const querySnapshot = await getDocs(q);

      if (id) {
        fetchUserData();
      }
    };
  }, [id]);

  if (!userData) {
    console.log("🚀 ~ UserDetails ~ userData:", userData);
    return <div>Loading...</div>;
  }

  return (
    <AuthWrapper authRoles={["admin"]}>
      <div>
        <h1>User Details</h1>
        <p>ID: {userData.id}</p>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
      </div>
    </AuthWrapper>
  );
}

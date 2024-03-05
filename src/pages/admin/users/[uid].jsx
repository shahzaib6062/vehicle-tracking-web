import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, firestore } from "../../../firebase/firebase";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import AuthWrapper from "@/components/authWrapper";
import { doc } from "firebase/firestore";
export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const { uid } = Router.query;

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(collection(firestore, "users"), uid);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <AuthWrapper authRoles={["admin"]}>
      <div>
        <h1>User Details</h1>
        <p>ID: {userData.uid}</p>
        <p>Name: {userData.username}</p>
        <p>Email: {userData.email}</p>
      </div>
    </AuthWrapper>
  );
}

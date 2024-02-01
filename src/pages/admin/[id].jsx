import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, firestore } from "../../../firebase/firebase";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      <p>ID: {userData.id}</p>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      {/* Display more user details as needed */}
    </div>
  );
}

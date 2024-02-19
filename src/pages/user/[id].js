import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Header from "@/component/header";
import AuthWrapper from "@/component/authWrapper";
import { db } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import MapComponent from "@/component/MapComponent";
import { Flex } from "@chakra-ui/react";
export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);
  console.log("🚀 ~ UserDetails ~ userData:", userData)
  const [vehicleData, setVehicleData] = useState(null);
  console.log("🚀 ~ UserDetails ~ vehicleData:", vehicleData)
  const [location, setLocation] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserData(doc.data());
      });
    };

    const fetchVehicleData = async () => {
      const q = query(collection(db, "vehicles"), where("userId", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setVehicleData(doc.data());
      });
    };

    if (id) {
      fetchUserData();
      fetchVehicleData();
      fetchDataLocation();
    }
  }, [id]);

  const fetchDataLocation = useCallback(async () => {
    const locationQ = query(
      collection(db, "locations")
      // ,      where("uid", "==", id)
    );
    const locationSnapshot = await getDocs(locationQ);
    locationSnapshot.forEach((locationDoc) => {
      setLocation(locationDoc.data());
      console.log(locationDoc.id, " => ", locationDoc.data());
    });
  }, [id]);

  return (
    <AuthWrapper authRoles={["user"]}>
      <Header />
          {userData && (
            <>
      <Flex direction="column" >
      <div>  <MapComponent location={location
        } />
        </div>
        <div>
        <h1>{userData.username}</h1>
        <h2>{userData.email}</h2>
        <h3>{userData.role}</h3>
        </div>
      </Flex>
      </>
          )}
     </AuthWrapper>
  );
}

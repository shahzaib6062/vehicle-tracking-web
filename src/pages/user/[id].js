import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import Header from "@/component/header";
import AuthWrapper from "@/component/authWrapper";
import { db } from "../../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Image } from "@chakra-ui/react";
import MapComponent from "@/component/MapComponent";

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [location, setLocation] = useState(null);
  console.log("🚀 ~ UserDetails ~ location:", location);
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
    <>
      <Header />
      <Flex direction="column" align="center" justify="center" h="100vh" p={6}>
        {/* First Row */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          h={{ base: "auto", md: "50vh" }}
          w="100%"
        >
          <Flex
            boxShadow="md"
            borderRadius="md"
            bg="white"
            p={6}
            mr={{ base: 0, md: 6 }}
            mb={{ base: 6, md: 0 }}
            textAlign="left"
            w={{ base: "100%", md: "60%" }}
          >
            {vehicleData && (
              <Box mr={6}>
                <Image src="https://picsum.photos/200/300" alt="Car Image" />
              </Box>
            )}
            <Stack spacing={3}>
              {vehicleData && (
                <>
                  <Text fontWeight="bold">
                    Model: {vehicleData.vehicleName}
                  </Text>
                  <Text fontWeight="bold">Type: {vehicleData.vehicleType}</Text>
                </>
              )}
            </Stack>
          </Flex>
          {vehicleData && (
            <Box
              boxShadow="md"
              borderRadius="md"
              bg="white"
              p={6}
              textAlign="left"
              w={{ base: "100%", md: "40%" }}
              h={{ base: "200px", md: "100%" }}
            >
              <MapComponent
                address={
                  {
                    // lat: vehicleData.latitude,
                    // lng: vehicleData.longitude,
                  }
                }
              />
            </Box>
          )}
        </Flex>
        <Flex
          boxShadow="md"
          borderRadius="md"
          bg="white"
          p={6}
          textAlign="left"
          w="80%"
          maxW="800px"
          direction="column"
        >
          {userData && (
            <>
              <Text fontWeight="bold">ID: {userData.uid}</Text>
              <Text fontWeight="bold">Name: {userData.username}</Text>
              <Text fontWeight="bold">Email: {userData.email}</Text>
            </>
          )}
        </Flex>
      </Flex>
    </>
    </AuthWrapper>
  );
}

import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Stack,
  CardBody,
  Container,
  SimpleGrid,
  Card,
} from "@chakra-ui/react";
import AuthWrapper from "@/components/authWrapper";
import { firestore } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Image } from "@chakra-ui/react";

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [location, setLocation] = useState(null);

  const fetchDataLocation = useCallback(async () => {
    const locationQ = query(
      collection(firestore, "locations"),
      // ,      where("uid", "==", id)
    );
    const locationSnapshot = await getDocs(locationQ);
    locationSnapshot.forEach((locationDoc) => {
      setLocation(locationDoc.data());
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const q = query(collection(firestore, "users"), where("uid", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUserData(doc.data());
      });
    };

    const fetchVehicleData = async () => {
      const q = query(collection(firestore, "vehicles"), where("userId", "==", id));
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
  }, [fetchDataLocation, id]);

  const vehicleInfo = [
    {
      vname: "Toyota",
      vtype: "suv",
    },
    {
      vname: "Toyota",
      vtype: "suv",
    },
  ];

  return (
    <AuthWrapper authRoles={["user"]}>
      <>
        {/* <Flex
          direction="column"
          align="center"
          justify="center"
          h="100vh"
          p={6}
        >

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
        </Flex> */}

        {/* <MapComponent
          address={{
            lat: 12,
            lng: 24,
          }}
        /> */}

        <div className="content-container">
          {" "}
          <Flex direction="column" gap={"5"}>
            <div className="user-profile-wrapper">
              <div className="icon-otr">
                <img src="/ms.jpg" className="icon-inr"></img>
              </div>

              <div className="profile-content">
                <div className="profile-title">Muhammad Shahzaib</div>
                <div className="profile-email">shahzaib@gmail.com</div>
              </div>
            </div>

            <Flex
              direction="column"
              gap={"10"}
              className="Vehhicle-informatin-wrapper"
            >
              <div className="v-heading">Vehicle Information:</div>

              <Card
                direction={{ base: "column", lg: "row" }}
                overflow="hidden"
                variant="outline"
                className="v-card-wrapper"
              >
                <div className="card-img-otr">
                  <Image
                    objectFit="contain"
                    maxW={{ base: "100%", lg: "500px" }}
                    src="/car.png"
                    alt="Caffe Latte"
                  />
                </div>

                <Stack width={"100%"}>
                  <CardBody className="v-card-body">
                    <div className="content-wrap-otr">
                      <div className="content-wrap">
                        <div className="v-tite">Body Type: </div>
                        <div className="v-title-name"> Utility Cab </div>
                      </div>

                      <div className="content-wrap">
                        <div className="v-tite">Status </div>
                        <div className="v-title-name"> Registered </div>
                      </div>
                    </div>

                    <div className="content-wrap-otr">
                      <div className="content-wrap">
                        <div className="v-tite">Color: </div>
                        <div className="v-title-name"> white </div>
                      </div>

                      <div className="content-wrap">
                        <div className="v-tite">Year </div>
                        <div className="v-title-name"> 2015 </div>
                      </div>
                    </div>

                    <div className="content-wrap-otr">
                      <div className="content-wrap">
                        <div className="v-tite">GVM: </div>
                        <div className="v-title-name"> 5tons </div>
                      </div>

                      <div className="content-wrap">
                        <div className="v-tite">State </div>
                        <div className="v-title-name"> QLD </div>
                      </div>
                    </div>

                    <div className="content-wrap-otr">
                      <div className="content-wrap">
                        <div className="v-tite">Registraion: </div>
                        <div className="v-title-name"> 942YVZ </div>
                      </div>

                      <div className="content-wrap">
                        <div className="v-tite">EXP: </div>
                        <div className="v-title-name"> 25/12/2022</div>
                      </div>
                    </div>
                  </CardBody>
                </Stack>
              </Card>
            </Flex>

            <SimpleGrid columns={{ base: "1", md: "2", lg: "3" }}>
              <Box bg="white" padding={"20px"} className="custom-column">
                <Flex direction={"row"} gap={"20px"} align={"center"}>
                  <div className="icon-otr">
                    <img src="/ms.jpg" className="icon-inr"></img>
                  </div>

                  <Flex direction={"column"} gap={"10px"}>
                    <Flex direction={"row"} align={"center"} gap={"10"}>
                      <div className="v-title-name"> David Baker</div>
                      <div className=""> </div>
                    </Flex>
                    <Flex direction={"row"} align={"center"} gap={"5px"}>
                      <div className="v-tite"> Group:</div>
                      <div className="v-title-name"> WA</div>
                    </Flex>

                    <Flex direction={"row"} align={"center"} gap={"5px"}>
                      <div className="v-tite"> User:</div>
                      <div className="v-title-name"> David M</div>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
              <Box bg="white" padding={"20px"}>
                <Flex direction={"column"} gap={"10px"}>
                  <div className="content-wrap-otr">
                    <div className="content-wrap">
                      <div className="v-tite">Phone: </div>
                      <div className="v-title-name"> +3447729883 </div>
                    </div>

                    <div className="content-wrap">
                      <div className="v-tite">ODD </div>
                      <div className="v-title-name"> 124km </div>
                    </div>
                  </div>

                  <div className="content-wrap-otr">
                    <div className="content-wrap">
                      <div className="v-tite">Model: </div>
                      <div className="v-title-name"> 3XJGI </div>
                    </div>

                    <div className="content-wrap">
                      <div className="v-tite">Run Time </div>
                      <div className="v-title-name"> 2hr 43 Min</div>
                    </div>
                  </div>

                  <div className="content-wrap-otr">
                    <div className="content-wrap">
                      <div className="v-tite">GVM: </div>
                      <div className="v-title-name"> 5tons </div>
                    </div>

                    <div className="content-wrap">
                      <div className="v-tite">Make </div>
                      <div className="v-title-name"> 38562331</div>
                    </div>
                  </div>

                  <div className="content-wrap-otr">
                    <div className="content-wrap">
                      <div className="v-tite">speed: </div>
                      <div className="v-title-name"> 156km/hr </div>
                    </div>

                    <div className="content-wrap">
                      <div className="v-tite">EXP: </div>
                      <div className="v-title-name"> 25/12/2022</div>
                    </div>
                  </div>
                </Flex>
              </Box>
              <Box bg="white" padding={"20px"}>
                <Flex align={"center"} justifyContent={"space-between"}>
                  <div className="v-title-name">info</div>

                  <div className="add-btn">Add</div>
                </Flex>

                <Flex
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "unset", md: "center" }}
                  justifyContent={"space-between"}
                >
                  <Flex direction={"column"} gap={"2px"}>
                    <div className="v-title-name">NF3456565578</div>

                    <div className="fs-12">Engin Number</div>
                  </Flex>

                  <div className="v-title-name">5/12/2023</div>
                </Flex>
              </Box>
            </SimpleGrid>
          </Flex>
        </div>
      </>
    </AuthWrapper>
  );
}

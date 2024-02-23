import React, { useEffect, useReducer, useState } from "react";
import AuthWrapper from "@/components/authWrapper";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
import { Box, Heading } from "@chakra-ui/layout";
import GoogleMapReact from "google-map-react";
import { useAllUsers } from "@/lib/users";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "@/firebase/firebase";
import DefaultSpinner from "@/components/ui/defaultSpinner";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

function UserLocationMarker({ user }) {
  const { uid, username } = user || {};
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const locationRef = ref(realtimeDB, "locations/" + uid);
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const coordsData = snapshot.val();

      setCoords(coordsData?.coords);
    });

    return () => unsubscribe();
  }, [uid]);

  if (!coords) return null;

  console.log("🚀 ~ file: index.jsx:42 ~ UserLocationMarker ~ coords:", coords)

  return (
    <MarkerF
      position={{
        lat: coords?.latitude,
        lng: coords?.longitude,
      }}
      label={username}
    />
  );
}

const zoom = 14;
const center = {
  lat: 31.470972,
  lng: 74.2602917,
};

const mapOptions = {
  center,
  maxZoom: 17,
  minZoom: 5,
  zoomControl: true,
  disableDefaultUI: true,
};

function AdminDashboard() {
  const { data: users, isLoading: isLoadingUsers } = useAllUsers();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBYLvN67ElYQnpVdrjdx89H2w9SQ7KBFes",
  });

  return (
    <AuthWrapper authRoles={["admin"]}>
      <Head>
        <title>Admin | Vehicle Tracker</title>
      </Head>

      <AdminLayout>
        <Box borderRadius="md" bg="white" p="4" m="4" minH="320" shadow="sm">
          <Heading size="xl">Users Locations</Heading>
          <Box
            w="100%"
            h="500px"
            overflow={"hidden"}
            borderRadius={"md"}
            mt={4}
          >
            {isLoadingUsers ? (
              <DefaultSpinner />
            ) : (
              <GoogleMap
                center={mapOptions.center}
                zoom={zoom}
                options={mapOptions}
                mapContainerStyle={{ height: "100%", width: "100%" }}
                // yesIWantToUseGoogleMapApiInternals
                // onGoogleApiLoaded={({ map }) => setMap(map)}
              >
                {users?.map((user) => (
                  <UserLocationMarker key={user.uid} user={user} />
                ))}
              </GoogleMap>
            )}
          </Box>
        </Box>
      </AdminLayout>
    </AuthWrapper>
  );
}

// function AdminDashboard() {
//   const { data: users, isLoading: isLoadingUsers } = useAllUsers();
//   const [locations, setLocations] = useState({});

//   const setUserLocation = (uid, location) => {
//     setLocations({ ...locations, [uid]: location });
//   };

//   const usersWithLocation =
//     users?.map((user) => ({
//       ...user,
//       location: locations[user.uid],
//     })) || [];

//   return (
//     <AuthWrapper authRoles={["admin"]}>
//       <Head>
//         <title>Admin | Vehicle Tracker</title>
//       </Head>

//       <AdminLayout>
//         <Box borderRadius="md" bg="white" p="4" m="4" minH="320" shadow="sm">
//           <Heading size="xl">Users Locations</Heading>
//           <Box
//             w="100%"
//             h="500px"
//             overflow={"hidden"}
//             borderRadius={"md"}
//             mt={4}
//           >
//             {isLoadingUsers ? (
//               <DefaultSpinner />
//             ) : (
//               <GoogleMapReact
//                 bootstrapURLKeys={{
//                   key: "AIzaSyBYLvN67ElYQnpVdrjdx89H2w9SQ7KBFes",
//                 }}
//                 center={mapOptions.center}
//                 zoom={zoom}
//                 options={mapOptions}
//                 // yesIWantToUseGoogleMapApiInternals
//                 // onGoogleApiLoaded={({ map }) => setMap(map)}
//               >
//                 {usersWithLocation.map((user) => {
//                   console.log(user.location);
//                   return (
//                     <UserLocationMarker
//                       lat={user.location?.latitude}
//                       lng={user.location?.longitude}
//                       key={user.uid}
//                       user={user}
//                       setUserLocation={setUserLocation}
//                     />
//                   );
//                 })}
//               </GoogleMapReact>
//             )}
//           </Box>
//         </Box>
//       </AdminLayout>
//     </AuthWrapper>
//   );
// }

export default AdminDashboard;

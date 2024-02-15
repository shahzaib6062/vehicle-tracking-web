import Header from "@/component/header";
import Users from "@/component/usersListing";
import React from "react";
import AuthWrapper from "@/component/authWrapper";

const index = () => {
  return (
    <AuthWrapper authRoles={["admin"]}>
      <Header />
      <Users />
    </AuthWrapper>
  );
};

export default index;

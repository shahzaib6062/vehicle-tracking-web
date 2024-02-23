import React from "react";
import AuthWrapper from "@/components/authWrapper";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
import { Heading } from "@chakra-ui/layout";

function AdminDashboard() {
  return (
    <AuthWrapper authRoles={["admin"]}>
      <Head>
        <title>Admin | Vehicle Tracker</title>
      </Head>

      <AdminLayout>
        <Heading>Admin Home</Heading>
      </AdminLayout>
    </AuthWrapper>
  );
}

export default AdminDashboard;

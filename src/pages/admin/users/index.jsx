import React from "react";
import AuthWrapper from "@/components/authWrapper";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
import UsersTable from "@/components/usersTable";

function AdminUsers() {
  return (
    <AuthWrapper authRoles={["admin"]}>
      <Head>
        <title>Users | RoadRanger</title>
      </Head>

      <AdminLayout>
        <UsersTable />
      </AdminLayout>
    </AuthWrapper>
  );
}

export default AdminUsers;

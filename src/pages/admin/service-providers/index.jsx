import React from "react";
import AuthWrapper from "@/components/authWrapper";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
import ServiceProvidersTable from "@/components/serviceProvidersTable";

function AdminServiceProviders() {
  return (
    <AuthWrapper authRoles={["admin"]}>
      <Head>
        <title>Service Providers | RoadRanger</title>
      </Head>

      <AdminLayout>
        <ServiceProvidersTable />
      </AdminLayout>
    </AuthWrapper>
  );
}

export default AdminServiceProviders;

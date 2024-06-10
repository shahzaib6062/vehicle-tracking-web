import React from "react";
import AuthWrapper from "@/components/authWrapper";
import AdminLayout from "@/layouts/AdminLayout";
import Head from "next/head";
import QueriesProviderTable from "@/components/queriesProviderTable";

function AdminQueries() {
  return (
    <AuthWrapper authRoles={["admin"]}>
      <Head>
        <title>Service Providers | RoadRanger</title>
      </Head>

      <AdminLayout>
        <QueriesProviderTable />
      </AdminLayout>
    </AuthWrapper>
  );
}

export default AdminQueries;

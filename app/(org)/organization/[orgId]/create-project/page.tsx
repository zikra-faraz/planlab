import React from "react";
import CreateProjectForm from "./CreateProjectForm";

const page = async ({ params }: { params: Promise<{ orgId: string }> }) => {
  const { orgId } = await params;
  return (
    <>
      <CreateProjectForm orgId={orgId} />
    </>
  );
};

export default page;

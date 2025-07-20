import { getProject } from "@/actions/project";
import { ProjectProvider } from "@/context/projectProvider";
import React from "react";

const ProjectLayout = async ({
  params,
  children,
}: {
  params: Promise<{ projectId: string }>;
  children: React.ReactNode;
}) => {
  const { projectId } = await params;
  const Project = await getProject(projectId);
  return (
    <>
      <ProjectProvider project={Project}>{children}</ProjectProvider>
    </>
  );
};

export default ProjectLayout;

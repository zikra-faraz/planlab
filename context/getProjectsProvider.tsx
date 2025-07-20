"use client";
import type { Project } from "@prisma/client";
import { createContext, useContext } from "react";

const ProjectContext = createContext<Project[]>([]);

export const useProjects = () => useContext(ProjectContext);

export const GetProjectsProvider = ({
  projects,
  children,
}: {
  projects: Project[];
  children: React.ReactNode;
}) => {
  return (
    <ProjectContext.Provider value={projects}>
      {children}
    </ProjectContext.Provider>
  );
};

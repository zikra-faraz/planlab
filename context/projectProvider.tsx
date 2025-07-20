"use client";
import type { Project, Sprint } from "@prisma/client";
import { createContext, useContext } from "react";

const ProContext = createContext<Project | null>(null);

export const useProject = () => useContext(ProContext);

export const ProjectProvider = ({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) => {
  return <ProContext.Provider value={project}>{children}</ProContext.Provider>;
};

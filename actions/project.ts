// app/actions/project/createProject.ts
"use server";

import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/currentUser";

export async function createProject({
  name,
  key,
  description,
  orgSlug,
}: {
  name: string;
  key: string;
  description?: string;
  orgSlug: string;
}) {
  try {
    const user = await getCurrentUser();

    if (!user) throw new Error("Unauthorized");

    // Get org by slug
    const organization = await db.organization.findUnique({
      where: { slug: orgSlug },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Create project
    const project = await db.project.create({
      data: {
        name,
        key,
        description,
        organizationId: organization.id,
      },
    });

    return project;
  } catch (err) {
    console.error("Error creating project:", err);
    throw new Error("Failed to create project");
  }
}

export async function getProject(projectId: string) {
  // console.log(projectId);

  // Get project with sprints and organization
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  // console.log(project);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function getProjectsByOrgId(orgId: string | undefined) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const projects = await db.project.findMany({
      where: {
        organizationId: orgId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw new Error("Failed to fetch projects");
  }
}

export async function deleteProject(projectId: string) {
  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}

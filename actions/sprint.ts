"use server";

import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/currentUser";
import { SprintStatus } from "@prisma/client";

export async function createSprint({
  name,
  startDate,
  endDate,
  projectId,
  status = SprintStatus.PLANNED,
}: {
  name: string;
  startDate: Date;
  endDate: Date;
  projectId: string;
  status?: SprintStatus;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    // Check if project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Project not found");
    }
    const existingSprint = await db.sprint.findFirst({
      where: {
        name: name,
        projectId: projectId,
      },
    });
    if (existingSprint) {
      throw new Error("Sprint name already exists for this project");
    }
    // Create the sprint
    const sprint = await db.sprint.create({
      data: {
        name,
        startDate,
        endDate,
        status: "PLANNED",
        projectId: project.id,
      },
    });

    return sprint;
  } catch (err) {
    console.error("Error creating sprint:", err);
    throw new Error("Failed to create sprint");
  }
}

export async function checkSprintStatus(projectId: string) {
  const existing = await db.sprint.findFirst({
    where: {
      projectId,
      status: { in: ["PLANNED", "ACTIVE"] },
    },
  });

  return !!existing; // true if any sprint is PLANNED or ACTIVE
}

export async function updateSprintStatus(
  sprintId: string,
  newStatus: SprintStatus
) {
  try {
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    if (!sprint) throw new Error("Sprint not found");

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }
    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }
    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Unknown error occurred");
  }
}

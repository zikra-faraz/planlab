"use server";

import { db } from "@/lib/prisma";

import { getCurrentUser } from "./currentUser";
import { createUserSession } from "@/auth/roleSession";
import { cookies } from "next/headers";

async function generateUniqueSlug(base: string): Promise<string> {
  let slug = base.toLowerCase().replace(/\s+/g, "-");
  let counter = 1;

  while (await db.organization.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}
export async function createOrganization(name: string) {
  try {
    const user = await getCurrentUser({ withFullUser: true });

    if (!user) throw new Error("Unauthorized");
    const baseSlug = name.toLowerCase().replace(/\s+/g, "-");

    const slug = await generateUniqueSlug(baseSlug);
    const org = await db.organization.create({
      data: {
        name,
        slug,
      },
    });

    const userOrg = await db.userOrganization.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        email: user.email!,
        role: "ADMIN",
        joinedAt: new Date(),
      },
    });
    await createUserSession(
      {
        id: user.id,
        role: userOrg.role,
        orgId: org.id,
      },
      await cookies()
    );
    return org;
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw new Error("Failed to create organization");
  }
}

export async function getOrganizationBySlug(slug: string) {
  if (!slug) return null;

  try {
    const org = await db.organization.findUnique({
      where: { slug },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projects: true,
      },
    });

    return org;
  } catch (error) {
    console.error("Failed to fetch org by slug:", error);
    return null;
  }
}

// app/actions/organization/getUserOrganizations.ts

export const getUserOrganizations = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const organizations = await db.userOrganization.findMany({
    where: {
      userId: user.id,
    },
    include: {
      organization: true, // to fetch the full organization details
    },
  });

  // You can return only the organization info if you want
  return organizations.map((org) => org.organization);
};

export const getCurrentUserOrg = async (orgId: string | undefined) => {
  const user = await getCurrentUser({ withFullUser: true });

  if (!user) return null;

  const userOrg = await db.userOrganization.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: orgId,
      },
    },
    include: {
      organization: true,
    },
  });

  if (!userOrg) return null;

  return {
    user,
    org: userOrg.organization,
    role: userOrg.role,
  };
};

export const updateOrganization = async ({
  orgId,
  name,
}: {
  orgId: string;
  name: string;
}) => {
  console.log(orgId, name);

  if (!orgId || !name) {
    throw new Error("Organization ID and name are required");
  }

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const updatedOrg = await db.organization.update({
    where: { id: orgId },
    data: {
      name,
    },
  });

  return updatedOrg;
};

export const deleteOrganization = async (orgId: string) => {
  if (!orgId) throw new Error("Organization ID is required");

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await db.$transaction([
    db.userOrganization.deleteMany({ where: { organizationId: orgId } }),
    db.project.deleteMany({ where: { organizationId: orgId } }),
    db.organization.delete({ where: { id: orgId } }),
  ]);

  return { success: true };
};

export const getUsersByOrgId = async (orgId: string) => {
  if (!orgId) throw new Error("Organization ID is required");

  const users = await db.userOrganization.findMany({
    where: { organizationId: orgId },
    include: {
      user: true,
    },
  });

  return users.map((u) => u.user); // return just the user objects
};

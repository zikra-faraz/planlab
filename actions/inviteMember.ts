"use server";
import { db } from "@/lib/prisma";
import { transporter } from "@/app/(org)/components/Invite/nodemailer";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "./currentUser";

export async function inviteMemberAction(
  email: string,
  orgId: string | null,
  inviterName: string | null
) {
  console.log(email);
  console.log(orgId);

  if (!email || !orgId) return { success: false, message: "Missing info" };

  const token = uuidv4();

  // Optional: Check if user exists
  // const existingUser = await db.user.findUnique({ where: { email } });

  // if (existingUser) {
  await db.userOrganization.create({
    data: {
      organizationId: orgId,
      role: "MEMBER",
      invitedAt: new Date(),
      inviteToken: token,
      email,
    },
  });

  const inviteUrl = `http://localhost:3000/invite/${token}`; // Change in production

  await transporter.sendMail({
    from: `Plan Lab <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: `${inviterName} invited you to join Plan Lab!`,
    html: `<p><strong>${inviterName}</strong> has invited you to join their organization on Plan Lab. <a href="${inviteUrl}">Click here to accept the invite</a>.</p>`,
  });

  return { success: true, message: "Invite sent!" };
}

export async function acceptInviteAction(token: string) {
  const userData = await getCurrentUser();
  if (!userData) throw new Error("Not authenticated");

  const invite = await db.userOrganization.findFirst({
    where: { inviteToken: token },
  });

  if (!invite) return null;

  await db.userOrganization.update({
    where: { inviteToken: token },
    data: {
      userId: userData.id,
      joinedAt: new Date(),
      inviteToken: null,
    },
  });

  const organization = await db.organization.findUnique({
    where: { id: invite.organizationId },
  });

  return organization;
}

import { db } from "@/lib/prisma";
import InviteAcceptButton from "./InviteAcceptButtton";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/currentUser";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }
  //   if (!user) {
  //     redirect("/sign-in");
  //   }
  // console.log("Received token:", token);
  //   const { userId } = await auth();
  //   if (!userId) {
  //     // 👇 Redirect to sign in and come back to this page after login
  //     redirect(`/sign-in?redirect_url=/invite/${token}`);
  //   }

  //   if (!token) {
  //     return <div>Invalid invitation.</div>;
  //   }

  //   const invite = await db.userOrganization.findFirst({
  //     where: { inviteToken: token },
  //   });

  //   if (!invite) {
  //     return <div>Invalid or expired invitation.</div>;
  //   }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">You've been invited!</h1>
      <InviteAcceptButton token={token} />
    </div>
  );
}

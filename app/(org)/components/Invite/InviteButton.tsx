"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InviteMemberModal from "./InviteModal";

export default function InviteButton({
  orgId,
  inviterName,
  isAdmin,
}: {
  orgId: string;
  inviterName: string;
  isAdmin: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // console.log(response?.organization?.id);

  return (
    <>
      <div className="flex justify-end items-center gap-2 mb-4 mt-1">
        {isAdmin && (
          <Button onClick={() => setIsDialogOpen(true)}>Invite Member</Button>
        )}
      </div>

      <InviteMemberModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        organizationId={orgId}
        inviterName={inviterName}
      />
    </>
  );
}

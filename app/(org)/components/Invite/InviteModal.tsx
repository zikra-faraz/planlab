"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InviteMemberForm } from "./InviteMember";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  inviterName: string;
};

const InviteMemberModal = ({
  isOpen,
  onClose,
  organizationId,
  inviterName,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a Team Member</DialogTitle>
        </DialogHeader>
        <InviteMemberForm
          organizationId={organizationId}
          inviterName={inviterName}
          // just closes modal
        />
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;

"use client";

import { useRouter } from "next/navigation";
import { acceptInviteAction } from "@/actions/inviteMember";
import { useState } from "react";

export default function InviteAcceptButton({ token }: { token: string }) {
  const router = useRouter();
  const [load, setLoad] = useState(false);
  const handleAcceptInvite = async () => {
    setLoad(true);
    const org = await acceptInviteAction(token); // call server action
    if (org) {
      router.push(`/organization/${org?.slug}`);
      setLoad(false);
    } else {
      alert("Error accepting invitation.");
    }
  };

  return (
    <button
      onClick={handleAcceptInvite}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {load ? "Joining.." : "Go to project"}
    </button>
  );
}

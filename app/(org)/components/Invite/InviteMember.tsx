"use client";

import { useState, useTransition } from "react";
import { inviteMemberAction } from "@/actions/inviteMember";

export function InviteMemberForm({
  organizationId,
  inviterName,
}: {
  organizationId: string | null;
  inviterName: string | null;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  console.log("form ", organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    startTransition(() => {
      inviteMemberAction(email, organizationId, inviterName).then((res) => {
        if (res?.success) {
          setMessage("✅ Invite sent successfully!");
          setEmail("");
        } else {
          setMessage(res?.message || "❌ Failed to send invite.");
        }
      });
    });
  };
  // console.log(organizationId);
  // console.log(inviterName);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-md rounded-xl p-6 space-y-4"
    >
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-purple-600">
          Enter member's email
        </h2>
      </div>

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        type="submit"
        disabled={isPending}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
      >
        {isPending ? "Sending..." : "Send Invite"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";

export function LogOutButton() {
  return (
    <Button variant="destructive" onClick={async () => await logout()}>
      Log Out
    </Button>
  );
}

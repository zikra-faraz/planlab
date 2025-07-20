"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import UpdateOrg from "./updateOrg";
import { ChevronDown } from "lucide-react";

const UpdateOrgModel = ({ organization, isAdmin }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mt-1">
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="outline"
          className="z-10"
        >
          Update organization
          <ChevronDown />
        </Button>

        <UpdateOrg
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          organization={organization}
          isAdmin={isAdmin}
        ></UpdateOrg>
      </div>
    </>
  );
};

export default UpdateOrgModel;

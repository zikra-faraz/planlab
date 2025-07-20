"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { updateOrganization, deleteOrganization } from "@/actions/organization";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { Organization } from "@prisma/client";
type UpdateOrgProps = {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization;
  isAdmin: boolean;
};
const UpdateOrg = ({
  isOpen,
  onClose,
  organization,
  isAdmin,
}: UpdateOrgProps) => {
  const [name, setName] = useState(organization.name);

  const {
    data: updateOrg,
    loading: loadingUpdate,
    error: updateError,
    fn: updateOrgFn,
  } = useFetch(updateOrganization, null);
  const {
    data: deletOrg,
    loading: loadingDel,
    error: DeleteError,
    fn: deleteOrgFn,
  } = useFetch(deleteOrganization, null);
  const router = useRouter();
  const orgId = organization?.id;
  //   console.log(orgId);

  const handleUpdate = async () => {
    const res = await updateOrgFn({ orgId, name });
    if (res) {
      toast.success("Organization updated!");
      router.push(`/organization/${res.slug}/admin/settings`);
      router.refresh();
      onClose();
    } else if (updateError) {
      toast.error(updateError);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this organization?"
    );
    if (!confirmed) return;

    const res = await deleteOrgFn(orgId);
    if (res) {
      toast.success("Organization deleted!");
      onClose();
    } else if (DeleteError) {
      toast.error(DeleteError);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="name">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization Name"
            />

            <Button
              onClick={handleUpdate}
              disabled={loadingUpdate}
              className="mr-2"
            >
              {loadingUpdate ? "Updating..." : "Update"}
            </Button>
            {isAdmin && (
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={loadingDel}
              >
                {loadingDel ? "Deleting..." : "Delete Org"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default UpdateOrg;
//leave org
// ddelete org
// update org
//members user joined role aactions  invite search

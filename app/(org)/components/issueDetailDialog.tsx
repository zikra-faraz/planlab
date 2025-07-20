"use client";

import { deleteIssue, updateIssue } from "@/actions/issue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import statuses from "@/data/status.json";
import { useState, useEffect } from "react";

import useFetch from "@/hooks/useFetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./userAvatar";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import type { Issue } from "@prisma/client";
import { SprintStatus, IssueStatus, IssuePriority } from "@prisma/client";
import { useOrgUser } from "@/context/OrgUserProvider";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
type issueDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
  onDelete?: () => void; // optional with default to empty fn
  onUpdate?: (issue: Issue) => void; // optional with default to empty fn
  borderCol?: string;
};
const IssueDetailDialog = ({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = (_: Issue) => {},
  borderCol = "",
}: issueDetailDialogProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);
  const userOrgData = useOrgUser();
  const isAdmin = userOrgData?.role == "ADMIN";
  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue, { success: false });

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue, null);
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(issue.id);
    }
  };
  const handleStatusChange = async (newStatus: IssueStatus) => {
    setStatus(newStatus);
    updateIssueFn(issue.id, { status: newStatus, priority });
  };

  const handlePriorityChange = async (newPriority: IssuePriority) => {
    setPriority(newPriority);
    updateIssueFn(issue.id, { status, priority: newPriority });
  };
  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete();
    }
    if (updated) {
      onUpdate(updated);
    }
  }, [deleted, updated, deleteLoading, updateLoading]);

  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };
  const isProjectPage = !pathname.startsWith("/project/");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{issue.title}</DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        {(updateLoading || deleteLoading) && (
          <BarLoader width={"100%"} color="#9333ea" />
        )}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 ">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={priority}
              onValueChange={handlePriorityChange}
              disabled={!isAdmin}
            >
              <SelectTrigger className={`border ${borderCol} rounded`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown
              className="rounded px-2 py-1"
              source={issue.description ? issue.description : "--"}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Assignee</h4>
              <UserAvatar user={issue?.assignee} />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={issue.reporter} />
            </div>
          </div>
          {isAdmin && (
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              variant="destructive"
            >
              {deleteLoading ? "Deleting..." : "Delete Issue"}
            </Button>
          )}
          {(deleteError || updateError) && (
            <p className="text-red-500">{deleteError || updateError}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailDialog;

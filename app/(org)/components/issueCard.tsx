"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import UserAvatar from "./userAvatar";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import IssueDetailDialog from "./issueDetailDialog";
import type { Issue } from "@prisma/client";
const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};
type IssueCardProps = {
  issue: Issue;
  showStatus?: boolean;
  onDelete?: () => void;
  onUpdate?: (updated: Issue) => void;
};
const IssueCard = ({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = (_: Issue) => {},
}: IssueCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const onDeleteHandler = (...params: []) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params: [Issue]) => {
    router.refresh();
    onUpdate(...params);
  };
  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <div className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`}>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow "
          onClick={() => setIsDialogOpen(true)}
        >
          <CardHeader className="">
            <CardTitle>{issue.title}</CardTitle>
          </CardHeader>

          <CardContent className="flex gap-2 -mt-3">
            {showStatus && <Badge>{issue.status}</Badge>}
            <Badge variant="outline" className="-ml-1">
              {issue.priority}
            </Badge>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-3">
            <UserAvatar user={issue.assignee} />

            <div className="text-xs text-gray-400 w-full">
              Created {created}
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* {console.log(isDialogOpen)} */}
      {
        <IssueDetailDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      }
    </>
  );
};

export default IssueCard;

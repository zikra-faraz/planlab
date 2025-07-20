"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow, isAfter, isBefore, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/useFetch";
import { updateSprintStatus } from "@/actions/sprint";
import { useSearchParams, useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import { type Sprint } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
type SprintManagerProps = {
  sprint: Sprint;
  setSprint: Dispatch<SetStateAction<Sprint>>;
  sprints: Sprint[];
  projectId: string;
};
const SprintManager = ({
  sprint,
  setSprint,
  sprints,
  projectId,
}: SprintManagerProps) => {
  const [status, setStatus] = useState(sprint.status);
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();
  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";
  type UpdateSprintStatusResult = {
    success: boolean;
    sprint?: Sprint; // sprint is optional because it won't exist on error
  };

  const {
    fn: updateStatus,
    loading,
    error,
    data: updatedStatus,
  } = useFetch<UpdateSprintStatusResult>(updateSprintStatus, {
    success: false,
  });

  const handleStatusChange = async (newStatus: string) => {
    updateStatus(sprint.id, newStatus);
  };
  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    if (!selectedSprint) return;
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
  };
  useEffect(() => {
    if (updatedStatus && updatedStatus.success && updatedStatus.sprint) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);
  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className=" self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")} to{" "}
                {format(sprint.endDate, "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            className="bg-green-600 text-white z-10"
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            className="bg-red-800 text-white z-10"
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}
      {getStatusText() && (
        <Badge className="mt-3 ml-1 self-start">{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;

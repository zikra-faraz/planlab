"use client";

import { deleteProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function DeleteProject({ projectId }: { projectId: string }) {
  const router = useRouter();
  const {
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
    data: deleted,
  } = useFetch(deleteProject, { success: false });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFn(projectId);
    }
    if (deleted) {
      toast.success("Project Deleted");
      router.refresh();
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-5 w-5 " />
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
}

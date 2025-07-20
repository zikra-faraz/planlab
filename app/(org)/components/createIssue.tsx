"use client";
import { createIssue } from "@/actions/issue";

import { issueSchema } from "../lib/validators";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Issue, IssuePriority } from "@prisma/client";
import type { User } from "@prisma/client";
type CreateIssueDrawerProps = {
  isOpen: boolean; // true or false for drawer open state
  onClose: () => void; // function to close drawer
  sprintId?: string; // optional sprint id
  status: string; // status string (TODO, IN_PROGRESS, etc.)
  projectId: string; // project id string
  onIssueCreated: () => void; // callback when issue is created
  orgId: string;
  users: User[]; // organization id string
};

type FormDataCreateIssue = {
  title: string;
  description?: string;

  priority: IssuePriority;

  assigneeId?: string;
};
const CreateIssueDrawer: React.FC<CreateIssueDrawerProps> = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  users,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(issueSchema) });
  const { theme } = useTheme();

  const {
    data: CreateIssueData,
    loading: loadingCreate,
    error: CreateError,
    fn: createIssueFn,
  } = useFetch(createIssue, null);
  const onSubmit = async (data: FormDataCreateIssue) => {
    try {
      const res = await createIssueFn(projectId, {
        ...data,
        projectId,
        status,
        sprintId,
      });
      if (res) {
        toast.success("Issue created successfully");
      }
      reset();
      onClose();
      onIssueCreated();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error || "Failed to create issue";
      toast.error(errorMessage);
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium mb-1"
            >
              Assignee
            </label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigneeId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assigneeId.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <>
                  <div data-color-mode={theme}>
                    <MDEditor value={field.value} onChange={field.onChange} />
                  </div>
                </>
              )}
            />
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-red-500 mt-2">{errors.priority.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loadingCreate}
            className="w-full bg-purple-600 text-white"
          >
            {loadingCreate ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateIssueDrawer;

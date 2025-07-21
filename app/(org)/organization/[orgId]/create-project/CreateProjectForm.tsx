"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject } from "@/actions/project";
import { projectSchema, ProjectSchemaType } from "@/app/(org)/lib/validators";
import useFetch from "@/hooks/useFetch";
import { useOrgUser } from "@/context/OrgUserProvider";
const CreateProjectForm = ({ orgId }: { orgId: string }) => {
  const orgUser = useOrgUser();
  console.log(orgUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });
  const {
    data: org,
    loading,
    error,
    fn: create,
  } = useFetch(createProject, null);
  const router = useRouter();
  const onSubmit = async (data: ProjectSchemaType) => {
    const res = await create({ ...data, orgSlug: orgId });
    if (res) {
      toast.success("Project created!");
      router.push(`/organization/${orgId}/project/${res?.id}`);
    } else if (error) {
      toast.error(error);
    }
  };
  return (
    <>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6 text-center">Create Project</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("name")}
            placeholder="Project Name"
            className="dark:bg-slate-900"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <Input
            {...register("key")}
            placeholder="Project Key (e.g., CHAT)"
            className="dark:bg-slate-900"
          />
          {errors.key && (
            <p className="text-red-500 text-sm">{errors.key.message}</p>
          )}

          <Textarea
            {...register("description")}
            placeholder="Project Description"
            className="dark:bg-slate-900 h-28"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <Button type="submit" className="bg-purple-600 text-white">
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreateProjectForm;

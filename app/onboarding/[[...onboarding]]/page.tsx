// app/onboarding/_components/onboarding-form.tsx
"use client";
import { createOrganization } from "@/actions/organization";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

const formSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
});

export default function OnboardingForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  const {
    data: org,
    loading,
    error,
    fn: createOrg,
  } = useFetch(createOrganization, null);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await createOrg(values.name);
    if (res) {
      toast.success("Organization created!");
      router.push(`/organization/${res?.slug}`);
    } else if (error) {
      toast.error(error);
    }
  };
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Create an Organization
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Organization Name"
          className="dark:bg-slate-900"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white"
        >
          {loading ? "Creating..." : "Create Organization"}
        </Button>
      </form>
    </div>
  );
}

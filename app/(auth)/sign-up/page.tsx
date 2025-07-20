import { GalleryVerticalEnd } from "lucide-react";

import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-[calc(100vh-70px)] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <RegisterForm />
      </div>
    </div>
  );
}

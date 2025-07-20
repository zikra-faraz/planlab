"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/auth/schemas";
import z from "zod";
import { useState } from "react";
import { signUp } from "@/actions/auth";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    console.log(session?.user);
  }
  const [error, setError] = useState<string>();
  const form = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const {
    data: message,
    error: signupError,
    loading,
    fn: signUpFn,
  } = useFetch(signUp, "");
  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    const res = await signUpFn(data);
    setError(error);
    if (res) {
      toast.success("Account created!");
      router.push("/");
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            SingUp with your email or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {error && <p className="text-destructive">{error}</p>}
              <div className="flex gap-4">
                <Button
                  type="button"
                  className="w-full flex items-center gap-2"
                  onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                  }
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </Button>
                {session && <button onClick={() => signOut()}>Sign out</button>}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 justify-end">
                <Button asChild variant="link">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button type="submit">Sign Up</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

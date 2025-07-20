"use server";
import z from "zod";
import { signInSchema, signUpSchema } from "@/auth/schemas";
import { db } from "@/lib/prisma";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "@/auth/passwordHasher";
import { createUserSession, removeUserFromSession } from "@/auth/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { OAuthProvider } from "@prisma/client";
// import { createGoogleAuthUrl } from "./oauth";

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Unable to create account";
  const existingUser = await db.user.findFirst({
    where: { email: data.email },
  });

  if (existingUser) {
    return "An account already exists for this email.";
  }
  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);
    // console.log(hashedPassword);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
      },
      select: {
        id: true,
      },
    });

    if (user == null) return "Unable to create account";
    await createUserSession(user, await cookies());
  } catch (error) {
    if (error instanceof Error) {
      console.error(" Sign-up error:", error.message);
    } else {
      console.error("Unknown error during sign-up:", error);
    }
    return "Unable to create account";
  }

  redirect("/");
}

export async function signInCustom(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);
  if (!success) return "Unable to log you in";
  const user = await db.user.findUnique({
    where: { email: data.email },
  });
  if (!user) return "User not found";
  // ✅ If user has no password but is connected to Google

  if (user == null || user.password == null || user.salt == null) {
    return "Unable to log you in";
  }
  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: data.password,
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Unable to log you in";
  await createUserSession(user, await cookies());
  redirect("/");
}

export async function logoutCustom() {
  await removeUserFromSession(await cookies());
  redirect("/");
}

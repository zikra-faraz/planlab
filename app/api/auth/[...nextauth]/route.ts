// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { NextAuthOptions } from "next-auth";
import { createUserSession } from "@/auth/session";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in", // 👈 your custom sign-in page
  },

  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      // Block if the user registered using password
      if (existingUser?.password) {
        console.log("❌ Blocked: account exists with password.");
        return false;
      }

      let dbUser = existingUser;
      if (!dbUser) {
        dbUser = await db.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
      }
      await db.userOrganization.updateMany({
        where: { email: dbUser.email, userId: null },
        data: { userId: dbUser.id },
      });
      // ✅ Use custom session
      await createUserSession({ id: dbUser.id }, await cookies());

      return true;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

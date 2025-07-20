import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import SessionWrapper from "@/components/SessionWrapper";
import { getCurrentUser } from "@/actions/currentUser";
import { UserProvider } from "@/context/UserProvider";
import { Inter } from "next/font/google";
import { getUserOrganizations } from "@/actions/organization";
import { OrgProvider } from "@/context/orgProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plan Lab",
  description: "Project management web app",
  icons: "/plan.png",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser({ withFullUser: true });
  // console.log("function user", user);

  const orgs = user ? await getUserOrganizations() : [];
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionWrapper>
        <body
          className={`${inter.className} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {/* <header></header> */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 blur-3xl z-0 pointer-events-none rounded-full  " />

              <div className="absolute top-0 right-[5vw] w-[400px] h-[400px] bg-purple-600/10 blur-3xl rounded-full z-0 pointer-events-none" />
              <UserProvider user={user}>
                <OrgProvider orgs={orgs}>
                  <main className="min-h-screen ">{children}</main>
                </OrgProvider>
              </UserProvider>

              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </SessionWrapper>
    </html>
  );
}

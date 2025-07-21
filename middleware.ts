import { NextResponse, type NextRequest } from "next/server";
import { getUserFromSession } from "./auth/session";
import { getToken } from "next-auth/jwt";
import { getUserFromSessionRole } from "./auth/roleSession";

export async function middleware(request: NextRequest) {
  const authResult = await middlewareAuth(request);
  if (authResult) return authResult;

  return NextResponse.next();
}

async function middlewareAuth(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedPrefixes = [
    "/onboarding",
    "/organisation",
    "/project",
    "/issue",
    "/sprint",
  ];
  const isProtectedRoute = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const isAdminRoute =
    pathname.includes("/admin") || pathname.includes("/settings");

  const userFromRedis = await getUserFromSession(request.cookies);
  // console.log(userFromRedis);
  const role = await getUserFromSessionRole(request.cookies);
  // console.log(role);

  // console.log(role);

  // const nextAuthToken = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  if (isProtectedRoute && !userFromRedis) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // if (isAdminRoute) {
  //   if (!role || role?.role !== "ADMIN") {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }
  // if (user.role !== "admin") {
  //   return NextResponse.redirect(new URL("/", request.url))
  // }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

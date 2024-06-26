import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/preview/(.*)", "/api/(.*)"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/",
    // "/home",
    "/files",
    "/shared",
    "/favorites",
    "/file-preview/(.*)",
  ],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)", "/"],
};

NextResponse.next();

import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/preview/(.*)", "/api/(.*)", "/api/payment/verify-subscription"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/",
    // "/dashboard",
    "/files",
    "/shared",
    "/favorites",
    "/file-preview/(.*)",
    "/api/payment/verify-subscription",
  ],
 
  afterAuth(auth, req) {
    // Add user ID to headers for SSR pages
    if (auth.userId) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', auth.userId);
             
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    
    // Return NextResponse.next() for unauthenticated requests too
    return NextResponse.next();
  },
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware 
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)", "/"],
};
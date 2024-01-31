import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "./routes";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  //The are routes that starts with /api/auth
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  //These are all the public routes
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  //These are all the authentication routes
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  //Do noting if is API auth route
  if (isApiAuthRoute) {
    return null;
  }

  //This is to prevent users from going back to the auth page after signing in.
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  //This is to protect all the private routes.
  //ensure that when a user logout from a page and logs back in, the user goes back to that page.
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

import NextAuth from "next-auth";
import prismadb from "./lib/prisma";
import authConfig from "./auth.config";
import { UserRole } from "@prisma/client";
import { getUserById } from "./data/user";
import { getAccountByUserId } from "./data/account";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  events: {
    //This is used for OAuth providers. So OAuth user does not need email verification.
    async linkAccount({ user }) {
      await prismadb.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth (Google or Github) without email verification.
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // Prevent user from signing in without email verification.
      if (!existingUser?.emailVerified) return false;

      //If two-factor authentication is true
      if (existingUser?.isTwoFactorEnabled) {
        //Check if there is a confirmation
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        //If no confirmation don't sign in.
        if (!twoFactorConfirmation) return false;

        // if there is a confirmation sign in and Delete two factor confirmation for next sign in.
        await prismadb.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },

    async session({ token, session }) {
      if (token?.sub && session.user?.id) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.id = token.sub as string;

        session.user.name = token.name;

        session.user.email = token.email;

        session.user.image = token.picture;

        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    async jwt({ token }) {
      //token.sub is the same as user id in the database.
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;

      token.name = existingUser.name;

      token.email = existingUser.email;

      token.role = existingUser.role;

      token.picture = existingUser.image;

      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
});

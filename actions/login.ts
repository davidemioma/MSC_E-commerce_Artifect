"use server";

import { signIn } from "@/auth";
import { redis } from "@/lib/redis";
import prismadb from "@/lib/prisma";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { getUserByEmail } from "@/data/user";
import { Ratelimit } from "@upstash/ratelimit";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { LoginValidator, LoginSchema } from "@/lib/validators/login";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwofactorToken, generateVerificationToken } from "@/lib/token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"),
});

export const login = async (
  values: LoginValidator,
  callbackUrl?: string | null
) => {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success && process.env.VERCEL_ENV === "production") {
    return { error: "Too Many Requests! try again in 5 min" };
  }

  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  //Check if that user exists
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      //Check it two factor token exists
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      //Check if token === code
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      //Check if token has expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      //Delete Token
      await prismadb.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      //Check if there is an existing confirmation and delete it
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      //If there is an existing confirmation? delete it.
      if (existingConfirmation) {
        await prismadb.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      //Create a new two-factor Confirmation
      await prismadb.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwofactorToken(existingUser.email);

      await sendTwoFactorTokenEmail({
        email: twoFactorToken.email,
        token: twoFactorToken.token,
      });

      return { twoFactor: true };
    }
  }

  try {
    // if (process.env.VERCEL_ENV === "production") {
    // }

    await signIn("credentials", {
      email,
      password,
      redirectTo:
        (!callbackUrl?.includes("sign-in" || "sign-up") && callbackUrl) ||
        DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

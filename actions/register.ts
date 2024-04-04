"use server";

import bcrypt from "bcryptjs";
import { redis } from "@/lib/redis";
import prismadb from "@/lib/prisma";
import { headers } from "next/headers";
import { getUserByEmail } from "@/data/user";
import { Ratelimit } from "@upstash/ratelimit";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { RegisterValidator, RegisterSchema } from "@/lib/validators/register";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
});

export const register = async (values: RegisterValidator) => {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success && process.env.VERCEL_ENV === "production") {
    return { error: "Too Many Requests! try again in 10 min" };
  }

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;

  const userExists = await getUserByEmail(email);

  if (userExists) {
    return { error: "Email already in use!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prismadb.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail({
    email: verificationToken.email,
    token: verificationToken.token,
  });

  return { success: "Confirmation email sent!" };
};

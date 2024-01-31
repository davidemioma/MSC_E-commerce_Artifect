"use server";

import bcrypt from "bcryptjs";
import prismadb from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { RegisterValidator, RegisterSchema } from "@/lib/validators/register";

export const register = async (values: RegisterValidator) => {
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

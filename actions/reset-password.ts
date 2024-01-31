"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/token";
import { ResetValidator, ResetSchema } from "@/lib/validators/reset-password";

export const resetPassword = async (values: ResetValidator) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;

  //Check if user exists
  const userExists = await getUserByEmail(email);

  if (!userExists) {
    return { error: "Email not found!" };
  }

  //Generate token
  const passwordResetToken = await generateResetPasswordToken(email);

  //Send email
  await sendPasswordResetEmail({
    email: passwordResetToken.email,
    token: passwordResetToken.token,
  });

  return { success: "Reset email sent!" };
};

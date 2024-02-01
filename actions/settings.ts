"use server";

import bcrypt from "bcryptjs";
import { update } from "@/auth";
import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { SettingsValidator } from "@/lib/validators/settings";

export const settings = async (values: SettingsValidator) => {
  const { user } = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await prismadb.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  //To prevent user from changing the data if they login from google or github.
  if (user.isOAuth) {
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  let hashedPassword = undefined;

  // If credential users wants to change their password
  if (values.password && values.newPassword && dbUser.hashedPassword) {
    //Compare password to password in the database
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.hashedPassword
    );

    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    //if password match encrypt new password
    const hashedNewPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = undefined;

    values.newPassword = undefined;

    hashedPassword = hashedNewPassword;
  }

  const updatedUser = await prismadb.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      name: values.name,
      image: values.image,
      hashedPassword,
      isTwoFactorEnabled: values.isTwoFactorEnabled,
    },
  });

  //Server side next auth update
  update({
    user: {
      name: updatedUser.name,
      image: updatedUser.image,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
    },
  });

  return { success: "Settings Updated!" };
};

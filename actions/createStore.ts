"use server";

import prismadb from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { postcodeValidator } from "postcode-validator";
import { generateStoreVerificationToken } from "@/lib/token";
import { sendStoreVerificationTokenEmail } from "@/lib/mail";
import { StoreValidator, StoreSchema } from "@/lib/validators/store";
import { getStoreVerificationTokenByEmail } from "@/data/store-verification-token";

export const createStore = async (values: StoreValidator) => {
  const { user } = await currentUser();

  if (!user) {
    return { error: "Unauthorized!" };
  }

  const dbUser = await prismadb.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    return { error: "Unauthorized!" };
  }

  const validatedFields = StoreSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, country, postcode, code } = validatedFields.data;

  //Check if postcode is valid
  const locationIsValid = postcodeValidator(postcode, country);

  if (!locationIsValid) {
    return { error: "Invalid postcode!" };
  }

  //Check if a store has used the email
  const storeExists = await prismadb.store.findUnique({
    where: {
      email,
    },
  });

  if (!storeExists) {
    //Create Store
    const store = await prismadb.store.create({
      data: {
        userId: dbUser.id,
        name,
        email,
        country,
        postcode,
      },
    });

    //Generate verification code
    const storeVerificationToken = await generateStoreVerificationToken(
      store.email
    );

    //Send generated code
    await sendStoreVerificationTokenEmail({
      email: storeVerificationToken.email,
      token: storeVerificationToken.token,
    });

    return { verificationCode: true };
  } else {
    if (code && storeExists?.email) {
      //Check it two factor token exists
      const storeVerificationToken = await getStoreVerificationTokenByEmail(
        email
      );

      console.log({ storeVerificationToken, code });

      if (!storeVerificationToken) {
        return { error: "Invalid code!" };
      }

      //Check if token === code
      if (storeVerificationToken.token !== code) {
        return { error: "Invalid code!" };
      }

      //Check if token has expired
      const hasExpired = new Date(storeVerificationToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      //Delete Token
      await prismadb.storeVerificationToken.delete({
        where: {
          id: storeVerificationToken.id,
        },
      });

      //Verify email address
      await prismadb.store.update({
        where: {
          id: storeExists.id,
          email: storeExists.email,
        },
        data: {
          emailVerified: new Date(),
        },
      });

      //Change current user to seller
      await prismadb.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          role: "SELLER",
        },
      });

      return {
        success: "Email verified, your store has been created!",
        storeId: storeExists.id,
      };
    }
  }
};

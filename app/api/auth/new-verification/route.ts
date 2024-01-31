import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export async function PATCH(request: Request) {
  try {
    const reqBody = await request.json();

    const { token } = reqBody;

    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    //Check if token exists
    const tokenExists = await getVerificationTokenByToken(token as string);

    if (!tokenExists) {
      return new NextResponse("Token does not exists!", { status: 401 });
    }

    //Check if token has expired
    const hasExpired = new Date(tokenExists.expires) < new Date();

    if (hasExpired) {
      return new NextResponse("Token has expired!", { status: 403 });
    }

    //Check if user exists
    const userExists = await getUserByEmail(tokenExists.email);

    if (!userExists) {
      return new NextResponse("Email does not exist!", { status: 400 });
    }

    //Verify email.
    await prismadb.user.update({
      where: { id: userExists.id },
      data: {
        emailVerified: new Date(),
        email: tokenExists.email, //We just use this for when users want to change their mail.
      },
    });

    //Delete token
    await prismadb.verificationToken.delete({
      where: {
        id: tokenExists.id,
      },
    });

    return NextResponse.json("Email verified!");
  } catch (err) {
    console.log("NEW_VERIFICATION" + err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

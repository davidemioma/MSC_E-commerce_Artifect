import bcrypt from "bcryptjs";
import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";
import { RegisterSchema } from "@/lib/validators/register";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();

    const { name, email, password } = RegisterSchema.parse(reqBody);

    if (!name) {
      return new NextResponse("Username is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    const emailExists = await getUserByEmail(email);

    if (emailExists) {
      return new NextResponse("Email already in use!", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prismadb.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json("Confirmation email sent!");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import bcrypt from "bcryptjs";
import prismadb from "@/lib/prisma";
import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validators/register";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();

    const { name, email, password } = RegisterSchema.parse(reqBody);

    return NextResponse.json("Account created");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

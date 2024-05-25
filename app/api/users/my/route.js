import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/prisma";
import "dotenv/config";

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        message: "유효하지 않은 토큰입니다."
      }, 
      {
        status: 401
      });
    }
    const userData = await prisma.User.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        email: true,
        username: true,
        emailConfirm: true,
      }
    });

    return NextResponse.json(userData);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json(null, {
      status: 500
    });
  }
}
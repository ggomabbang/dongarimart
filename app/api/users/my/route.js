import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import client from "../../../../prisma/prisma";
import "dotenv/config";

export async function GET() {
  const user_token = cookies().get('next-auth.session-token');
  const userid = await client.Session.findUnique({
    where: {
      sessionToken: user_token.value,
    },
    select: {
      userId: true,
    },
  });

  console.log(userid);

  const result = await client.user.findUnique({
    where: {
      id: userid.userId,
    },
    select: {
      email: true,
      username: true,
      emailVerified: true,
    },
  });

  console.log('user:', result);

  return NextResponse.json(result);
}
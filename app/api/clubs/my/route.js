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

  const result = await client.clublist.findMany({
    where: {
      members: {
        some: {
          userId: userid.userId,
        }
      },
    },
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
      members: {
        select: {
          isLeader: true,
        },
      },
    },
  });

  console.log('clublist:', result);

  return NextResponse.json(result);
}
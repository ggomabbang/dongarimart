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

  if (!user_token || !userid || !userid.userId) {
    return NextResponse.json({
      message: "유효하지 않은 토큰입니다."
    }, {
      status: 401,
    });
  }

  const result = await client.ClubList.findMany({
    where: {
      members: {
        some: {
          userId: userid.userId,
        }
      },
    },
    select: {
      id: true,
      clubName: true,
      classification: true,
      oneLine: true,
      short: true,
      pageURL: true,
      tags: {
        select: {
          tagList: true,
        },
      },
      members: {
        where: {
          userId: userid.userId,
        },
        select: {
          isLeader: true,
        }
      }
    },
  });

  const body = [];

  result.map((club) => {
    club.isLeader = club.members[0].isLeader;
    delete club.members;
    body.push(club);
  });

  console.log('clublist:', body);

  return NextResponse.json(body);
}
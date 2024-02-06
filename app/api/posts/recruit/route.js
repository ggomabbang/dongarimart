import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../prisma/prisma";
import { Prisma } from '@prisma/client'

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log(session);
  if (!session) {
    return NextResponse.json({
      message: "유효하지 않은 토큰입니다."
    }, {
      status: 401,
    });
  }

  const { clubid } = await request.json();

  const leader = await client.JoinedClub.findUnique({
    where: {
      userId_clubId: {
        userId: session.userId,
        clubId: clubid
      }
    },
    select: {
      isLeader: true
    }
  });

  if (!leader || !leader.isLeader) {
    return NextResponse.json({
      message: "권한이 없는 클라이언트입니다."
    }, {
      status: 403,
    });
  }

  const result = await client.Post.findMany({
    where: {
      clubId: clubid
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(result);
}
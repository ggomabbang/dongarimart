import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../../prisma/prisma";
import { Prisma } from '@prisma/client'

export async function GET() {
  const id = parseInt(request.url.slice(request.url.lastIndexOf('/') + 1));

  if(isNaN(parseInt(id))) {
    return NextResponse.json({
      parameter: "id",
      message: "int 형식이 아닌 ID 값입니다."
    }, {
      status: 400,
    });
  }

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

  const view = post.view;

  await client.Post.update({
    where: {
      id,
      isRecruit: true
    },
    data: {
      view: view + 1
    }
  });

  const user = await client.User.findUnique({
    where: {
      id: post.userId
    }
  });
  const username = user.username;

  const result = await client.Post.findUnique({
    where: {
      id,
      isRecruit: true,
    },
    select: {
      id: true,
      title: true,
      content: true,
      view: true,
      createdAt: true,
      updatedAt: true,
      image: {
        select:{
          filename: true,
        }
      },
      recruit: {
        select:{
          recruitStart: true,
          recruitEnd: true,
          recruitURL: true,
          recruitTarget: true,
        }
      },
    },
  });

  result.username = username;

  return NextResponse.json(result);
}
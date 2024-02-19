import { NextResponse } from "next/server";
import client from "../../../../../prisma/prisma";
import "dotenv/config";
import { Prisma } from '@prisma/client'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function DELETE(request) {
  const id = parseInt(request.url.slice(request.url.lastIndexOf('/') + 1));

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "유효하지 않은 토큰입니다."
    }, {
      status: 401,
    });
  }

  if (session.userRole !== 'admin') {
    return NextResponse.json({
      message: "등록 권한이 없는 클라이언트입니다."
    }, {
      status: 403,
    });
  }
  
  if(isNaN(id)) {
    return NextResponse.json({
      parameter: "id",
      message: "int 형식이 아닌 ID 값입니다."
    }, {
      status: 400,
    });
  }

  const myPost = await client.Post.findUnique({
    where: {
      id,
    },
  });

  if (!myPost || myPost.isRecruit) {
    return new Response(null, {
      status: 204,
    });
  }

  try {
    const result = await client.Post.delete({
      where: {
        id,
      }
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      message: "오류."
    }, {
      status: 500,
    });
  }
}
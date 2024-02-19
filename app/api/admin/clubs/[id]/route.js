import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../../prisma/prisma";
  
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

  const club = await client.ClubList.findUnique({
    where: {
      id,
    },
  });

  if (!club) {
    return new Response(null, {
      status: 204,
    });
  }

  const result = await client.clubList.delete({
    where: {
      id,
    }
  });

  if(result == null) {
    return new Response(null, {
      status: 204,
    })
  }
  
  return NextResponse.json(result);
}
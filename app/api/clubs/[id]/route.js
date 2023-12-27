import { NextResponse } from "next/server";
import client from "../../../../prisma/prisma";

export async function GET(request) {
  const id = parseInt(request.url.slice(request.url.lastIndexOf('/') + 1));

  if(isNaN(parseInt(id))) {
    return NextResponse.json({
      parameter: "id",
      message: "int 형식이 아닌 ID 값입니다."
    }, {
      status: 400,
    });
  }

  const result = await client.clubList.findUnique({
    where: {
      id,
    },
    include: {
      tags: {
        select: {
          tagList: true
        },
      },
    },
  });

  if(result == null) {
    return new Response(null, {
      status: 204,
    })
  }
  
  return NextResponse.json(result);
}
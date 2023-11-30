import { NextResponse } from "next/server";
import client from "../../../../prisma/prisma";

export async function GET(request) {
  const id = parseInt(request.url.slice(request.url.lastIndexOf('/') + 1));
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
  
  return NextResponse.json(result);
}
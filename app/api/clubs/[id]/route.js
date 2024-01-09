import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

export async function PATCH(request) {
  const id = parseInt(request.url.slice(request.url.lastIndexOf('/') + 1));

  const user_token = cookies().get('next-auth.session-token');

  const userid = user_token? await client.Session.findUnique({
    where: {
      sessionToken: user_token.value,
    },
    select: {
      userId: true,
      expires: true
    },
  }) : null;

  console.log(userid);
  if (!user_token || !userid.userId) {
    return NextResponse.json({
      message: "유효하지 않은 토큰입니다."
    }, {
      status: 401,
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

  const { oneLine, short, tags } = await request.json();

  if (!oneLine) {
    return NextResponse.json({
      parameter: "oneLine",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }
  if (!short) {
    return NextResponse.json({
      parameter: "short",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  const result = await client.clubList.update({
    where: {
      id,
    },
    data: {
      oneLine,
      short,
      tags: {
        update: tags.map((tag) => {
          return {
            tagList: {
              connectOrCreate: {
                where: { 
                  tagName: tag
                },
                create: { 
                  tagName: tag,
                },
              },
            }
          };
        }),
      },
    }
  });

  if(result == null) {
    return new Response(null, {
      status: 204,
    })
  }
  
  return NextResponse.json(result);
}
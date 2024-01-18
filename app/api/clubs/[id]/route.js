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

  const club = await client.clubList.findUnique({
    where: {
      id,
    },
  });

  if(club == null) {
    return new Response(null, {
      status: 204,
    });
  }

  const view = club.view;

  await client.clubList.update({
    where: {
      id,
    },
    data: {
      view: view + 1
    }
  });

  const result = await client.clubList.findUnique({
    where: {
      id,
    },
    include: {
      post: {
        where: {
          isRecruit: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 1,
        include: {
          recruit: true
        }
      },
      tags: {
        select: {
          tagList: true,
        },
      },
    },
  });

  let body = result;
  body.post = result.post[0];
  
  return NextResponse.json(body);
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
  if (!user_token || !userid || !userid.userId) {
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

  const club = await client.clubList.findUnique({
    where: {
      id,
    },
  });

  if (!club) {
    return new Response(null, {
      status: 204,
    });
  }

  const leader = await client.JoinedClub.findUnique({
    where: {
      userId_clubId: {
        userId: userid.userId,
        clubId: id
      }
    },
    select: {
      isLeader: true
    }
  });

  if (!leader || !leader.isLeader) {
    return NextResponse.json({
      message: "등록 권한이 없는 클라이언트입니다."
    }, {
      status: 403,
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

  const result = await client.ClubList.update({
    where: {
      id,
    },
    data: {
      oneLine,
      short,
      tags: {
        deleteMany: {},
        create: tags.map((tag) => {
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
  return new Response(null, {
    status: 201,
  });
}

export async function DELETE(request) {
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
  if (!user_token || !userid || !userid.userId) {
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

  const leader = await client.JoinedClub.findUnique({
    where: {
      userId_clubId: {
        userId: userid.userId,
        clubId: id
      }
    },
    select: {
      isLeader: true
    }
  });

  if (!leader || !leader.isLeader) {
    return NextResponse.json({
      message: "삭제 권한이 없는 클라이언트입니다."
    }, {
      status: 403,
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
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
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
    select: {
      id: true,
      clubName: true,
      classification: true,
      oneLine: true,
      short: true,
      isRecruiting: true,
      pageURL: true,
      image: {
        select:{
          filename: true,
        }
      },
      view: true,
      createdAt: true,
      updatedAt: true,
      post: {
        where: {
          isRecruit: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 1,
        select: {
          id: true,
          title: true,
          content: true,
          image: {
            select: {
              filename: true,
            }
          },
          recruit: {
            select: {
              recruitStart: true,
              recruitEnd: true,
              recruitTarget: true,
              recruitURL: true
            }
          }
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

  const session = await getServerSession(authOptions);

  if (!session) {
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
        userId: session.userId,
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

  let { oneLine, short, tags, url, image } = await request.json();

  const query = {
    where: {
      id,
    },
    data: { }
  }

  if (oneLine) {
    query.data.oneLine = oneLine;
  }

  if (short) {
    query.data.short = short;
  }

  if (tags) {
    query.data.tags = {
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
    };
  }

  if (image) {
    const validImage = await client.Image.findUnique({
      where: {
        filename: image
      }
    });
    if (!validImage || validImage.postId || validImage.clubId) {
      return NextResponse.json({
        parameter: "image",
        message: "해당 parameter가 잘못된 값입니다."
      }, {
        status: 400,
      });
    }
    query.data.image = {
      connect: {
        filename: image
      }
    };
  }

  if (url) {
    query.data.pageURL = url;
  }

  await client.ClubList.update(query);
  return new Response(null, {
    status: 201,
  });
}

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
        userId: session.userId,
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
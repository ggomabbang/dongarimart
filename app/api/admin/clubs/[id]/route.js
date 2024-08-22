import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../../prisma/prisma";

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

  const { username } = await request.json();

  if (!username) {
    return NextResponse.json({
      parameter: "username",
      message: "잘못된 parameter입니다."
    }, {
      status: 400,
    });
  }

  const curLeader = await client.JoinedClub.findMany({
    where: {
      clubId: id,
      isLeader: true
    }
  });
  
  let user = null;

  try {
    user = await client.User.findUnique({
      where: {
        username,
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({
        message: "올바르지 않은 parameter입니다."
      }, {
        status: 400,
      });
    }
    else {
      return NextResponse.json({
        message: "오류."
      }, {
        status: 500,
      });
    }
  }

  if (!user) {
    return NextResponse.json({
      parameter: "username",
      message: "그런 사용자는 없습니다."
    }, {
      status: 400,
    });
  }

  try {
    await client.JoinedClub.upsert({
      where: {
        userId_clubId: {
          userId: user.id,
          clubId: id
        }
      },
      update: {
        isLeader: true
      },
      create: {
        isLeader: true,
        joinedAt: new Date(),
        user: {
          connect: {
            id: user.id
          }
        },
        club: {
          connect: {
            id
          }
        }
      }
    });

    if (curLeader[0].userId == session.userId) {
      await client.JoinedClub.delete({
        where: {
          userId_clubId: {
            userId: session.userId,
            clubId: id
          }
        }
      });
    }
    else if (curLeader[0].userId == user.id) {
      return NextResponse.json({
        message: "이미 권한을 가진 사용자입니다."
      }, {
        status: 400,
      });
    }
    else {
      await client.JoinedClub.update({
        where: {
          userId_clubId: {
            userId: curLeader[0].userId,
            clubId: id
          }
        },
        data: {
          isLeader: false
        }
      });
    }
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({
        message: "올바르지 않은 parameter입니다."
      }, {
        status: 400,
      });
    }
    else {
      return NextResponse.json({
        message: "오류."
      }, {
        status: 500,
      });
    }
  }
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
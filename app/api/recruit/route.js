import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../prisma/prisma";
import { Prisma } from '@prisma/client'

const leftPad = (value) => {
  if (value >= 10) return value;
  return `0${value}`;
}

/*
  - Fri May 20 2022 10:30:20과 같은 Date() 형식을
    2022-05-20과 같은 String으로 바꾸어주는 함수
*/
const toStringByFormatting = (source, delimiter = '-') => {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}

export async function POST(request) {
  const param = request.nextUrl.searchParams;
  let clubId = param.get("clubid");
  clubId = parseInt(clubId);

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "유효하지 않은 토큰입니다."
    }, {
      status: 401,
    });
  }
  
  if(isNaN(clubId)) {
    return NextResponse.json({
      parameter: "id",
      message: "int 형식이 아닌 ID 값입니다."
    }, {
      status: 400,
    });
  }

  const club = await client.clubList.findUnique({
    where: {
      id: clubId,
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
        clubId
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

  const { start, end, url, people, title, content, image } = await request.json();

  const params = { start, end, title, content };
  for(const param in params) {
    if (!params[param]) {
      return NextResponse.json({
        parameter: param,
        message: "올바르지 않은 parameter입니다."
      }, {
        status: 400,
      });
    }
  }
  if (new Date(end) < new Date(toStringByFormatting(new Date()))) {
    return NextResponse.json({
      parameter: "end",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  if (image && !Array.isArray(image)) {
    return NextResponse.json({
      parameter: "image",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  let images;
  if (image) images = image;
  else images = [];

  const isValidImage = await Promise.all(
    images.map(async (img) => {
      const validImage = await client.Image.findUnique({
        where: {
          filename: img
        }
      });
      if (!validImage || validImage.postId || validImage.clubId) {
        return "failed";
      }
      else {
        return "success";
      }
    })
  );

  if (isValidImage.includes("failed")) {
    return NextResponse.json({
      parameter: "image",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  const query = {
    data: {
      title,
      content,
      isRecruit: true,
      recruit: {
        create: {
          recruitStart: new Date(start),
          recruitEnd: new Date(end),
          recruitURL: url ? url : null,
          recruitTarget: people ? JSON.stringify(people) : null,
        }
      },
      image: {
        connect: images.map((img) => {
          return {
            filename: img
          };
        }),
      },
      club: {
        connect: {
          id: clubId,
        }
      },
      user: {
        connect: {
          id: session.userId,
        }
      }
    },
  };

  try {
    const result = await client.Post.create(query);
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
        status: 500,
      });
    }
  }

  try {
    await client.ClubList.update({
      where: {
        id: clubId,
      },
      data: {
        isRecruiting: 
          new Date(toStringByFormatting(new Date())) < new Date(start) ?
          false : true,
        schedule: {
          upsert: {
            where: {
              clubId,
            },
            update: {
              recruitStart: new Date(start),
              recruitEnd: new Date(end),
            },
            create: {
              recruitStart: new Date(start),
              recruitEnd: new Date(end),
            }
          }
        }
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: 500,
    });
  }

  return new Response(null, {
    status: 201,
  });
}
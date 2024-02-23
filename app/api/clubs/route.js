import { NextResponse } from "next/server";
import client from "../../../prisma/prisma";
import "dotenv/config";
import { Prisma } from '@prisma/client'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { parse } from "dotenv";

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    let sortBy = params.get("sortBy");
    let reverse = params.get("reverse");
    let pagination = params.get("pagination");
    let page = params.get("page");
    let isRecruiting = params.get("isRecruiting");
    let tag = params.get("tag");
    const college = params.get("college");
    const search = params.get("search");

    if (sortBy === null) {
      sortBy = 'registration';
    }
    else if(sortBy !== 'registration' && sortBy !== 'name' && sortBy !== 'deadline' && sortBy !== 'popularity') {
      return NextResponse.json({
          parameter: "sortby",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (reverse === null) {
      reverse = 0;
    }
    if (pagination === null) {
      pagination = 0;
    }
    if (page === null) {
      page = 1;
    }
    if (isRecruiting === null) {
      isRecruiting = 0;
    }
    if (tag !== null) {
      tag = tag.split(',');
    }

    reverse = parseInt(reverse);
    pagination = parseInt(pagination);
    page = parseInt(page);
    isRecruiting = parseInt(isRecruiting);

    if (isNaN(reverse)) {
      return NextResponse.json({
          parameter: "reverse",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (isNaN(pagination) || pagination < 0) {
      return NextResponse.json({
          parameter: "pagination",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (isNaN(page) || page < 1) {
      return NextResponse.json({
          parameter: "page",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (isNaN(isRecruiting)) {
      return NextResponse.json({
          parameter: "isRecruiting",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }

    let query = {
      where: { },
      select: {
        id: true,
        clubName: true,
        classification: true,
        oneLine: true,
        isRecruiting: true,
        tags: {
          select: {
            tagList: true,
          }
        },
      }
    }

    if (isRecruiting == 1) {
      query.where.isRecruiting = true;
    }

    const order = reverse == 1? 'desc' : 'asc';
    switch(sortBy) {
      case 'registration':
        query.orderBy = [{createdAt: order}];
        break;
      case 'name':
        query.orderBy = [{clubName: order}];
        break;
      case 'deadline':
        query.orderBy = [{
          schedule: {
            recruitEnd: order
          }
        }];
        query.where.isRecruiting = true;
        break;
      case 'popularity':
        query.orderBy = [{view: order}];
        break;
    }
    if(pagination !== 0) {
      query.skip = (page - 1) * pagination;
      query.take = pagination;
    }
    if(tag !== null) {
      query.where.AND = tag.map((t) => ({
        tags: {
          some: {
            tagList: {
              tagName: t
            }
          }
        }
      }));
    }
    if (college !== null) {
      query.where.classification = college;
    }
    if (search) {
      query.where.clubName = { contains: search };
    }

    try {
      const result = await client.ClubList.findMany(query);
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

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "유효하지 않은 토큰입니다."
    }, {
      status: 401,
    });
  }

  const user = await client.User.findUnique({
    where: {
      id: session.userId
    }
  });

  if (!user.emailConfirm) {
    return NextResponse.json({
      message: "인증되지 않은 계정입니다."
    }, {
      status: 403,
    });
  }

  const { clubName, department, oneLine, short, tags, url, image } = await request.json();

  if (!clubName) {
    return NextResponse.json({
      parameter: "clubName",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }
  if (!department) {
    return NextResponse.json({
      parameter: "department",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }
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
  if (tags && !Array.isArray(tags)) {
    return NextResponse.json({
      parameter: "tags",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }
  
  const club = await client.ClubList.findUnique({
    where: {
      clubName
    }
  });
  if (club) {
    return NextResponse.json({
      parameter: "clubName",
      message: "해당 parameter가 중복된 값입니다."
    }, {
      status: 400,
    });
  }

  const query = {
    data: {
      clubName,
      oneLine,
      short,
      members: {
        create: {
          user: {
            connect: {
              id: session.userId,
            }
          },
          isLeader: true,
          joinedAt: new Date(),
        },
      },
      isRecruiting: false,
      classification: department,
      view: 0,
    },
  };

  if (url) {
    query.data.pageURL = url;
  }

  if (tags) {
    query.data.tags = {
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
    if (!validImage) {
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

  try {
    await client.ClubList.create(query);
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
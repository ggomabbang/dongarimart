import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../prisma/prisma";
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

  const myPost = await client.Post.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
      clubId: true,
      isRecruit: true,
    }
  });

  if (!myPost || !myPost.isRecruit) {
    return new Response(null, {
      status: 204,
    });
  }

  const leader = await client.JoinedClub.findUnique({
    where: {
      userId_clubId: {
        userId: session.userId,
        clubId: myPost.clubId
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
    where: {
      id,
    },
    data: { },
  };

  if (start || end || people || url) {
    if (start && !end) {
      return NextResponse.json({
        parameter: "end",
        message: "올바르지 않은 parameter입니다."
      }, {
        status: 400,
      });
    }

    if (!start && end) {
      return NextResponse.json({
        parameter: "start",
        message: "올바르지 않은 parameter입니다."
      }, {
        status: 400,
      });
    }

    query.data.recruit = {
      update: {
        where: {
          postId: id,
        },
        data: { }
      }
    };
    if (start) {
      if (new Date(start) <= new Date(toStringByFormatting(new Date()))) {
        query.data.isRecruit = true
      }
      query.data.recruit.update.data.recruitStart = new Date(start);
    }
    if (end) {
      if (new Date(end) < new Date(toStringByFormatting(new Date()))) {
        return NextResponse.json({
          parameter: "end",
          message: "올바르지 않은 parameter입니다."
        }, {
          status: 400,
        });
      }
      query.data.recruit.update.data.recruitEnd = new Date(end);
    }
    if (url) {
      query.data.recruit.update.data.recruitURL = url;
    }
    if (people) {
      query.data.recruit.update.data.recruitTarget = JSON.stringify(people)
    }
  }

  if (title) {
    query.data.title = title;
  }

  if (content) {
    query.data.content = content;
  }

  if (image) {
    query.data.image = {
      connect: image.map((img) => {
        return {
          filename: img
        };
      })
    };
  }

  try {
    await client.Post.update(query);
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

  if (start || end) {
    const clubQuery = {
      where: {
        id: myPost.clubId,
      },
      data: {
        schedule: {
          upsert: {
            where: {
              clubId: myPost.clubId,
            },
            update: { },
            create: { }
          }
        }
      }
    };

    clubQuery.data.isRecruiting = new Date(toStringByFormatting(new Date())) < new Date(start) ?
    false : true;
    clubQuery.data.schedule.upsert.update.recruitStart = new Date(start);
    clubQuery.data.schedule.upsert.create.recruitStart = new Date(start);
    clubQuery.data.schedule.upsert.update.recruitEnd = new Date(end);
    clubQuery.data.schedule.upsert.create.recruitEnd = new Date(end);

    try {
      await client.ClubList.update(query);
    } catch (e) {
      console.error(e);
      return NextResponse.json({
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
    select: {
      userId: true,
      clubId: true,
      isRecruit: true,
    }
  });

  if (!myPost || !myPost.isRecruit) {
    return new Response(null, {
      status: 204,
    });
  }

  const leader = await client.JoinedClub.findUnique({
    where: {
      userId_clubId: {
        userId: session.userId,
        clubId: myPost.clubId
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

  try {
    const result = await client.Post.delete({
      where: {
        id,
      }
    });

    await client.RecruitSchedule.delete({
      where: {
        clubId: myPost.clubId
      }
    })

    await client.clubList.update({
      where: {
        id: myPost.clubId
      },
      data: {
        isRecruiting: false
      }
    })

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      status: 500,
    });
  }
}
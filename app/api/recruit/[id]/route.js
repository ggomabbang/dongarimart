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

  // 받아오는 거에서 isRecrut에 영향을 미칠 수 있는 변수 하나 추가
  const { start, end, url, people, title, content, image, gg } = await request.json();

  let images;
  if (image) images = image;
  else images = [];

  const isValidImage = await Promise.all(
    images.map(async (img) => {
      let validImage = null;
      if (img) {
        validImage = await client.Image.findUnique({
          where: {
            filename: img
          }
        });
      }
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
      set: [],
      connect: image.map((img) => {
        return {
          filename: img
        };
      })
    };
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
    
    // 아래로 내리기.
    if (gg == 3) {
      // 모집중인가 아닌가
      clubQuery.data.isRecruiting = false
      // 모집글이 있는가 없는가 -> 
      // query.data.isRecruit = false
      console.log("모집 종료 처리, gg:", gg);
      // 
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
          message: "오류."
        }, {
          status: 500,
        });
      }
    }
    // 여기는 아닌듯, 여기는 start와 end가 바뀜에 따라 club의 isRecruiting을 업뎃함.
    // TODO 왜 여기서 false설정을 해도 다시 true로 바뀌는가..
    clubQuery.data.isRecruiting = new Date(toStringByFormatting(new Date())) < new Date(start) ?
    false : true;
    if (gg == 3) {
      clubQuery.data.isRecruiting = false
      // query.data.isRecruit = false
      console.log("모집 종료 처리됨, isRecruiting 상태:", clubQuery.data.isRecruiting);
    }
    clubQuery.data.schedule.upsert.update.recruitStart = new Date(start);
    clubQuery.data.schedule.upsert.create.recruitStart = new Date(start);
    clubQuery.data.schedule.upsert.update.recruitEnd = new Date(end);
    clubQuery.data.schedule.upsert.create.recruitEnd = new Date(end);
    
    console.log("마지막 isRecruiting 값:", clubQuery.data.isRecruiting);

    try {
      await client.ClubList.update(clubQuery);
    } catch (e) {
      console.error(e);
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

  // isRecruit를 0으로 할 시 경우들.
  // 이미 isRecruit가 0이어서 오류가 뜬다
  // 그리고 isRecruit를 0으로 해도 모집중이떠요
  // 또 end날짜가 start날짜로 바뀌어요
  //TODO 근데 isRecruit는 모집글이 있는가 없는가인데 동아리가 존재하지 않는다는 서로 다른 의미가 아닌가
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
      message: "오류."
    }, {
      status: 500,
    });
  }
}
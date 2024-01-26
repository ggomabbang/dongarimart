import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

export async function POST(request) {
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

  let images;
  if (image) images = image;
  else images = [];

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
          id,
        }
      },
      user: {
        connect: {
          id: userid.userId,
        }
      }
    },
  };

  try {
    await client.Post.create(query);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e);
      return NextResponse.json({
        message: "올바르지 않은 parameter입니다."
      }, {
        status: 400,
      });
    }
  }

  await client.ClubList.update({
    where: {
      id,
    },
    data: {
      isRecruiting: 
        new Date(toStringByFormatting(new Date())) < new Date(start) ?
        false : true,
      schedule: {
        upsert: {
          where: {
            clubId: id,
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

  return new Response(null, {
    status: 201,
  });
}

export async function PUT(request) {
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

  const myPost = await client.Post.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
      clubId: true,
    }
  });

  if (!myPost) {
    return new Response(null, {
      status: 204,
    });
  }

  const leader = await client.JoinedClub.findUnique({
    where: {
      userId_clubId: {
        userId: userid.userId,
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

  let images;
  if (image) images = image;
  else images = [];

  const query = {
    where: {
      id,
    },
    data: {
      title,
      content,
      isRecruit: true,
      recruit: {
        update: {
          where: {
            postId: id,
          },
          data: {
            recruitStart: new Date(start),
            recruitEnd: new Date(end),
            recruitURL: url ? url : null,
            recruitTarget: people ? JSON.stringify(people) : null,
          }
        }
      },
      image: {
        connect: images.map((img) => {
          return {
            filename: img
          };
        }),
      },
    },
  };

  try {
    await client.Post.update(query);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientValidationError) {
      console.log(e);
      return NextResponse.json({
        message: "올바르지 않은 parameter입니다."
      }, {
        status: 400,
      });
    }
  }

  await client.ClubList.update({
    where: {
      id: myPost.clubId,
    },
    data: {
      isRecruiting: 
        new Date(toStringByFormatting(new Date())) < new Date(start) ?
        false : true,
      schedule: {
        upsert: {
          where: {
            clubId: myPost.clubId,
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

  const myPost = await client.Post.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
      clubId: true,
    }
  });

  if (!myPost) {
    return new Response(null, {
      status: 204,
    });
  }

  const leader = await client.JoinedClub.findUnique({
    where: {
      userId_clubId: {
        userId: userid.userId,
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
}
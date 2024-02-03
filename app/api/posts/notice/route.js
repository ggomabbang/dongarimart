export async function POST(request) {
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

  // if (!leader || !leader.isLeader) {
  //   return NextResponse.json({
  //     message: "등록 권한이 없는 클라이언트입니다."
  //   }, {
  //     status: 403,
  //   });
  // }

  const { title, content } = await request.json();

  if (!title) {
    return NextResponse.json({
      parameter: "title",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  if (!content) {
    return NextResponse.json({
      parameter: "content",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  const query = {
    data: {
      title,
      content,
      isNotice: true,
      user: {
        connect: {
          id: userid.userId,
        }
      }
    },
  };

  try {
    const result = await client.Post.create(query);
    console.log(!result);
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

  return new Response(null, {
    status: 201,
  });
}
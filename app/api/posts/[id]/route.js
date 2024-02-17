import { NextResponse } from "next/server";
import client from "../../../../prisma/prisma";
import "dotenv/config";
import { Prisma } from '@prisma/client'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

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

  const post = await client.Post.findUnique({
    where: {
      id,
    },
  });

  if(post === null || post.isRecruit) {
    return new Response(null, {
      status: 204,
    });
  }

  const view = post.view;

  await client.Post.update({
    where: {
      id,
    },
    data: {
      view: view + 1
    }
  });

  const user = await client.User.findUnique({
    where: {
      id: post.userId
    }
  });
  const username = user.username;

  const result = await client.Post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true,
      view: true,
      image: {
        select:{
          filename: true,
        }
      },
    },
  });

  result.username = username;
  
  return NextResponse.json(result);
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

  const post = await client.Post.findUnique({
    where: {
      id,
    },
  });

  if (!post || post.isRecruit) {
    return new Response(null, {
      status: 204,
    });
  }

  if (post.userId !== session.userId) {
    return NextResponse.json({
      message: "등록 권한이 없는 클라이언트입니다."
    }, {
      status: 403,
    });
  }

  const { title, content, image } = await request.json();

  if (image && !Array.isArray(image)) {
    return NextResponse.json({
      parameter: "image",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  const isValidImage = await Promise.all(
    image.map(async (img) => {
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
    data: { }
  };

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
  });

  if (!myPost || myPost.isRecruit) {
    return new Response(null, {
      status: 204,
    });
  }

  if (myPost.userId !== session.userId) {
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
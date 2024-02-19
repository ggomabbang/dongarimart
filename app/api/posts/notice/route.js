import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../prisma/prisma";
import { Prisma } from '@prisma/client'

export async function GET(request) {
  try {
    const result = await client.Post.findMany({
      where: {
        isNotice: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        updatedAt: true
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

export async function POST(request) {
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

  const { title, content, image } = await request.json();

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
    data: {
      title,
      content,
      isNotice: true,
      user: {
        connect: {
          id: session.userId,
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
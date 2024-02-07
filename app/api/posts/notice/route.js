import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "../../../../prisma/prisma";
import { Prisma } from '@prisma/client'

export async function GET(request) {
  const result = await client.Post.findMany({
    where: {
      "isNotice": true
    },
    select: {
      "id": true,
      "title": true,
      "updatedAt": true
    }
  });

  return NextResponse.json(result);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  console.log(session);
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
      if (!validImage) {
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
import { NextResponse } from "next/server";
import { headers } from 'next/headers';
import client from "@/prisma/prisma";
import { writeFile, readFile } from 'fs/promises';
import { randomBytes } from "crypto";

export async function POST(request) {
  if (headers().get('Content-Type').split(';')[0] !== 'multipart/form-data') {
    return NextResponse.json({
      message: "입력 형식이 올바르지 않습니다."
    }, {
      status: 400,
    });
  }

  const data = await request.formData();
  const dataArr = data.getAll("image");

  if (dataArr.length > 10) {
    return NextResponse.json({
      message: "첨부 이미지의 수가 너무 많습니다."
    }, {
      status: 400,
    });
  }

  const res = {};
  await Promise.all(dataArr.map(async (img, index) => {
    const buffer = Buffer.from( await img.arrayBuffer() );

    if (img.type.split('/')[0] !== 'image') return // image 파일이 아닐 시 무시

    const type = img.type.split('/')[1]
    if (type !== 'png' && type !=='jpeg') return // png, jpeg 파일이 아닐 시 무시

    const filename = randomBytes(8).toString('hex') + String((new Date()).getTime()) + `.${type}`;
    const path = `public/image/${filename}`;
    await writeFile(path, buffer);
    await client.Image.create({
      data: {
        filename
      }
    });
    res[index] = filename;
  }))
  .catch((err) => {
    console.error(err);
    return NextResponse.json({
      message: "서버 처리중 오류가 발생하였습니다."
    }, {
      status: 500,
    });
  });

  return NextResponse.json(res, {
    status: 201
  });
}

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const filename = params.get("filename");

  if (!filename || filename == '') {
    return NextResponse.json({
      parameter: "filename",
      message: "지원하지 않는 형식의 값입니다."
    }, {
      status: 400
    })
  }

  const result = await client.Image.findUnique({
    where: {
      filename,
    }
  });

  if (!result) {
    return new Response(null, {
      status: 204
    });
  }

  console.log(result);

  const headers = new Headers();
  headers.append('Content-Type', `image/${filename.split('.')[1]}`);
  
  const buffer = await readFile(`public/image/${filename}`);
  return new Response(buffer , {
    headers
  });
}
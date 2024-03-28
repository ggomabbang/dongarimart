import { NextResponse } from "next/server";
import client from "../../../../../prisma/prisma";
import * as fs from 'fs';
import "dotenv/config";

export async function POST(request) {
  const id = parseInt(request.url.slice(request.url.lastIndexOf('/') + 1));

  if(isNaN(parseInt(id))) {
    return NextResponse.json({
      parameter: "id",
      message: "int 형식이 아닌 ID 값입니다."
    }, {
      status: 400,
    });
  }

  let { contents, ip } = await request.json();

  if (!contents) {
    return NextResponse.json({
      parameter: "ip",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  if (!ip) {
    return NextResponse.json({
      parameter: "ip",
      message: "올바르지 않은 parameter입니다."
    }, {
      status: 400,
    });
  }

  ip = ip.split('.').slice(0, 2).join('.') + ".*.*";

  const result = await client.Post.findUnique({
    where: {
      id,
    }
  });

  if (!result) {
    return new Response(null, {
      status: 204
    });
  }

  const path = "public/reports.txt";
  const stream = fs.createWriteStream(path, { flags: 'a' });
  stream.write("=======================================\n");
  stream.write(String(new Date) + '\n');
  stream.write('신고자: ' + ip + '\n');
  stream.write('신고된 글 ID: ' + id + '\n');
  stream.write('내용: ' + contents + '\n');
  stream.end();

  await client.Post.update({
    where: {
      id,
    },
    data: {
      reportCount: result.reportCount + 1
    }
  });

  return new Response(null, {
    status: 201,
  });
}
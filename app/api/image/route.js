import { NextResponse } from "next/server";
import { headers } from 'next/headers';
import client from "@/prisma/prisma";
import { writeFile } from 'fs/promises';

// export const config = {
//   api: {
//     bodyParser: false,
//   }
// };

export async function POST(request) {
  console.log(headers().get('Content-Type'));

  const data = await request.formData();
  const dataArr = data.getAll("image");

  const names = [];
  await Promise.all(dataArr.map(async (img) => {
    const buffer = Buffer.from( await img.arrayBuffer() );
    const filename = String((new Date()).getTime()) + `.${img.type.split('/')[1]}`;
    const path = `public/image/${filename}`;
    await writeFile(path, buffer);
    names.push(filename);
  }))
  .catch((err) => console.error);

  console.log(names);

  return NextResponse.json({filename: names});
}
import { NextResponse } from "next/server";
import client from "../../../prisma/prisma";
import "dotenv/config";

// const mysql = require('mysql2/promise');

// const connection1 = await mysql.createConnection({
//     host: 'localhost',    // MySQL 호스트명
//     user: process.env.SQL_USER,     // 사용자 이름
//     password: process.env.SQL_PASSWORD, // 비밀번호
//     database: 'wave'    // 데이터베이스 이름
// }); 

// function addNew({username, email}) {
//     const newUser = { username: username, email: email };
//     connection1.query('INSERT INTO users SET ?', newUser, (err, result) => {
//         if (err) {
//         console.error('Error inserting data:', err);
//         return 99;
//         }
//         console.log('Inserted new user with ID:', result.insertId);
//         return 0;
//     });
// }

export async function GET() {
    const result = await client.clublist.findMany({
      include: {
        tags: {
          select: {
            tag: true
          },
        },
      },
    });
    return NextResponse.json(result);
}

// export async function DELETE(request) {
//     const { username, email } = await request.json();

//     if (!username || !email) return NextResponse.json({ 'message': "missing required data"});

//     connection1.query(`DELETE FROM users WHERE username='${username}' AND email='${email}'`,  (err, result) => {
//         if (err) {
//         console.error('Error deleting data:', err);
//         return 99;
//         }
//         console.log('Deleted.');
//     });

//     return NextResponse.json({ "message": "deleted"})
// }

export async function POST(request) {
  const { clubName, department, oneLine, short, tags } = await request.json();

  const result = await client.clublist.create({
    data: {
      clubName,
      department,
      oneLine,
      short,
      tags: {
        create: tags.map((tag) => {
          return {
            assignedAt: new Date(),
            tag: {
              connectOrCreate: {
                where: { tagName: tag },
                create: { tagName: tag },
              },
            }
          };
        }),
      },
      isRecruiting: 0,
    }
  })
  
  return NextResponse.json(result);
}

// export async function PUT(request) {
//     const { username, email } = await request.json();

//     return NextResponse.json({'message': "working in progress"});
// }
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import client from "../../../prisma/prisma";
import "dotenv/config";
import { parse } from "dotenv";

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

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    let sortBy = params.get("sortBy");
    let reverse = params.get("reverse");
    let pagination = params.get("pagination");
    let page = params.get("page");
    let isRecruiting = params.get("isRecruiting");
    let tag = params.get("tag");
    const college = params.get("college");

    if (sortBy === null) {
      sortBy = 'registration';
    }
    else if(sortBy !== 'registration' && sortBy !== 'name' && sortBy !== 'deadline' && sortBy !== 'popularity') {
      return NextResponse.json({
          parameter: "sortby",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (reverse === null) {
      reverse = 0;
    }
    if (pagination === null) {
      pagination = 0;
    }
    if (page === null) {
      page = 1;
    }
    if (isRecruiting === null) {
      isRecruiting = 0;
    }
    if (tag !== null) {
      tag = tag.split(',');
    }

    reverse = parseInt(reverse);
    pagination = parseInt(pagination);
    page = parseInt(page);
    isRecruiting = parseInt(isRecruiting);

    if (isNaN(reverse)) {
      return NextResponse.json({
          parameter: "reverse",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (isNaN(pagination) || pagination < 0) {
      return NextResponse.json({
          parameter: "pagination",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (isNaN(page) || page < 1) {
      return NextResponse.json({
          parameter: "page",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }
    if (isNaN(isRecruiting)) {
      return NextResponse.json({
          parameter: "isRecruiting",
          message: "지원하지 않는 형식의 값입니다."
      }, {
        status: 400,
      });
    }

    const isRecruitingBool = isRecruiting == 1 ? true : false;

    let query = {
      where: {
        isRecruiting: isRecruitingBool
      },
      include: {
        tags: {
          select: {
            tagList: true
          },
        },
      },
    }
    const order = reverse == 1? 'desc' : 'asc';
    switch(sortBy) {
      case 'registration':
        query.orderBy = [{createdAt: order}];
        break;
      case 'name':
        query.orderBy = [{clubName: order}];
        break;
      case 'deadline':
        query.orderBy = [{recruitPeriod: order}];
        query.where.isRecruiting = 1;
        break;
      case 'popularity':
        query.orderBy = [{view: order}];
        break;
    }
    if(pagination !== 0) {
      query.skip = (page - 1) * pagination;
      query.take = pagination;
    }
    if(tag !== null) {
      query.where.AND = [];
      for(let i = 0; i < tag.length; i++) {
        query.where.AND.push({
          tags: {
            some: {
              tagList: {
                tagName: tag[i]
              }
            }
          }
        });
      }
    }
    if (college !== null) {
      //query.where.department = college;
    }

    const result = await client.ClubList.findMany(query);
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
  const user_token = cookies().get('next-auth.session-token');

  const userid = await client.Session.findUnique({
    where: {
      sessionToken: user_token.value,
    },
    select: {
      userId: true,
    },
  });
  console.log(userid);

  const { clubName, department, oneLine, short, tags } = await request.json();

  const result = await client.ClubList.create({
    data: {
      clubName,
      oneLine,
      short,
      tags: {
        create: tags.map((tag) => {
          return {
            tagList: {
              connectOrCreate: {
                where: { 
                  tagName: tag
                },
                create: { 
                  tagName: tag,
                  createdAt: new Date(),
                },
              },
            }
          };
        }),
      },
      members: {
        create: {
          user: {
            connect: {
              id: userid.userId,
            }
          },
          isLeader: true,
          joinedAt: new Date(),
        },
      },
      isRecruiting: false,
      classification: department,
      view: 0,
    },
  })
  
  return NextResponse.json(result);
}

// export async function PUT(request) {
//     const { username, email } = await request.json();

//     return NextResponse.json({'message': "working in progress"});
// }
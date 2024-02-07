import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(request) {
    const { username, password, email } = await request.json();
    
    // 파라미터 확인
    if (username === null || username === undefined || username === "") {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        })
    }    
    if (password === null || password === undefined || password === "") {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        })
    }
    if (email === null || email === undefined || email === "") {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        })
    }

    // 이메일 형식 확인 (부산대 이메일만 가입 가능)
    const emailRE = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@pusan.ac.kr");
    let resultRE = emailRE.exec(email);
    if (resultRE === null) {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        })
    }
    if (resultRE.input !== email) {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        })
    }

    // 중복 유저 확인 
    const user = await prisma.User.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        },
    });

    if (user !== null) {
        return NextResponse.json({
            parameter: "email",
            message: "이미 중복되는 유저가 존재합니다."
        }, {
            status: 403
        });
    }

    // 비밀번호 암호화
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashPW = await bcrypt.hash(password, salt);
    
    // 데이터베이스에 등록
    const newUser = await prisma.User.create({
        data: {
            username: username,
            email: email,
            password: hashPW,
        },
    });

    const newToken = await prisma.RefreshToken.create({
        data: {
            user: {
                connect: {
                    id: newUser.id,
                }
            }
        }
    });
    
    return new Response(null, {
        status: 201,
    });

}

export async function GET(request) {
    const username = request.nextUrl.searchParams.get("username");
    const email = request.nextUrl.searchParams.get("email");

    // 파라미터가 없는 경우 확인 
    if (username === null && email === null) {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        });
    }

    // 닉네임으로 중복 확인 
    if (username !== null) {
        const user = await prisma.User.findFirst({
            where: {
                username: username,
            },
            select: {
                id: true,
            },
        });

        if (user !== null) {
            return NextResponse.json({
                exist: "true"
            }, {
                status: 200
            })
        }
        else {
            return NextResponse.json({
                exist: "false"
            }, {
                status: 200
            })
        }
    }

    // 이메일로 중복 확인
    else if (email !== null) {
        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
            },
        });

        if (user !== null) {
            return NextResponse.json({
                exist: "true"
            }, {
                status: 200
            })
        }
        else {
            return NextResponse.json({
                exist: "false"
            }, {
                status: 200
            })
        }
    }
    else {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        });
    }
}

export async function DELETE(request) {
    const session = await getServerSession(authOptions);
    const { password } = await request.json();

    if (!session) {
        console.log("no login");
        return new Response(null, {
            status: 401
        });
    } 

    if (password === null || password === undefined || password === "") {
        console.log("no password");
        return new Response(null, {
            status: 400,
        });
    }

    const user = await prisma.User.findUnique({
        where: {
            id: session.userId,
        }, 
        select: {
            password: true,
        }
    });

    if (!user) {
        console.log("no user");
        return new Response(null, {
            status: 401,
        });
    }

    const bcrypt = require("bcryptjs");
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        console.log("wrong password");
        return NextResponse.json(null, {
            status: 400
        });
    }
    
    const deleteUser = await prisma.User.delete({
        where: {
            id: session.userId
        }
    });

    return NextResponse.json(null, {
        status: 200
    });
}
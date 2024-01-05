import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { createHash } from "crypto";

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
    const hashPW = createHash("sha256").update(password).digest("hex");
    
    // 데이터베이스에 등록
    const newUser = await prisma.User.create({
        data: {
            username: username,
            email: email,
            password: hashPW,
        },
    });
    
    return NextResponse.json(newUser);

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
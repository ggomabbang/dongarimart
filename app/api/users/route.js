import { NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(request) {
    try {
        const { username, password, email } = await request.json();
        
        // 파라미터 확인
        if (username === null || username === undefined || username === "") {
            return NextResponse.json({
                message: "올바르지 않은 parameter입니다."
            }, {
                status: 400
            });
        }    
        if (password === null || password === undefined || password === "") {
            return NextResponse.json({
                message: "올바르지 않은 parameter입니다."
            }, {
                status: 400
            });
        }
        if (email === null || email === undefined || email === "") {
            return NextResponse.json({
                message: "올바르지 않은 parameter입니다."
            }, {
                status: 400
            });
        }
    
        // 이메일 형식 확인 (부산대 이메일만 가입 가능)
        const emailRE = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@pusan.ac.kr");
        let resultRE = emailRE.exec(email);
        if (!resultRE) {
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
    
        // 이메일 중복 확인 
        const checkEmail = await prisma.User.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
            },
        });
    
        if (checkEmail) {
            return NextResponse.json({
                parameter: "email",
                message: "이미 중복되는 유저가 존재합니다."
            }, {
                status: 403
            });
        }
    
        // 유저네임 중복 확인
        const checkName = await prisma.User.findUnique({
            where: {
                username: username,
            },
            select: {
                id: true,
            },
        });
    
        if (checkName) {
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
    catch (error) {
        console.error(error);
        return NextResponse.json(null, {
            status: 500
        });
    }
}

export async function GET(request) {
    try {
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
        if (username) {
            const user = await prisma.User.findFirst({
                where: {
                    username: username,
                },
                select: {
                    id: true,
                },
            });
    
            if (user) {
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
        else if (email) {
            const user = await prisma.User.findUnique({
                where: {
                    email: email,
                },
                select: {
                    id: true,
                },
            });
    
            if (user) {
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
    catch (error) {
        console.error(error);
        return NextResponse.json(null, {
            status: 500
        });
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        const { password } = await request.json();
    
        if (!session) {
            return new Response(null, {
                status: 401
            });
        } 
    
        if (password === null || password === undefined || password === "") {
            return new Response(null, {
                status: 400,
            });
        }
    
        const user = await prisma.User.findUnique({
            where: {
                id: session.userId,
            }, 
            select: {
                email: true,
                password: true,
            }
        });
    
        if (!user) {
            return new Response(null, {
                status: 401,
            });
        }
    
        const bcrypt = require("bcryptjs");
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return NextResponse.json(null, {
                status: 400
            });
        }
        
        const deleteUser = await prisma.User.delete({
            where: {
                id: session.userId
            }
        });
    
        const deleteEmail = await prisma.VerifyingEmail.delete({
            where: {
                email: user.email
            }
        });
    
        return NextResponse.json(null, {
            status: 200
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(null, {
            status: 500
        });
    }
}
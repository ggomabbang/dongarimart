import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as nodeMailer from 'nodemailer';
import moment from "moment";

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        const { password, newPassword } = await request.json();
        
        // 로그인 안 되어 있는 경우
        if (!session) {
            return new Response(null, {
                status: 401,
            });
        }
    
        if (password === null || password === undefined || password === "") {
            return new Response(null, {
                status: 400,
            });
        }
    
        if (newPassword === null || newPassword === undefined || newPassword === "") {
            return new Response(null, {
                status: 400,
            });
        }
    
        const oldUser = await prisma.User.findUnique({
            where: {
                id: session.userId,
            }, 
            select: {
                password: true
            }
        });
    
        const bcrypt = require("bcryptjs");
        const checkPassword = await bcrypt.compare(password, oldUser.password);
        if (!checkPassword) {
            return new Response(null, {
                status: 401,
            });
        }
    
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);
    
        const newUser = await prisma.User.update({
            where: {
                id: session.userId,
            },
            data: {
                password: newHash,
            }
        });
    
        return new Response(null, {
            status: 201
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse(null, {
            status: 500
        });
    }
}

export async function DELETE(request) {
    try {
        const { token } = await request.json();
        const email = await prisma.VerifyingEmail.findUnique({
            where: {
                token: token
            }
        });

        if (!email) {
            return NextResponse.json(null, {
                status: 401
            });
        }

        if (moment().isAfter(email.tokenExpires)) {
            return NextResponse.json(null, {
                status: 401
            });
        }

        const { randomBytes } = await import('node:crypto');
        const newPassword = randomBytes(5).toString('hex');
    
        const bcrypt = require("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);
        // 이메일 전송 객체 생성
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_ADDRESS , pass: process.env.EMAIL_PASSWORD },
        })
        
        const mailOptions = {
            to: email.email,
            subject: '동아리마트 비밀번호 초기화 메일',
            html: `
                <h1>비밀번호 초기화</h1>
                <p>아래 비밀번호로 로그인 후 비밀번호를 변경해주십시오</p>
                <p>${newPassword}</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        const newUser = await prisma.User.update({
            where: {
                email: email.email,
            },
            data: {
                password: newHash,
            }
        });

        const verification = await prisma.VerifyingEmail.update({
            where: {
                email: email.email
            },
            data: {
                verifiedDone: true
            }
        });
        
        return NextResponse.json(null);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(null, {
            status: 500
        });
    }
}
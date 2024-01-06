import { NextResponse } from "next/server"; 
import prisma from "@/prisma/prisma";
import { env } from '@/next.config';
import * as nodeMailer from 'nodemailer';

export async function POST(request) {
    const { email } = await request.json();

    // 파라미터 확인
    if (email === null || email === undefined || email === "") {
        return NextResponse.json({
            message: "올바르지 않은 parameter입니다."
        }, {
            status: 400
        });
    }

    // 이메일 형식 확인
    const emailRE = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@pusan.ac.kr");
    let REResult = emailRE.exec(email);
    if (REResult === null) {
        return new Response(null, {
            status: 204
        });
    }
    if (REResult.input !== email) {
        return new Response(null, {
            status: 204
        });
    }
    
    // 이미 인증된 이메일 확인
    const user = await prisma.User.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            emailVerified: true,
        },
    });

    if (user !== null) {
        console.log(user.emailVerified);
        if (user.emailVerified === true) {
            return new Response(null, {
                status: 204
            });
        }
    }

    // 인증 토큰 생성
    const { randomBytes } = await import('node:crypto');
    const token = randomBytes(256).toString('hex');
    console.log(token);

    // 토큰 재발급인지 확인 
    const oldEmail = await prisma.VerifyingEmail.findUnique({
        where: {
            email: email,
        },
        select: {
            // 만료기한 확인
            
        }
    });

    if (oldEmail !== null) {
        // 만료기한 확인
        // 만료 안되었으면 종료


        // 만료 되었으면 update
        const updateEmail = await prisma.VerifyingEmail.update({
            where: {
                email: email,
            },
            data: {

            },
        });
    }
    
    // 데이터베이스에 저장
    const newEmail = await prisma.VerifyingEmail.create({
        data: {
            email: email,
            token: token,
            // 만료기한 추가
        },
    });
    
    // 이메일 전송 객체 생성
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_ADDRESS , pass: process.env.EMAIL_PASSWORD },
    })

    const mailOptions = {
        to: email,
        subject: 'Wave 가입 인증 메일',
        html: '<h1>인증링크를 클릭하세요</h1>' + "<a>" + token + '</a>'
    };

    await transporter.sendMail(mailOptions);

    return new Response(null, {
        status: 204
    });
}

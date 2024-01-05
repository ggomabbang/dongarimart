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

    return NextResponse.json(email);

}

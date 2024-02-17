import { NextResponse } from "next/server"; 
import prisma from "@/prisma/prisma";
import { env } from '@/next.config';
import * as nodeMailer from 'nodemailer';
import moment from "moment";
import emailSender from "@/app/lib/emailSender";

export async function POST(request) {
    try {

        // 이메일 테스트 사용법
        // 이메일 종류 3개 : signUp / resetPassword / newPassword - renderFile 인자에 있는 경로만 바꿔주면 됨
        // 전달해줘야하는 것 : signUp, newPassword -> name, token / resetPassword -> name, password

        const name = "이름";
        const token = "몰라임마";
        const email = "ggomabbang@pusan.ac.kr";

        const ejs = require("ejs");
        let emailTemplate;
        ejs.renderFile(
            "app/lib/emailTemplate/resetPassword.ejs",
            { name: name, password: token },
            function(err, data) {
                if (err) {
                    throw err;
                }
                emailTemplate = data;
            }
        );
        
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: '동아리마트 비밀번호 초기화 메일',
            html: emailTemplate
        };
    

        emailSender.sendMail(mailOptions);

        return new Response(null, {
            status: 204
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(null, {
            status: 500
        });
    }
}

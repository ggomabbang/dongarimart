import { NextResponse } from "next/server"; 
import * as nodeMailer from 'nodemailer';
import emailSender from "@/app/lib/emailSender";

export async function POST(request) {
    try {
        const email = "ggomabbang@pusan.ac.kr";
        const ejs = require("ejs");

        let emailTemplate;
        ejs.renderFile(
            "app/lib/emailTemplate/signUp.ejs",
            { name: email.split('@')[0], url: 'https://www.dongarimart.com' },
            function(err, data) {
                if (err) {
                    throw err;
                }
                emailTemplate = data;
            }
        );

        // 이메일 전송 객체 생성
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: '동아리마트 가입 인증 메일',
            html: emailTemplate
        };
    
        emailSender.sendMail(mailOptions);
    
        return NextResponse.json(null);
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(null, {
            status: 500
        });
    }
}

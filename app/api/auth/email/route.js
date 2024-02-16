import { NextResponse } from "next/server"; 
import prisma from "@/prisma/prisma";
import { env } from '@/next.config';
import * as nodeMailer from 'nodemailer';
import moment from "moment";
import emailSender from "@/app/lib/emailSender";

export async function POST(request) {
    try {
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
        let resultRE = emailRE.exec(email);
        if (!resultRE) {
            return new Response(null, {
                status: 204
            });
        }
        if (resultRE.input !== email) {
            return new Response(null, {
                status: 204
            });
        }
    
        // 가입된 이메일인지 확인
        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                username: true,
                emailConfirm: true,
            },
        });

        if (!user) {
            return new Response(null, {
                status: 204
            });
        }
        
        // 인증된 메일인지 확인
        if (user.emailConfirm === true) {
            return new Response(null, {
                status: 204
            });
        }
        
        // 인증 토큰 생성
        const { randomBytes } = await import('node:crypto');
        const token = randomBytes(125).toString('hex');
    
        // 토큰 재발급인지 확인 
        const oldEmail = await prisma.VerifyingEmail.findUnique({
            where: {
                email: email,
            },
            select: {
                tokenExpires: true,    
                verifiedDone: true,       
            }
        });
    
        if (oldEmail) {
            // 만료기한 확인
            const dateExpire = moment(oldEmail.tokenExpires);
            const nextExpire = moment().add(1, 'd');
            
            // 만료 안되었으면 종료
            if (moment().isBefore(dateExpire)) {
                return new Response(null, {
                    status: 204
                });
            }
    
            // 이미 인증된 이메일이면 종료
            if (oldEmail.verifiedDone === true) {
                return new Response(null, {
                    status: 204
                });
            }
    
            // 만료 되었고 아직 인증되지 않은 이메일이면 update
            const updateEmail = await prisma.VerifyingEmail.update({
                where: {
                    email: email,
                },
                data: {
                    token: token,
                    tokenExpires: nextExpire,
                },
            });
        }
        else {
            const nextExpire = moment().add(1, 'd');
            // 새로운 이메일인 경우 데이터베이스에 저장
            const newEmail = await prisma.VerifyingEmail.create({
                data: {
                    email: email,
                    token: token,
                    tokenExpires: nextExpire,
                },
            });
        }

        const ejs = require("ejs");
        let emailTemplate;
        ejs.renderFile(
            "app/lib/emailTemplate/signUp.ejs",
            { name: user.username, token: token },
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
            subject: '동아리마트 가입 인증 메일',
            html: emailTemplate
        };
    

        emailSender.sendMail(mailOptions);

        return new Response(null, {
            status: 204
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse(null, {
            status: 500
        });
    }
}

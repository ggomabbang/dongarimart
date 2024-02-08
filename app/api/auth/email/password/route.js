import prisma from "@/prisma/prisma";
import moment from "moment";
import { NextResponse } from "next/server";
import * as nodeMailer from 'nodemailer';

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (email === null || email === undefined || email === "") {
            return NextResponse.json({
                message: "올바르지 않은 parameter입니다."
            }, {
                status: 400
            });
        } 

        const user = await prisma.User.findUnique({
            where: {
                email: email
            }, 
            select: {
                id: true, 
                emailConfirm: true
            }            
        });

        if (!user) {
            return new Response(null, {
                status: 204
            });
        }

        if (user.emailConfirm === false) {
            return new Response(null, {
                status: 204
            });
        }

        const oldEmail = await prisma.VerifyingEmail.findUnique({
            where: {
                email: email
            }
        });

        if (!oldEmail) {
            return new Response(null, {
                status: 204
            })
        };

        if (oldEmail.verifiedDone === false) {
            return new Response(null, {
                status: 204
            });
        }

        if (moment().isBefore(oldEmail.tokenExpires)) {
            return new Response(null, {
                status: 204
            });
        }

        const { randomBytes } = await import('node:crypto');
        const token = randomBytes(125).toString('hex');
        const tokenExpires = moment().add(1, "d");

        const newToken = await prisma.VerifyingEmail.update({
            where: {
                email: email
            },
            data: {
                token: token,
                tokenExpires: tokenExpires,
                verifiedDone: false
            }
        });
        
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_ADDRESS , pass: process.env.EMAIL_PASSWORD },
        });
    
        const mailOptions = {
            to: email,
            subject: '동아리마트 초기화 비밀번호 메일',
            html: `
                <h1>비밀번호 초기화를 위한 인증 메일입니다</h1>
                <p>아래 링크를 클릭해 이메일 인증이 완료되면 새 비밀번호가 이메일로 전송됩니다</p>
                <a href="http://localhost:3000/login/findpw/${token}">이메일 인증 링크</a>
            `
        };
    
        await transporter.sendMail(mailOptions);

        return new Response(null, {
            status: 204
        });
    }
    catch (error) {
        console.log(error); 
        return new Response(null, {
            status: 204
        });
    }


}
import emailSender from "@/app/lib/emailSender";
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

        const ejs = require("ejs");
        let emailTemplate;
        ejs.renderFile(
            "app/lib/emailTemplate/resetPassword.ejs",
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
            subject: '동아리마트 초기화 비밀번호 메일',
            html: emailTemplate
        };
    
        emailSender.sendMail(mailOptions);

        return new Response(null, {
            status: 204
        });
    }
    catch (error) {
        console.error(error); 
        return new Response(null, {
            status: 500
        });
    }


}
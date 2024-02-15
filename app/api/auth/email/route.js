import { NextResponse } from "next/server"; 
import prisma from "@/prisma/prisma";
import { env } from '@/next.config';
import * as nodeMailer from 'nodemailer';
import moment from "moment";

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
        
        // 이메일 전송 객체 생성
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_ADDRESS , pass: process.env.EMAIL_PASSWORD },
        })
    
        const mailOptions = {
            to: email,
            subject: '동아리마트 가입 인증 메일',
            html: `
            <h1>동아리마트 가입 인증 메일</h1>
            <div>
                <p>${user.username}님 환영합니다</p>
                <p>아래 링크를 클릭해 이메일 인증을 완료해주세요</p>
                <a href="http://localhost:3000/auth/email/${token}">이메일 인증 링크</a>
                <p>이메일 인증이 정상적으로 되지 않는다면 아래 연락처로 연락바랍니다</p>
            </div>
            `
        };
    
        await transporter.sendMail(mailOptions);
    
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

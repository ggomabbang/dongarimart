import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import prisma from "@/prisma/prisma";

export async function GET(request, { params }) {
    const token = params.token;
    console.log(token);

    // 해당 토큰을 가진 이메일 확인
    const email = await prisma.VerifyingEmail.findUnique({
        where: {
            token: token,
        },
    });

    // 토큰이 데이터베이스에 존재하지 않음 
    if (email === null) {
        return NextResponse.json({
            message: "유효하지 않은 토큰입니다."
        }, {
            status: 401
        });
    }

    // 토큰이 만료됨
    const dateExpire = email.tokencreated;
    const timeNow = Date.now();
    dateExpire.setDate(dateExpire.getDate() + 1);

    if (dateExpire.getTime() < timeNow.getTime()) {
        return NextResponse.json({
            message: "토큰이 만료되었습니다."
        }, {
            status: 401
        });
    }
    
    // 정상적으로 인증 처리
    const user = await prisma.User.update({
        where: {
            email: email.email,
        },
        data: {
            emailConfirm: true,
        }
    });

    const emailVerified = await prisma.VerifyingEmail.update({
        where: {
            email: email.email,
        },
        data: {
            verifiedDone: true,
        }
    });

    return NextResponse.json({
        message: "이메일 인증이 완료되었습니다.",
    });
}
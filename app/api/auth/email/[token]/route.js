import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import prisma from "@/prisma/prisma";

export async function GET(request, params) {
    const token = params.token;

    // 해당 토큰을 가진 이메일 확인
    const email = await prisma.VerifyingEmail.findMany({
        where: {
            token: token,
        },
    });

    // 토큰이 데이터베이스에 존재하지 않음 
    
    // 만약 토큰이 중복되어 존재한다면?


    // 토큰이 만료됨

    
    // 정상적으로 인증 처리

    redirect('http://localhost:3000/');
}
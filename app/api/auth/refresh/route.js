import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    console.log("token refresh");
    const body = await request.json();

    // 입력 파라미터 확인 
    if (body.userId === null || body.userId === undefined || body.userId === "") {
        return new Response(JSON.stringify(null));
    }

    if (body.refreshToken === null || body.refreshToken === undefined || body.refreshToken === "") {
        return new Response(JSON.stringify(null));
    }
    
    // refresh token 검증
    const tokenRefresh = await prisma.User.findUnique({
        where: {
            id: body.userId,
        },
        select: {
            refreshToken: true,
            refreshExpiresAt : true
        }
    });
    
    // 값 검증
    if (tokenRefresh.refreshToken !== body.refreshToken) {
        return new Response(JSON.stringify(null));
    }
    
    // 유효시간 검증
    if (tokenRefresh.refreshExpiresAt < Date.now()) {
        return new Response(JSON.stringify(null));
    }
    
    const accessToken = crypto.randomUUID();
    const expires = new Date().setTime(Date.now() + + 24*60*60*1000);
    const refreshToken = crypto.randomUUID();
    const updateRefreshToken = await prisma.User.update({
        where: {
            id: body.userId,
        },
        data: {
            refreshToken: refreshToken,
            refreshExpiresAt: expires,
        }
    });

    return NextResponse.json({
        accessToken: accessToken,
        tokenExpires: expires,
        refreshToken: refreshToken,
    });
}
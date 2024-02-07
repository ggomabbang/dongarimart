import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(request) {
    try {
        const body = await request.json();
    
        // 입력 파라미터 확인 
        if (body.userId === null || body.userId === undefined || body.userId === "") {
            console.log("wrong user id");
            return new Response(null, {
                status: 401,
            });
        }
    
        if (body.refreshToken === null || body.refreshToken === undefined || body.refreshToken === "") {
            console.log("wrong refresh token");
            return new Response(null, {
                status: 401,
            });
        }
        
        // refresh token 검증
        const tokenRefresh = await prisma.RefreshToken.findUnique({
            where: {
                userId: body.userId,
            },
            select: {
                token: true,
                tokenExpires : true
            }
        });

        // 값 검증
        if (tokenRefresh.refreshToken !== body.refreshToken) {
            console.log("wrong refresh token");
            return new Response(null, {
                status: 401,
            });
        }
        
        // 유효기간 검증
        if (moment().isAfter(tokenRefresh.refreshExpiresAt)) {
            console.log("expired refresh token");
            return new Response(null, {
                status: 401,
            });
        }
        
        const accessToken = crypto.randomUUID();
        const accessTokenExpires = moment().add(1, 'h');
        const refreshToken = crypto.randomUUID();
        
        const updateRefreshToken = await prisma.RefreshToken.update({
            where: {
                userId: body.userId,
            },
            data: {
                token: refreshToken,
            }
        });
        
        return NextResponse.json({
            accessToken: accessToken,
            tokenExpires: accessTokenExpires,
            refreshToken: refreshToken,
        });
    }
    catch (error) {
        console.log(error);
        return new Response(null, {
            status: 401,
        })
    }
}
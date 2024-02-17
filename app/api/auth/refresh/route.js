import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(request) {
    try {
        const body = await request.json();
    
        // 입력 파라미터 확인 
        if (body.userId === null || body.userId === undefined || body.userId === "") {
            return new Response(null, {
                status: 401,
            });
        }
    
        if (body.refreshToken === null || body.refreshToken === undefined || body.refreshToken === "") {
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
        if (tokenRefresh.token !== body.refreshToken) {
            return new Response(null, {
                status: 401,
            });
        }
        
        // 유효기간 검증
        if (moment().isAfter(tokenRefresh.tokenExpires)) {
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
        console.error(error);
        return NextResponse.json(null, {
            status: 500,
        })
    }
}
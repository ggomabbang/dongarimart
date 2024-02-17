import prisma from "@/prisma/prisma";
import moment from "moment";

const adminId = process.env.ADMIN_ID;

export async function POST(request) {
    try {
        const body = await request.json();
        
        if (body.email === null || body.email === undefined || body.email === "") {
            return new Response(JSON.stringify(null));
        }
        
        if (body.password === null || body.password === undefined || body.password === "") {
            return new Response(JSON.stringify(null));
        }
        
        const user = await prisma.User.findUnique({
            where: {
                email: body.email,
            },
            select: {
                id: true,
                username: true,
                password: true,
            }
        });
        
        // 유저가 존재하는 지 확인 
        if (user === null) {
            return new Response(JSON.stringify(null));
        }
        
        // 패스워드 확인 
        const bcrypt = require('bcryptjs');
        const checkPassword = await bcrypt.compare(body.password, user.password);
        if (!checkPassword) {
            return new Response(JSON.stringify(null));
        }

        const { id, username } = user;
        const accessToken = crypto.randomUUID();
        const refreshToken = crypto.randomUUID();
        const refreshExpires = moment().add(1, 'd');
        let role = "";
        if (username === adminId) { 
            role = "admin";
        }
        else {
            role = "user";
        }
        
        const updateRefreshToken = await prisma.RefreshToken.update({
            where: {
                userId: id,
            },
            data: {
                token: refreshToken,
                tokenExpires: refreshExpires,
            }
        });
        return new Response(JSON.stringify({
            id: id, 
            role: role,
            accessToken: accessToken,
            refreshToken: refreshToken,
        }));
    }
    catch (error) {
        console.eror(error);
        return NextResponse(null, {
            status: 500
        });
    }
}
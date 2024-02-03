import prisma from "@/prisma/prisma";
import moment from "moment";

const adminId = process.env.ADMIN_ID;

export async function POST(request) {
    try {
        const body = await request.json();
        
        if (body.email === null || body.email === undefined || body.email === "") {
            console.log("wrong email");
            return new Response(JSON.stringify(null));
        }
        
        if (body.password === null || body.password === undefined || body.password === "") {
            console.log("wrong password");
            return new Response(JSON.stringify(null));
        }
        
        const user = await prisma.User.findUnique({
            where: {
                email: body.email,
            },
            select: {
                id: true,
                email: true,
                emailConfirm: true,
                password: true,
            }
        });
        
        // 유저가 존재하는 지 확인 
        if (user === null) {
            console.log("no user");
            return new Response(JSON.stringify(null));
        }
        
        // 이메일 인증되었는지 확인
        if (user.emailConfirm !== true) {
            console.log("no email verified");
            return new Response(JSON.stringify(null));
        }
        // 패스워드 확인 
        const bcrypt = require('bcryptjs');
        const checkPassword = await bcrypt.compare(body.password, user.password);
        if (checkPassword) {
            const { id, email } = user;
            const accessToken = crypto.randomUUID();
            const refreshToken = crypto.randomUUID();
            const refreshExpires = moment().add(1, 'd');
            console.log("Now : " + moment().format());
            console.log("Refresh Token Expires : " + refreshExpires.format());
            let role = "";
            if (email == adminId) {
                role = "admin";
            }
            else {
                role = "user";
            }
            const updateRefreshToken = await prisma.User.update({
                where: {
                    id: id,
                },
                data: {
                    refreshToken: refreshToken,
                    refreshExpiresAt: refreshExpires,
                }
            });
            return new Response(JSON.stringify({
                id: id, 
                role: role,
                accessToken: accessToken,
                refreshToken: refreshToken,
            }));
        }
        console.log("wrong password");
        return new Response(JSON.stringify(null));
    }
    catch (error) {
        console.log(error);
        return new Response(JSON.stringify(null));
    }
}
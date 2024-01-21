import prisma from "@/prisma/prisma";

const adminId = process.env.ADMIN_ID;

export async function POST(request) {
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
    });

    // 유저가 존재하는 지 확인 
    if (user === null) {
        return new Response(JSON.stringify(null));
    }

    // 이메일 인증되었는지 확인
    if (user.emailConfirm !== true) {
        return new Response(JSON.stringify(null));
    }
    // 패스워드 확인 
    const bcrypt = require('bcryptjs');
    if (bcrypt.compareSync(body.password, user.password)) {
        const { id, email } = user;
        let role = "";
        if (email == adminId) {
            role = "admin";
        }
        else {
            role = "user";
        }
        return new Response(JSON.stringify({
            id: id, 
            role: role
        }));
    }

    return new Response(JSON.stringify(null));
}
import prisma from "@/prisma/prisma";

export async function POST(request) {
    const body = await request.json();

    console.log(body);

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
        const { email } = user;
        return new Response(JSON.stringify(email));
    }

    return new Response(JSON.stringify(null));
}
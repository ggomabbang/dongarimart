import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/prisma/prisma";

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        const { username } = await request.json();

        if (session?.userRole !== "admin") {
            return NextResponse.json(null, {
                status: 401
            });
        }

        const user = await prisma.User.findUnique({
            where: {
                username: username
            },
            select: {
                id: true,
                email: true
            }
        });
        
        if (!user) {
            return NextResponse.json(null, {
                status: 400
            });
        }

        const deleteUser = await prisma.User.delete({
            where: {
                username: username
            }
        });

        const deleteEmail = await prisma.VerifyingEmail.delete({
            where: {
                email: user.email
            }
        });

        return NextResponse.json(null);

    }
    catch (error) {
        console.error(error);
        return NextResponse.json(null, {
            status: 500
        });
    }
}
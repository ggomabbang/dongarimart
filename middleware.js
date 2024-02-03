import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    console.log("middleware");

    const token = await getToken({ req: request });
    const url = request.nextUrl.pathname;

    // 로그인했을 때 로그인 / 회원가입 페이지 접근
    if (url.startsWith('/login')) {
        console.log("login page");
        if (token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // 로그인하지 않았을 때 My 페이지 접근
    if (url.startsWith('/my') || url.startsWith('/register') || url.startsWith('/recruit')) {
        console.log('my page');
        if (token === null) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (token.userRole !== 'user' && token.userRole !== 'admin') {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

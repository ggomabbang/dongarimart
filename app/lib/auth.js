import CredentialsProvider from "next-auth/providers/credentials";
import { getToken } from "next-auth/jwt";
import "dotenv/config";

export const authOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: 'email', type: 'text', placeholder: 'xxx@pusan.ac.kr' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials, req) {
                const response = await fetch(`${process.env.NEXTAUTH_URL}/login`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: credentials?.email,
                      password: credentials?.password
                    }),
                });
                const user = await response.json();

                if (user) {
                    return user;    
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            console.log("callback jwt");
            // 처음 로그인할 때 토큰 발급 
            if (user) {
                return {
                    userId: user.id,
                    userRole: user.role,
                    accessToken: user.accessToken,
                    tokenExpires: new Date().setTime(Date.now() + 60*60*1000),
                    refreshToken: user.refreshToken
                }
            }
            // 만료 시간이 지나지 않았으면 그대로 반환 
            if (Date.now() < token.tokenExpires) {
                return token;
            }
            // 만료 시간 지나면 refresh 
            return refreshAccessToken(token);
        },

        async session({session, token}) {
            console.log("callback session");
            if (token) {
                session.userId = token.userId;
                session.role = token.userRole;
            }
            return session;
        }
    }
};

async function refreshAccessToken(token) {
    const { userId, refreshToken } = token;
    const response = await fetch(`${process.env.NEXTAUTH_URL}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            refreshToken: refreshToken,
        }),
    });

    const refreshAccessToken = await response.json();

    if (!response.ok) {
        throw refreshAccessToken;
    }

    return {
        ...token,
        accessToken: refreshAccessToken.accessToken,
        tokenExpires: refreshAccessToken.tokenExpires,
        refreshToken: refreshAccessToken.refreshToken,
    };
}
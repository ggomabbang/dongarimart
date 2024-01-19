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
                const res = await fetch(`${process.env.NEXTAUTH_URL}/login`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: credentials?.email,
                      password: credentials?.password
                    }),
                });
                const user = await res.json();
                console.log(user);

                if (user) {
                    return user;    
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            // 처음 로그인할 때 토큰 발급 
            if (user) {
                const accessToken = crypto.randomUUID();
                console.log(accessToken);
                return {
                    userID: user.id,
                    userRole: "user",
                    accessToken: accessToken
                }
            }
            console.log(`token keys : ${Object.keys(token)}`);
            console.log(`token values : ${Object.values(token)}`);
            // refresh
            return token;
        },

        async session({session, token}) {
            console.log(`session keys : ${Object.keys(session)}`);
            console.log(`session values : ${Object.values(session)}`);
            console.log(`token keys : ${Object.keys(token)}`);
            console.log(`token values : ${Object.values(token)}`);
            session.userID = token.userID;
            session.role = token.userRole;
            return session;
        }
    }
};

import CredentialsProvider from "next-auth/providers/credentials";
import moment from "moment";
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
                try {
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
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
                }
                catch (error) {
                    console.log(error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login'
    },
    callbacks: {
        async jwt({token, user}) {
            console.log("jwt");
            // 처음 로그인할 때 토큰 발급 
            if (user) {
                const accessTokenExpires = moment().add(1, 'h');
                console.log("Now : " + moment().format());
                console.log("Access Token Expires : " + accessTokenExpires.format());
                return {
                    userId: user.id,
                    userRole: user.role,
                    accessToken: user.accessToken,
                    tokenExpires: accessTokenExpires,
                    refreshToken: user.refreshToken
                }
            }
            console.log("Now : " + moment().format());
            console.log("Access Token Expires : " + moment(token.tokenExpires).format());
            console.log("Access Token : " + token.accessToken);
            console.log("Refresh Token : " + token.refreshToken);
            // 만료 시간이 지나지 않았으면 그대로 반환 
            if (moment().isBefore(token.tokenExpires)) {
                console.log("return token");
                return token;
            }
            // 만료 시간 지나면 refresh 
            console.log("refresh token");
            return refreshAccessToken(token);
        },

        async session({session, token}) {
            console.log("callback session");
            if (token) {
                session.userId = token.userId;
                session.userRole = token.userRole;
                session.error = token.error;
            }
            return session;
        }
    }
};

async function refreshAccessToken(token) {
    try {
        const { userId, refreshToken } = token;
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                refreshToken: refreshToken,
            }),
        });
    
        if (!response.ok) {
            throw response;
        }
        
        const refreshAccessToken = await response.json();

        console.log("new access token : " + refreshAccessToken.accessToken);
        console.log("new refresh token : " + refreshAccessToken.refreshToken);
    
        return {
            ...token,
            accessToken: refreshAccessToken.accessToken,
            tokenExpires: refreshAccessToken.tokenExpires,
            refreshToken: refreshAccessToken.refreshToken,
        };
    }
    catch (error) {
        console.error("token refresh error");
        return {
            ...token,
            error: "RefreshAccessTokenError"
        }
    }
}
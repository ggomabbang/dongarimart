import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import client from "../../../../prisma/prisma";
import "dotenv/config";

const handler = NextAuth({
  //adapter: PrismaAdapter(client),
  providers: [
    
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile: (profile) => {
        return {
          id: profile.id,
          username: profile.login,
          email: profile.email
        }
      }
    }),
    
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },

      async authorize(credentials, req) {
        const res = await fetch(`${process.env.AUTH_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          }),
        })

        const user = await res.json();
        console.log(user);

        if (user) {
          return user;
        }
        return null;
      }
    })
  ],
});

export { handler as GET, handler as POST };
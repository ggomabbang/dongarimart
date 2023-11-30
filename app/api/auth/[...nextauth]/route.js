import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import client from "../../../../prisma/prisma";
import "dotenv/config";

const handler = NextAuth({
  adapter: PrismaAdapter(client),
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
  ],
});

export { handler as GET, handler as POST };
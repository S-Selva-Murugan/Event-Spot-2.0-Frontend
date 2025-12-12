import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET as string,

  callbacks: {
    async jwt({ token, account }) {
      // 🔹 Runs when user first signs in
      if (account) {
        token.idToken = account.id_token; // Google ID Token
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      // 🔹 Make the ID token available on session
      if (token) {
        (session as any).idToken = token.idToken;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

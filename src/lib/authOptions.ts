import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import type { AuthOptions } from "next-auth";

async function isUsernameTaken(name: string): Promise<boolean> {
  const res = await fetch(`http://localhost:5000/api/auth/check-username/${name}`);
  return res.status === 409;
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(" authorize вызван, credentials:", credentials);
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!res.ok) {
          console.error(" authorize failed:", await res.text());
          return null;
        }

        const data = await res.json();
        console.log(" authorize: got user =", data.user);

        return {
          id: data.user.id || data.user._id?.toString(),
          name: data.user.username,
          email: data.user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(" jwt received user:", user);
        token.id = user.id;
      } else {
        console.log("🔁 jwt reused token:", token);
      }
      return token;
    },
    async session({ session, token }) {
      console.log(" session received token:", token);
      if (session.user && token.id) {
        session.user.id = token.id as string;
        console.log(" session.user.id =", session.user.id);
      } else {
        console.warn(" session.user.id could not be set");
      }
      return session;
    },
    async signIn({ user }) {
      if ((user as any).username) return true;

      const base = (user.name || user.email?.split("@")[0] || "user")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      let username = base;
      let i = 0;

      while (await isUsernameTaken(username)) {
        i++;
        username = `${base}${i}`;
      }

      console.log("🔧 Assigning username:", username);

      await fetch("http://localhost:5000/api/auth/assign-username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, username }),
      });

      return true;
    },
  },
};

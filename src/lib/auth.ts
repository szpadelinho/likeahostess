import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/../prisma/prisma"
import bcrypt from "bcrypt"

export const { auth, handlers } = NextAuth({
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },

    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }),

        Credentials({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const { identifier, password } = credentials as {
                    identifier: string
                    password: string
                }

                if (!identifier || !password) return null

                const isEmail = identifier.includes("@")

                const user = await prisma.user.findFirst({
                    where: isEmail
                        ? { email: identifier }
                        : { name: identifier }
                })

                if (!user || !user.password) return null

                const valid = bcrypt.compare(password, user.password)
                if (!valid) return null

                return user
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },

    pages: {
        signIn: "/auth/login"
    },

    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
})

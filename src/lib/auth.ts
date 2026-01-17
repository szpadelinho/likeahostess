import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/../prisma/prisma"

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

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],

    callbacks: {
        async redirect({url, baseUrl}){
            if (url === baseUrl || url === `${baseUrl}/` || url === `${baseUrl}/auth`) {
                return `${baseUrl}/selection`
            }

            return url.startsWith(baseUrl) ? url : baseUrl
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.tutorialDone = (user as any).tutorialDone ?? false
                token.image = user.image
                token.name = user.name
            }

            if(trigger === "update" && session){
                if(session.name) token.name = session.name
                if(session.image) token.image = session.image
            }
            return token
        },

        async session({ session, token }) {
            if (token && session?.user) {
                session.user.id = token.id as string
                session.user.tutorialDone = token.tutorialDone as boolean
                session.user.image = token.image as string
                session.user.name = token.name as string
            }
            return session
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,
})

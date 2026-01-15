import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        tutorialDone: boolean
    }

    interface Session {
        user: {
            id: string
            tutorialDone: boolean
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        tutorialDone?: boolean
    }
}
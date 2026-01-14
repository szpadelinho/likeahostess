import { DefaultSession } from "next-auth"
import { AdapterUser } from "next-auth/adapters"

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

declare module "next-auth/adapters" {
    interface AdapterUser {
        tutorialDone: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        tutorialDone?: boolean
    }
}

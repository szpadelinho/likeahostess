import {Metadata} from "next"
import AuthClient from "@/app/auth/authClient"
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
    title: "Invitation to the club",
    description: "Welcome to Like a Hostess!"
}

export default async function Selection() {
    return <AuthClient/>
}
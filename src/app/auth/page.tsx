import {Metadata} from "next"
import AuthClient from "@/app/auth/authClient"

export const metadata: Metadata = {
    title: "Invitation to the club",
    description: "Welcome to Like a Hostess!"
}

export default function Selection() {
    return <AuthClient/>
}
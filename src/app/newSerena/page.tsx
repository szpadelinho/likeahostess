import {Metadata} from "next"
import NewSerenaClient from "@/app/newSerena/newSerenaClient";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "New Serena",
    description: "Visit your local drinking buddy"
}

export default async function NewSerena() {
    const session = await auth()
    if (!session) {
        redirect("/auth")
    }

    return <NewSerenaClient/>
}
import {redirect} from 'next/navigation'
import {auth} from "@/lib/auth";
import Main from "@/components/main";

export const metadata = {
    title: "Like a Hostess"
}

export default async function Home() {
    const session = await auth()

    if (!session) {
        redirect("/auth")
    }

    return <Main/>
}
import {redirect} from 'next/navigation'
import {auth} from "@/lib/auth";
import Main from "@/components/main";
import {Metadata} from "next";
import {getCurrentClub} from "@/lib/getCurrentClub";

export async function generateMetadata(): Promise<Metadata> {
    const session = await auth();

    if (!session) {
        return { title: "Unauthorized" };
    }

    const currentClub = await getCurrentClub(session.user.id);

    return {
        title: currentClub?.club?.name ?? "Unknown club"
    };
}

export default async function Home() {
    const session = await auth()

    if (!session) {
        redirect("/auth")
    }

    return <Main/>
}
import {redirect} from 'next/navigation'
import {auth} from "@/lib/auth";
import Main from "@/components/main";
import {Metadata} from "next";
import {cookies} from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
    const session = await auth();
    if (!session) {
        return { title: "Unauthorized" };
    }

    const cookieHeader = cookies().toString();

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/current-club`, {
        cache: "no-store",
        headers: {
            Cookie: cookieHeader
        }
    });

    if (!res.ok) {
        return { title: "Unknown club" };
    }

    const club = await res.json();

    return {
        title: club?.name ? `${club.name}` : "Unknown club",
    };
}

export default async function Home() {
    const session = await auth()

    if (!session) {
        redirect("/auth")
    }

    return <Main/>
}
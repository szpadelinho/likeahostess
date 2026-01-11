import {Metadata} from "next";
import {LoveInHeartClient} from "@/app/loveInHeart/loveInHeartClient";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Love in Heart",
    description: "A familiar massage parlor"
}

export default async function LoveInHeart() {
    const session = await auth()
    if (!session) {
        redirect("/auth")
    }

    return <LoveInHeartClient/>
}
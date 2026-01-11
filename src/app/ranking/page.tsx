import {Metadata} from "next"
import RankingClient from "@/app/ranking/rankingClient";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Ranking",
    description: "View the leaders"
}

export default async function Ranking() {
    const session = await auth()
    if (!session) {
        redirect("/auth")
    }

    return <RankingClient/>
}
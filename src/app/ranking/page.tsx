import {Metadata} from "next"
import RankingClient from "@/app/ranking/rankingClient";

export const metadata: Metadata = {
    title: "Ranking",
    description: "View the leaders"
}

export default function Selection() {
    return <RankingClient/>
}
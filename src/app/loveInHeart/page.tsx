import {Metadata} from "next";
import {LoveInHeartClient} from "@/app/loveInHeart/loveInHeartClient";

export const metadata: Metadata = {
    title: "Love in Heart",
    description: "A familiar massage parlor"
}

export default async function LoveInHeart() {
    return <LoveInHeartClient/>
}
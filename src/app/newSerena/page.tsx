import {Metadata} from "next"
import NewSerenaClient from "@/app/newSerena/newSerenaClient";

export const metadata: Metadata = {
    title: "New Serena",
    description: "Visit your local drinking buddy"
}

export default function NewSerena() {
    return <NewSerenaClient/>
}
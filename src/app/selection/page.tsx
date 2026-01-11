import {Metadata} from "next";
import SelectionClient from "@/app/selection/selectionClient";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
    title: "Select a club",
    description: "Choose a club from the list"
}

export default async function Selection() {
    const session = await auth()
    if (!session) {
        redirect("/auth")
    }

    return <SelectionClient/>
}
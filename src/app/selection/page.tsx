import {Metadata} from "next";
import SelectionClient from "@/app/selection/selectionClient";

export const metadata: Metadata = {
    title: "Select a club",
    description: "Choose a club from the list"
}

export default function Selection() {
    return <SelectionClient/>
}
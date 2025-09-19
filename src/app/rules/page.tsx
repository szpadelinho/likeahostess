import {Metadata} from "next"
import RulesClient from "@/app/rules/rulesClient";

export const metadata: Metadata = {
    title: "Rules",
    description: "A list of rules"
}

export default function Selection() {
    return <RulesClient/>
}
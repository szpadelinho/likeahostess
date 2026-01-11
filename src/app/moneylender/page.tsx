import {Metadata} from "next";
import {MoneylenderClient} from "./moneylenderClient";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Loan shark",
    description: "Beg for mercy by taking out a loan"
}

export default async function Moneylender() {
    const session = await auth()
    if (!session) {
        redirect("/auth")
    }

    return <MoneylenderClient/>
}
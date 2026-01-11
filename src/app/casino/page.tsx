import {Metadata} from "next";
import CasinoClient from "@/app/casino/CasinoClient";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Casino",
    description: "Gamble your money!"
}

const Casino = async () => {
    const session = await auth()
    if (!session) {
        redirect("/auth")
    }

    return <CasinoClient/>
}

export default Casino
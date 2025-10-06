import {Metadata} from "next";
import CasinoClient from "@/app/casino/CasinoClient";

export const metadata: Metadata = {
    title: "Casino",
    description: "Gamble your money!"
}

const Casino = () => {
    return <CasinoClient/>
}

export default Casino
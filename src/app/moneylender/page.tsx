import {Metadata} from "next";
import {MoneylenderClient} from "./moneylenderClient";

export const metadata: Metadata = {
    title: "Loan shark",
    description: "Beg for mercy by taking out a loan"
}

export default async function Moneylender() {
    return <MoneylenderClient/>
}
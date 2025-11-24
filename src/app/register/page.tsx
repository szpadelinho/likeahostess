import {Metadata} from "next"
import RegisterClient from "@/app/register/registerClient";

export const metadata: Metadata = {
    title: "Register",
    description: "Classic method"
}

export default function Selection() {
    return <RegisterClient/>
}
import {Metadata} from "next"
import LoginClient from "@/app/login/loginClient";

export const metadata: Metadata = {
    title: "Login",
    description: "Classic method"
}

export default function Selection() {
    return <LoginClient/>
}
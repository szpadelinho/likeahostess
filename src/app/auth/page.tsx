'use client'

import {useSession, signIn} from "next-auth/react"
import {Github} from "lucide-react";
import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation"
import {Yesteryear} from "next/font/google"

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

export default function AuthPage() {
    const {data: session} = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/")
        }
    })

    if (!session) {
        return (
            <div className={"w-screen h-screen flex content-center items-center justify-center mask-center"}>
                <div
                    className="relative flex items-center justify-center flex-col bg-white h-80 w-160 shadow-lg shadow-gray-500">
                    <h2 className={`text-5xl border-t-2 pt-6 pb-2 w-80 text-center ${yesteryear.className}`}>Join our
                        club</h2>
                    <h3 className={`text-xl border-b-2 pb-6 w-80 text-center ${yesteryear.className}`}>Enjoy right now,
                        today</h3>
                    <h4 className={`absolute top-4 right-4 border-b-2 ${yesteryear.className}`}>Like a Hostess</h4>
                    <h4 className={"absolute bottom-4 left-4"}><Link
                        className={"text-teal-700 font-bold text-shadow-xl shadow-teal-700 text-[13px] transition duration-200 ease-in-out"}
                        href={"https://github.com/szpadelinho"}>Check out my other projects!</Link></h4>
                    <button
                        className={"absolute bottom-4 right-4 bg-gray-50 p-2 rounded-xl flex justify-between flex-row w-45 cursor-pointer hover:bg-gray-200 transition duration-200 ease-in-out"}
                        onClick={() => signIn('github', {redirectTo: "/selection"})}>
                        <p>Log in with GitHub</p><Github/>
                    </button>
                </div>
            </div>
        )
    }
}
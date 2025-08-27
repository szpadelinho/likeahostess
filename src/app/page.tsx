import {redirect} from 'next/navigation'
import {auth} from "@/lib/auth";
import Navbar from "@/components/navbar";
import Hud from "@/components/hud";

export default async function Home() {
    const session = await auth()

    // if (!session) {
    //     redirect("/auth")
    // }

    return (
        <>
            <Navbar/>
            <Hud/>
        </>
    )
}
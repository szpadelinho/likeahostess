import {Metadata} from "next";
import TutorialClient from "@/app/tutorial/TutorialClient";
import React from "react";
import {auth} from "@/lib/auth";

export const metadata: Metadata = {
    title: "Tutorial",
    description: "Learn how to play the game"
}

export default async function Tutorial() {
    const session = await auth()

    return <TutorialClient isLogged={!!session?.user}/>
}
import {Metadata} from "next";
import TutorialClient from "@/app/tutorial/TutorialClient";
import React from "react";

export const metadata: Metadata = {
    title: "Tutorial",
    description: "Learn how to play the game"
}

export default function Tutorial() {
    return <TutorialClient/>
}
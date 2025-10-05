'use client'

import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import {signOut} from "next-auth/react";
import {LogOut, Volume2, VolumeOff} from "lucide-react";
import Image from "next/image";
import TutorialItem from "@/app/tutorial/TutorialItem";

const Tutorial = () => {
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)

    const [active, setActive] = useState<string | null>(null)
    const [isBookOpen, setIsBookOpen] = useState(false)

    function handleClick(label: string) {
        setActive(label)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    const tutorialItems = [
        { label: "Authentication", left: "left-12", width: "w-[4vw]", rotate: "rotate-12" },
        { label: "Club selection", left: "left-40.5", width: "w-[5.5vw]" },
        { label: "HUD", left: "left-67.5", width: "w-[7vw]" },
        { label: "Game logic", left: "left-102", width: "w-[7vw]" },
        { label: "Inquiries", left: "left-137", width: "w-[7vw]" },
        { label: "Activities", left: "left-171.5", width: "w-[7vw]" },
        { label: "Jams", left: "left-206.5", width: "w-[7vw]" },
        { label: "Profile card", left: "left-241.5", width: "w-[5vw]" },
        { label: "Additional tips", left: "left-273", width: "w-[4vw]", rotate: "-rotate-12" },
    ]

    return(
        <>
            <div className={"flex h-screen w-screen justify-center items-center text-[30px]"}>
                <Image src={"/images/books.png"} alt={"Bookshelf"} fill={true} className="z-49"/>
                <button onClick={() => {
                    signOut({redirectTo: "/auth"})
                }}
                        className={"z-50 absolute top-10 right-10 border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                    <LogOut/>
                </button>
                <button onClick={() => {
                    if(isPlaying){
                        setIsPlaying(false)
                    }
                    else{
                        setIsPlaying(true)
                    }
                }}
                        className={"z-50 absolute top-10 right-25 border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                    {
                        isPlaying ? <Volume2/> : <VolumeOff/>
                    }
                </button>
                <div className={"relative grid grid-cols-9 items-center w-300 gap-4 p-2 whitespace-nowrap z-50 mix-blend-mode-burn mt-3"}>
                    <ReactPlayer
                        src={"https://youtube.com/embed/OR9Xls1S0s4?autoplay=1"}
                        playing={isPlaying}
                        controls={false}
                        autoPlay={true}
                        muted={muted}
                        loop={true}
                        className={"flex absolute top-0 left-0 z-[-1]"}
                        style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
                    />
                    {tutorialItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleClick(item.label)}
                            className={`absolute ${item.left} ${item.rotate ?? ""} flex items-center justify-center text-black h-[35vh] ${item.width} rounded-[15px] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110`}>
                            <h1 className={"-rotate-90"}>{item.label}</h1>
                        </button>
                    ))}
                </div>
            </div>
            {active && <TutorialItem label={active} setActive={setActive}/>}
        </>
    )
}

export default Tutorial
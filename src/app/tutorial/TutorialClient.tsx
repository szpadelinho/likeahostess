'use client'

import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import TutorialItem from "@/app/tutorial/TutorialItem";
import Navbar from "@/components/navbar";
import {useRouter} from "next/navigation";

const Tutorial = () => {
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const [volume, setVolume] = useState<number>(100)

    const [active, setActive] = useState<string | null>(null)

    const router = useRouter()

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
                <Image src={"/images/books.png"} alt={"Bookshelf"} fill={true} className="z-1"/>
                <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Tutorial"} volume={volume} setVolume={setVolume}/>
                <div className={"relative grid grid-cols-9 items-center w-300 gap-4 p-2 whitespace-nowrap z-50 mix-blend-mode-burn mt-3"}>
                    <ReactPlayer
                        src={"https://youtube.com/embed/OR9Xls1S0s4?autoplay=1"}
                        playing={isPlaying}
                        controls={false}
                        autoPlay={true}
                        muted={muted}
                        loop={true}
                        volume={volume / 100}
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
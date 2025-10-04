'use client'

import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import {signOut} from "next-auth/react";
import {LogOut, Volume2, VolumeOff} from "lucide-react";
import Image from "next/image";

const Tutorial = () => {
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    return(
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
                <button className={"absolute left-12 rotate-12 flex items-center justify-center  text-black h-[35vh] w-[4vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out scale-100 active:scale-110"}>
                    <h1 className={"-rotate-90"}>Authentication</h1>
                </button>
                <button className={"absolute left-40.5 flex items-center justify-center text-black h-[35vh] w-[5.5vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>Club selection</h1>
                </button>
                <button className={"absolute left-67.5 flex items-center justify-center text-black h-[35vh] w-[7vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>HUD</h1>
                </button>
                <button className={"absolute left-102 flex items-center justify-center text-black h-[35vh] w-[7vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>Game logic</h1>
                </button>
                <button className={"absolute left-137 flex items-center justify-center text-black h-[35vh] w-[7vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>Icons and notifications</h1>
                </button>
                <button className={"absolute left-171.5 flex items-center justify-center text-black h-[35vh] w-[7vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>Activities</h1>
                </button>
                <button className={"absolute left-206.5 flex items-center justify-center text-black h-[35vh] w-[7vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>Jams</h1>
                </button>
                <button className={"absolute left-241.5 flex items-center justify-center text-black h-[35vh] w-[5vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>Profile card</h1>
                </button>
                <button className={"absolute left-273 -rotate-12 flex items-center justify-center text-black h-[35vh] w-[4vw] rounded-[15] opacity-60 hover:opacity-100 transform duration-500 ease-in-out active:scale-110"}>
                    <h1 className={"-rotate-90"}>Additional tips</h1>
                </button>
            </div>
        </div>
    )
}

export default Tutorial
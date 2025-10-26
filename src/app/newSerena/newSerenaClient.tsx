'use client'

import Image from "next/image";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import ReactPlayer from "react-player";
import {Molle} from "next/font/google";
import Navbar from "@/components/navbar";

const molle = Molle({
    weight: "400",
    subsets: ['latin'],
})

const NewSerenaClient = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(true)
    const [muted, setMuted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    const router = useRouter()
    return(
        <>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"NewSerena"}/>
            <Image src={"/images/new_serena.png"} alt={"New Serena interior"} fill={true} className={"object-cover"}/>
            <div className={`${molle.className} w-screen h-screen flex flex-col items-center justify-center text-[30px]`}>
                <div className={"absolute bottom-5 gap-10 flex flex-col items-center justify-center bg-black/60 border-2 border-white rounded-[5] z-1 p-15"}>
                    <h1 className={"text-white text-[50px]"}>What's the matter, big guy?</h1>
                    <div className={"gap-20 flex flex-row items-center justify-center"}>
                        <button className={"border-white border-2 rounded-[5] w-120 h-15 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white z-1"}>
                            Give me a drink, bartender!
                        </button>
                        <button className={"border-white border-2 rounded-[5] w-120 h-15 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white z-1"}>
                            Buy supply for your club
                        </button>
                    </div>
                </div>
            </div>
            <ReactPlayer
                src={"https://youtube.com/embed/-hlRhz4FHkg?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                loop={true}
                className={"flex absolute top-0 left-0 z-[-1]"}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
        </>
    )
}

export default NewSerenaClient
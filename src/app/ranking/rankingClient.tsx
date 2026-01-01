'use client'

import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useVolume} from "@/app/context/volumeContext";
import {useSession} from "next-auth/react";
import ReactPlayer from "react-player";
import Navbar from "@/components/navbar";
import Image from "next/image";
import LoadingBanner from "@/components/loadingBanner";
import {cookie} from "@/app/types";

const RankingClient = () => {
    const router = useRouter()
    const {data: session} = useSession()
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const {volume, setVolume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if(session){
            setLoading(false)
        }
    }, [session])

    return(
        <>
            <LoadingBanner show={loading}/>
            <div className={"grayscale-100"}>
                <Image src={"/images/paper_card.png"} alt={"Paper card being held"} fill={true}
                       className={"absolute inset-0"}/>
                <div className={"h-screen w-screen flex items-center justify-center z-50 text-black"}>
                    <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Ranking"}/>
                    <h1 className={`z-50 text-[50px] ${cookie.className}`}>
                        Ranking
                    </h1>

                </div>
            </div>
            <ReactPlayer
                src={"https://youtube.com/embed/R0z9WQQyMEw?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                volume={volume / 100}
                className={"flex absolute top-0 left-0 z-[-1]"}
                loop={true}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
        </>
    )
}

export default RankingClient
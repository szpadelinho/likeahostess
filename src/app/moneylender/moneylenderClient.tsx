'use client'

import {LogOut, Volume2, VolumeOff} from "lucide-react";
import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Yesteryear} from "next/font/google";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

export const MoneylenderClient = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [muted, setMuted] = useState(true)
    const [value, setValue] = useState(100000)

    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    return(
        <>
            <Image src={"/images/moneylender.png"} alt={"Mine's office"} fill={true} className={"object-cover"}/>
            <div className={"absolute top-10 right-10 flex items-center justify-center flex-row gap-5 z-50"}>
                <button onClick={() => {setIsPlaying(!isPlaying)}}
                        className={"border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                    {
                        isPlaying ? <Volume2/> : <VolumeOff/>
                    }
                </button>
                <button onClick={() => {
                    router.push("/")
                }}
                        className={"border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                    <LogOut/>
                </button>
            </div>
            <div className={"absolute flex justify-center items-center w-screen h-screen"}>
                <div className={`${yesteryear.className} text-[25px] flex flex-col justify-center items-center bg-cover bg-[url(/images/paper_texture.png)] h-160 w-120`}>
                    <h1 className={"text-[75px]"}>Take out a loan</h1>
                    <p>You are willing to loan out an amount of:</p>
                    <div className={"relative flex flex-row justify-center items-center border-b-2 border-black m-10"}>
                        <p className={"text-[40px]"}>
                            ¥
                        </p>
                        <input required={true} type={"number"} value={value} min={100000} max={999999999} className={"text-[40px] text-center flex justify-center items-center"} onChange={e => {
                            const num = parseInt(e.target.value)
                            if(isNaN(num)) {
                                setValue(100000)
                                return
                            }

                            if(num <= 100000) {
                                setValue(100000)
                            }
                            else if(num >= 999999999){
                                setValue(999999999)
                            }
                            else {
                                setValue(num)
                            }
                        }}/>
                    </div>
                    <p className={"w-95"}>By agreeing to this deal, you understand the importance of fair play rules. You must pay off your debt in time, or else... </p>
                    <p className={"w-95"}>You have seven days to pay off your debt. The count starts by the moment this paper is signed by you.</p>
                    <button className={"border-b-2 border-black w-75 opacity-50"}>
                        Your sign here...
                    </button>
                </div>
            </div>
            <ReactPlayer
                src={"https://youtube.com/embed/FxPDNViVcow?autoplay=1"}
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
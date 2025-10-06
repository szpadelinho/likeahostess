'use client'

import ReactPlayer from "react-player";
import React, {useEffect, useState} from "react";
import {LogOut, Volume2, VolumeOff} from "lucide-react";
import {useRouter} from "next/navigation";
import {Yesteryear} from "next/font/google";
import Image from "next/image";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

const CasinoClient = () => {
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])
    return(
        <div className={"flex flex-col h-screen w-screen items-center justify-center text-white z-50 gap-5"}>
            <Image src={"/images/casino.png"} alt={"Casino interior"} fill={true} className={"absolute inset-0 z-[-1]"}/>
            <button onClick={() => {
                router.push("/")
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
            <ReactPlayer
                src={"https://youtube.com/embed/8mqRTo74g-0?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                loop={true}
                className={"flex absolute top-0 left-0 z-[-1]"}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
            <Image className={"absolute -left-10 top-60"} src={"/images/tanimura_cover.png"} alt={"Masayoshi Tanimura"} height={0} width={400}/>
            <h1 className={`absolute top-20 text-[50px] ${yesteryear.className}`}>What will we play today?</h1>
            <div className={"flex flex-row items-center justify-center gap-10"}>
                <div className={"backdrop-blur-xl gap-10 border-2 border-white flex flex-col items-center justify-center rounded-[15] max-w-[350px] p-5 h-125 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-md hover:shadow-white"}>
                    <h1 className={`text-[40px] ${yesteryear.className}`}>Roulette</h1>
                    <p className={"text-[20px]"}>A classic game. The dealer places a metal ball inside of the roulette, which is rolling through the number spots. The players have multiple possibilities to bet over - number, color, row, odd/even, interval and many others.</p>
                </div>
                <div className={"backdrop-blur-xl gap-10 border-2 border-white flex flex-col items-center justify-center rounded-[15] max-w-[350px] p-5 h-125 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-md hover:shadow-white"}>
                    <h1 className={`text-[40px] ${yesteryear.className}`}>Blackjack</h1>
                    <p className={"text-[20px]"}>A card game. The dealer gives himself two cards - one visible and one hidden. The players however receive two visible cards. The goal for the players is to have a bigger score than the dealer. However, when the score is bigger than 21 - the game is over. If you score a 21, a "Blackjack" is being called.</p>
                </div>
                <div className={"backdrop-blur-xl gap-10 border-2 border-white flex flex-col items-center justify-center rounded-[15] max-w-[350px] p-5 h-125 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-md hover:shadow-white"}>
                    <h1 className={`text-[40px] ${yesteryear.className}`}>Chō-Han</h1>
                    <p className={"text-[20px]"}>Even versus Odd. The dealer is shaking a bamboo bowl, in which two dices are being shaken. In this game, the goal is to predict what the sum of two dices will be. You either call it the sum to be even (chō) or odd (han).</p>
                </div>
            </div>
        </div>
    )
}

export default CasinoClient
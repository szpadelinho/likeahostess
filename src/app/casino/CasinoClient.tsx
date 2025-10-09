'use client'

import ReactPlayer from "react-player";
import React, {useEffect, useState} from "react";
import {BookCopy, JapaneseYen, LogOut, Volume2, VolumeOff} from "lucide-react";
import {useRouter} from "next/navigation";
import {Yesteryear} from "next/font/google";
import Image from "next/image";
import CasinoGame from "@/app/casino/CasinoGame";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

type Club = {
    name: string
    host: {
        name: string
        surname: string
        image: string
    },
    money: number
    popularity: number
    logo: string
}

const CasinoClient = () => {
    const router = useRouter()

    const [club, setClub] = useState<Club>()
    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if (!stored) return

        const clubData = JSON.parse(stored)

        fetch(`/api/user-club?clubId=${clubData.id}`, {method: "POST"})
            .then(async (res) => {
                const data = await res.text()
                if (!res.ok) {
                    console.error("API error:", res.status, data)
                    throw new Error("Failed to fetch club data")
                }
                return JSON.parse(data)
            })
            .then((userData) => {
                const mergedClub: Club = {
                    name: clubData.name,
                    host: clubData.host,
                    logo: clubData.logo,
                    money: userData.money,
                    popularity: userData.popularity,
                }
                setClub(mergedClub)
            })
    }, [])

    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)

    const [game, setGame] = useState<"Roulette" | "Blackjack" | "Poker" | "Chohan" | null>(null)
    const [background, setBackground] = useState("casino")

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])
    return(
        <div className={"flex flex-col h-screen w-screen items-center justify-center text-white z-50 gap-5"}>
            <Image src={`/images/${background}.png`} alt={"Casino interior"} fill={true} className={"absolute inset-0 z-[-1]"}/>
            <button onClick={() => {
                router.push("/")
            }}
                    className={"backdrop-blur-xl z-50 absolute top-10 right-10 border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
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
                    className={"backdrop-blur-xl z-50 absolute top-10 right-25 border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                {
                    isPlaying ? <Volume2/> : <VolumeOff/>
                }
            </button>
            {game && (
                <button onClick={() => {
                    setGame(null)
                    setBackground("casino")
                }}
                        className={"backdrop-blur-xl z-50 absolute top-10 left-10  border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                    <BookCopy/>
                </button>
            )}
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
            {!game ? (
                <>
                    <Image className={"absolute -left-20 top-100"} src={"/images/tanimura_cover.png"} alt={"Masayoshi Tanimura"} height={0} width={350}/>
                    <h1 className={`absolute top-20 text-[50px] ${yesteryear.className}`}>What will we play today?</h1>
                    <div className={"flex flex-row items-center justify-center gap-10"}>
                        <div className={"backdrop-blur-xl gap-10 border-2 border-white flex flex-col items-center justify-center rounded-[15] max-w-[350px] p-5 h-125 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-md hover:shadow-white"}
                             onClick={() => {
                                 if(!game) {
                                     setGame("Roulette")
                                     setBackground("casino_roulette")
                                 }
                                 else {
                                     setGame(null)
                                 }
                             }}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Roulette</h1>
                            <p className={"text-[20px]"}>A classic game. The dealer places a metal ball inside of the roulette, which is rolling through the number spots. The players have multiple possibilities to bet over - number, color, row, odd/even, interval and many others.</p>
                        </div>
                        <div className={"backdrop-blur-xl gap-10 border-2 border-white flex flex-col items-center justify-center rounded-[15] max-w-[350px] p-5 h-125 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-md hover:shadow-white"}
                             onClick={() => {
                                 if(!game) {
                                     setGame("Blackjack")
                                     setBackground("casino_blackjack")
                                 }
                                 else {
                                     setGame(null)
                                 }
                             }}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Blackjack</h1>
                            <p className={"text-[20px]"}>A card game. The dealer gives himself two cards - one visible and one hidden. The players however receive two visible cards. The goal for the players is to have a bigger score than the dealer. However, when the score is bigger than 21 - the game is over. If you score a 21, a "Blackjack" is being called.</p>
                        </div>
                        <div className={"backdrop-blur-xl gap-10 border-2 border-white flex flex-col items-center justify-center rounded-[15] max-w-[350px] p-5 h-125 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-md hover:shadow-white"}
                             onClick={() => {
                                 if(!game) {
                                     setGame("Poker")
                                     setBackground("casino_poker")
                                 }
                                 else {
                                     setGame(null)
                                 }
                             }}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Poker</h1>
                            <p className={"text-[20px]"}>A card game. The players take one card per round. They either bet or pass on the play. The goal is to have the most fitting 5-card hand with the cards on the table. The winner has the strongest hand.</p>
                        </div>
                        <div className={"backdrop-blur-xl gap-10 border-2 border-white flex flex-col items-center justify-center rounded-[15] max-w-[350px] p-5 h-125 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-md hover:shadow-white"}
                             onClick={() => {
                                 if(!game) {
                                     setGame("Chohan")
                                     setBackground("casino_chohan")
                                 }
                                 else {
                                     setGame(null)
                                 }
                             }}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Chō-Han</h1>
                            <p className={"text-[20px]"}>Even versus Odd. The dealer is shaking a bamboo bowl, in which two dices are being shaken. In this game, the goal is to predict what the sum of two dices will be. You either call it the sum to be even (chō) or odd (han).</p>
                        </div>
                    </div>
                </>
            ):(
                club && <CasinoGame game={game} money={club.money}/>
            )}
            {club && game && (
                <div
                    className={`backdrop-blur-md absolute left-5 bottom-5 w-130 h-40 text-center content-center items-center flex flex-row text-[20px] rounded-[20] text-white z-50`}
                    style={{backgroundColor: "rgba(0, 0, 0, .1)"}}>
                    <div className={"backdrop-blur-xl h-[130%] w-[40%] rounded-[20] flex justify-center relative"}
                         style={{backgroundColor: "rgba(0, 0, 0, .1)"}}>
                        <Image
                            className={"flex absolute bottom-[-80%]"}
                            src={club.host.image}
                            alt={"Host"}
                            height={500}
                            width={150}
                        />
                    </div>
                    <div className={"flex flex-row text-center justify-center content-center w-[60%] h-[100%] p-5"}>
                        <div className={"flex flex-col justify-center w-[60%]"}>
                            <h1 className={"text-[22px] font-[700]"}>{club.host.name} {club.host.surname}</h1>
                            <h2 className={"text-[18px] font-[600]"}>{club.name}</h2>
                        </div>
                        <div className={"flex flex-col justify-center w-[40%]"}>
                            <h2 className={"text-[20px] font-[400] flex flex-row justify-center items-center"}>
                                <JapaneseYen/>
                                <p>{club.money}</p>
                            </h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CasinoClient
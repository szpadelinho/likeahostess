'use client'

import ReactPlayer from "react-player";
import React, {useEffect, useState} from "react";
import {JapaneseYen} from "lucide-react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import CasinoGame from "@/app/casino/CasinoGame";
import Navbar from "@/components/navbar";
import {Club, StoredClub, yesteryear} from "../types";
import LoadingBanner from "@/components/loadingBanner";
import {useVolume} from "@/app/context/volumeContext";
import {panels} from "@/lib/casino";

const CasinoClient = () => {
    const router = useRouter()
    const [clubData, setClubData] = useState<StoredClub | null>(null)
    const {volume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)
    const [club, setClub] = useState<Club | null>(null)
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)
    const [game, setGame] = useState<"Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null>(null)
    const [background, setBackground] = useState("casino")
    const [money, setMoney] = useState<number>(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if (!stored) return console.error("Could not find stored club")
        const parsedClub: StoredClub = JSON.parse(stored)
        setClubData(parsedClub)

        fetch(`/api/user-club?clubId=${parsedClub.id}`, {method: "POST"})
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
                    name: parsedClub.name,
                    host: parsedClub.host,
                    logo: parsedClub.logo,
                    money: userData.money,
                    popularity: userData.popularity,
                    supplies: userData.supplies
                }
                setClub(mergedClub)
                setMoney(mergedClub.money)
                setLoading(false)
            })
    }, [])

    return(
        <div className={"flex flex-col h-screen w-screen items-center justify-center text-white z-50 gap-5"}>
            <LoadingBanner show={loading}/>
            <Image src={`/images/${background}.png`} alt={"Casino interior"} fill={true} className={"absolute inset-0 z-[-1]"}/>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} game={game} setGame={setGame} setBackground={setBackground} page={"Casino"}/>
            <ReactPlayer
                src={"https://youtube.com/embed/8mqRTo74g-0?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                loop={true}
                volume={volume / 100}
                className={"flex absolute top-0 left-0 z-[-1]"}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
            {!game ? (
                <>
                    <Image className={"absolute right-1/3 scale-80 top-60"} src={"/images/tanimura_cover.png"} alt={"Masayoshi Tanimura"} height={0} width={150}/>
                    <h1 className={`absolute top-20 text-[75px] ${yesteryear.className}`}>What will we play today?</h1>
                    {panels.map((panel, i) => (
                        <div key={i}
                             className={`absolute ${panel.position} backdrop-blur-sm flex items-center justify-center rounded-[15] w-50 h-20 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-sm hover:shadow-white`}
                             onClick={() => {
                                 if(!game && panel.title !== null) {
                                     setGame(panel.title)
                                     setBackground(`casino_${panel.title.toLowerCase()}`)
                                 }
                                 else {
                                     setGame(null)
                                 }
                             }}>
                            <h1 className={`text-[50px] ${yesteryear.className}`}>{panel.title}</h1>
                        </div>
                    ))}
                </>
            ):(
                club && <CasinoGame game={game} money={club.money} club={club} setMoney={setMoney}/>
            )}
            {club && game && (
                <div
                    className={`backdrop-blur-md absolute ${game !== "Blackjack" && game !== "Poker" ? "left-5 w-130" : "left-15"} bottom-5 h-25 text-center content-center items-center flex flex-row text-[20px] rounded-[20] text-white z-50`}>
                    {game !== "Blackjack" && game !== "Poker" && (
                        <div className={"backdrop-blur-xl h-[130%] w-[30%] rounded-[20] flex justify-center relative"}>
                            <Image
                                className={"flex absolute bottom-[-80%]"}
                                src={club.host.image}
                                alt={"Host"}
                                height={500}
                                width={150}
                            />
                        </div>
                    )}
                    <div className={`${yesteryear.className} flex flex-row text-center justify-center content-center ${game !== "Blackjack" && game !== "Poker" ? "w-[70%]" : "gap-10"} h-[100%] p-5`}>
                        <div className={"flex flex-col justify-center w-[60%]"}>
                            <h1 className={"text-[35px] text-nowrap"}>{club.host.name} {club.host.surname}</h1>
                            <h2 className={"text-[25px]"}>{club.name}</h2>
                        </div>
                        <div className={"flex flex-col justify-center w-[40%]"}>
                            <h2 className={"text-[20px] font-[400] flex flex-row justify-center items-center"}>
                                <JapaneseYen/>
                                <p>{money}</p>
                            </h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CasinoClient
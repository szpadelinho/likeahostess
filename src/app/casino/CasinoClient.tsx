'use client'

import ReactPlayer from "react-player";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import CasinoGame from "@/app/casino/CasinoGame";
import Navbar from "@/components/navbar";
import {Dealer, Dealers, StoredClub, yesteryear} from "../types";
import LoadingBanner from "@/components/loadingBanner";
import {useVolume} from "@/app/context/volumeContext";
import {panels} from "@/lib/casino";

const CasinoClient = () => {
    const router = useRouter()
    const [clubData, setClubData] = useState<StoredClub | null>(null)
    const {volume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)
    const [game, setGame] = useState<"Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null>(null)
    const [background, setBackground] = useState("casino")
    const [money, setMoney] = useState<number>(0)
    const [transition, setTransition] = useState<boolean>(false)
    const [dealer, setDealer] = useState<Dealer | null>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if(Math.random() > 0.1){
            setDealer(Dealers[0])
        }
        else{
            setDealer(Dealers[1])
        }
    }, [])

    useEffect(() => {
        const loadClub = async () => {
            const stored = localStorage.getItem("selectedClub")
            if (!stored) {
                console.error("Could not find stored clubData")
                return
            }

            const parsed = JSON.parse(stored)

            const res = await fetch(`/api/user-club?clubId=${parsed.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json()

            const parsedClub: StoredClub = {
                id: parsed.id,
                name: parsed.name,
                host: parsed.host,
                money: data.money ?? parsed.userClub[0].money,
                popularity: data.popularity ?? parsed.userClub[0].popularity,
                supplies: data.supplies ?? parsed.userClub[0].supplies,
                logo: parsed.logo,
            }

            setMoney(parsedClub.money)
            setClubData(parsedClub)
            setLoading(false)
        }

        loadClub()
    }, [])

    return(
        <div className={"flex flex-col h-screen w-screen items-center justify-center text-white z-50 gap-5"}>
            <LoadingBanner show={loading}/>
            <Image src={`/images/${background}.png`} alt={"Casino interior"} fill={true} className={"absolute inset-0 object-cover z-[-1]"}/>
            <div className={`absolute inset-0 z-50 pointer-events-none ${transition ? "opacity-100" : "opacity-0"} transform ease-in-out duration-300 bg-black`}/>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} game={game} setGame={setGame} setBackground={setBackground} setTransition={setTransition} page={"Casino"}/>
            <ReactPlayer
                src={`https://youtube.com/embed/${dealer && dealer.id === 0 ? "8nOebf6Wcdc" : "0AxwRgmwOsk"}?autoplay=1`}
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
                    {dealer && (
                        <div className="absolute right-1/3 top-70 w-[200px] h-[500px] flex items-center justify-center">
                            <Image
                                src={`/images/${dealer.cover}`}
                                alt={dealer.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <h1 className={`absolute top-20 text-[75px] ${yesteryear.className}`}>What will we play today?</h1>
                    {panels.map((panel, i) => (
                        <div key={i}
                             className={`absolute ${panel.position} backdrop-blur-sm flex items-center justify-center rounded-[15] w-50 h-20 hover:bg-white hover:text-black duration-200 ease-in-out hover:shadow-sm hover:shadow-white`}
                             onClick={() => {
                                 if(!game && panel.title !== null) {
                                     setTransition(true)
                                     setTimeout(() => {
                                         setGame(panel.title)
                                         if(panel.title !== null) setBackground(`casino_${panel.title.toLowerCase()}`)
                                         setTransition(false)
                                     }, 300)
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
                clubData && <CasinoGame game={game} clubData={clubData} setMoney={setMoney} dealer={dealer}/>
            )}
            {clubData && game && (
                <div
                    className={`absolute ${game !== "Blackjack" && game !== "Poker" ? "left-5 w-130 backdrop-blur-md" : "left-15"} bottom-5 h-25 text-center content-center items-center flex flex-row text-[20px] rounded-[20] text-white z-50`}>
                    {game !== "Blackjack" && game !== "Poker" && (
                        <div className={"backdrop-blur-xl h-[130%] w-[30%] rounded-[20] flex justify-center relative"}>
                            <Image
                                className={"flex absolute bottom-[-80%]"}
                                src={clubData.host.image}
                                alt={"Host"}
                                height={500}
                                width={150}
                            />
                        </div>
                    )}
                    <div className={`${yesteryear.className} flex flex-row text-center justify-center content-center ${game !== "Blackjack" && game !== "Poker" ? "w-[70%]" : "gap-10"} h-[100%] p-5`}>
                        <div className={"flex flex-col justify-center w-[60%]"}>
                            <h1 className={"text-[35px] text-nowrap"}>{clubData.host.name} {clubData.host.surname}</h1>
                            <h2 className={"text-[25px]"}>{clubData.name}</h2>
                        </div>
                        <div className={"flex flex-col justify-center w-[40%]"}>
                            <h2 className={"text-[20px] font-[400] flex flex-row justify-center items-center"}>
                                ¥{money}
                            </h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CasinoClient
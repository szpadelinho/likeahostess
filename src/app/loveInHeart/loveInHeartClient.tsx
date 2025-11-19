'use client'

import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import {useRouter} from "next/navigation";
import Navbar from "@/components/navbar";
import {flowerLotus, flowerRose, flowerTulip, flowerStem} from "@lucide/lab";
import {createLucideIcon} from "lucide-react";
import {emilysCandy, HostessMassage} from "../types";
import LoadingBanner from "@/components/loadingBanner";

const FlowerLotus = createLucideIcon("FlowerLotus", flowerLotus)
const FlowerRose = createLucideIcon("FlowerRose", flowerRose)
const FlowerTulip = createLucideIcon("FlowerTulip", flowerTulip)
const FlowerStem = createLucideIcon("FlowerStem", flowerStem)

export const LoveInHeartClient = () => {
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const [volume, setVolume] = useState<number>(100)
    const [loading, setLoading] = useState<boolean>(true)
    const [massage, setMassage] = useState<"Standard" | "Deluxe" | "VIP" | "Super VIP" | null>(null)
    const [mode, setMode] = useState<"Selection" | "Acceptance">("Selection")
    const [fade, setFade] = useState<boolean>(false)
    const [hostesses, setHostesses] = useState<HostessMassage[]>([])
    const [fatigueLevels, setFatigueLevels] = useState<{ [id: string]: number }>({})

    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const fetchHostesses = async () => {
            try {
                const res = await fetch("/api/hostess")
                const data = await res.json()
                const sortedData = data.sort((a: HostessMassage, b: HostessMassage) => Number(a.id) - Number(b.id))
                setHostesses(sortedData)
                const fatigueInit: { [id: string]: number } = {}
                sortedData.forEach((h: HostessMassage) => fatigueInit[h.id] = 70)
                setFatigueLevels(fatigueInit)
                setLoading(false)
            } catch (err) {
                console.log("Failed to fetch hostesses", err)
            }
        }

        fetchHostesses()
    }, [])

    const changeMode = () => {
        setFade(true)
        setTimeout(() => {
            setMode(prev => (prev === "Selection" ? "Acceptance" : "Selection"))
            setFade(false)
        }, 500)
    }


    const massageItems = [
        {
            title: "Normal service",
            Icon: FlowerLotus,
            description: "The most basic massage, mainly to refresh yourself.",
            fatigue: "Decreases the fatigue by 25.",
            onClick: () => setMassage("Standard")
        },
        {
            title: "Deluxe service",
            Icon: FlowerRose,
            description: "A more premium option for those, who look for a more professional and softer service.",
            fatigue: "Decreases the fatigue by 50.",
            onClick: () => setMassage("Deluxe")
        },
        {
            title: "VIP service",
            Icon: FlowerTulip,
            description: "For the lone souls seeking for a more intimate meeting.",
            fatigue: "Decreases the fatigue by 75.",
            onClick: () => setMassage("VIP")
        },
        {
            title: "Super VIP service",
            Icon: FlowerStem,
            description: "Only for the real massage lovers. All cosmetics included.",
            fatigue: "Decreases the fatigue absolutely.",
            onClick: () => setMassage("Super VIP")
        },
    ]

    return(
        <>
            <LoadingBanner show={loading}/>
            <Image src={"/images/love_in_heart.png"} alt={"Love In Heart massage parlor"} fill={true} className={"object-cover"}/>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"LoveInHeart"} mode={mode} changeMode={changeMode} volume={volume} setVolume={setVolume}/>
            <div
                className={`duration-500 ease-in-out transition-all transform ${fade ? "opacity-0" : "opacity-100"}`}>
                <Image src={"/images/saejima_massage.png"} alt={"Taiga Saejima"} height={300} width={250} className={"absolute left-20 bottom-10"}/>
                {mode === "Selection" ? (
                    <div
                        className={`gap-10 h-screen w-screen flex flex-col items-center justify-center text-rose-100 ${emilysCandy.className}`}>
                        <h1 className={"z-10 text-[50px]"}>What will be the service for today?</h1>
                        <div className={"flex flex-col items-center justify-center gap-10"}>
                            {massageItems.map((item, i) => (
                                <button
                                    onClick={() => {
                                        changeMode()
                                        item.onClick()
                                    }}
                                    key={i}
                                    style={{
                                        borderWidth: "8px",
                                        borderStyle: "solid",
                                        borderImageSource: "url('/images/wood_texture2.png')",
                                        borderImageSlice: 30,
                                        borderImageRepeat: "round"
                                    }}
                                    className={"relative bg-[url(/images/wood_texture.png)] hover:text-rose-500 flex items-center justify-center flex-col z-1 h-40 w-200 rounded-[5] duration-300 ease-in-out hover:scale-105 active:scale-110"}>
                                    <h1 className={"text-[30px]"}>
                                        {item.title}
                                    </h1>
                                    <item.Icon size={40} className={"absolute top-3 right-3"}/>
                                    <p className={"text-[25px]"}>
                                        {item.description}
                                    </p>
                                    <p className={"absolute right-2 bottom-2 text-[15px]"}>
                                        {item.fatigue}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`gap-10 h-screen w-screen flex flex-col items-center justify-center text-rose-100 ${emilysCandy.className}`}>
                        <h1 className={"z-10 text-[50px]"}>Do you accept the {massage} terms?</h1>
                        <div
                            style={{
                                borderWidth: "8px",
                                borderStyle: "solid",
                                borderImageSource: "url('/images/wood_texture2.png')",
                                borderImageSlice: 30,
                                borderImageRepeat: "round"
                            }}
                            className={"relative bg-[url(/images/wood_texture.png)] flex items-center justify-center flex-col z-1 p-2 rounded-[5] duration-300 ease-in-out"}>
                            <div className={"grid grid-cols-5 gap-10"}>
                                {hostesses.map((hostess) => {
                                    const current = fatigueLevels[hostess.id] ?? 100
                                    const reduction = massage
                                        ? {
                                            Standard: 25,
                                            Deluxe: 50,
                                            VIP: 75,
                                            "Super VIP": 100,
                                        }[massage]
                                        : 0
                                    const predicted = Math.max(0, current - reduction)

                                    return (
                                        <div
                                            key={hostess.id}
                                            style={{
                                                borderWidth: "8px",
                                                borderStyle: "solid",
                                                borderImageSource: "url('/images/wood_texture2.png')",
                                                borderImageSlice: 30,
                                                borderImageRepeat: "round",
                                            }}
                                            className="bg-[url(/images/wood_texture2.png)] rounded-[5] flex flex-col justify-center items-center text-center gap-2 p-2">
                                            <Image
                                                className="mix-blend-color-burn contrast-[5]"
                                                src={hostess.image}
                                                alt={`${hostess.name} ${hostess.surname} head shot`}
                                                height={60}
                                                width={100}
                                            />
                                            <p>
                                                Fatigue: {current}
                                                {massage && (
                                                    <span className="text-rose-400"> → {predicted}</span>
                                                )}
                                            </p>
                                            <div className="relative w-32 h-3 bg-stone-800 rounded overflow-hidden">
                                                <div
                                                    className="absolute left-0 top-0 h-full bg-rose-900 transition-all duration-700 ease-in-out"
                                                    style={{ width: `${current}%` }}/>

                                                {massage && (
                                                    <div
                                                        className="absolute left-0 top-0 h-full bg-rose-400/80 transition-all duration-700 ease-in-out"
                                                        style={{ width: `${predicted}%` }}/>
                                                )}
                                            </div>

                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                        <button
                            style={{
                                borderWidth: "8px",
                                borderStyle: "solid",
                                borderImageSource: "url('/images/wood_texture2.png')",
                                borderImageSlice: 30,
                                borderImageRepeat: "round"
                            }}
                            className={"bg-[url(/images/wood_texture.png)] text-[30px] flex items-center justify-center flex-col z-1 p-2 rounded-[5] duration-300 ease-in-out hover:scale-110 active:scale-120"}>
                            Pay for the massage
                        </button>
                    </div>
                )}
            </div>
            <ReactPlayer
                src={"https://youtube.com/embed/zm6Z9qBzcz0?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                loop={true}
                volume={volume / 100}
                className={"flex absolute top-0 left-0 z-[-1]"}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
        </>
    )
}
'use client'

import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import {useRouter} from "next/navigation";
import Navbar from "@/components/navbar";
import {flowerLotus, flowerRose, flowerTulip, flowerStem} from "@lucide/lab";
import {createLucideIcon} from "lucide-react";
import {Club, emilysCandy, HostessMassage, StoredClub} from "../types";
import LoadingBanner from "@/components/loadingBanner";
import {useSession} from "next-auth/react";
import {useVolume} from "@/app/context/volumeContext";
import {handleFatigueTransaction, handleMoneyTransaction} from "@/lib/transactions";

const FlowerLotus = createLucideIcon("FlowerLotus", flowerLotus)
const FlowerRose = createLucideIcon("FlowerRose", flowerRose)
const FlowerTulip = createLucideIcon("FlowerTulip", flowerTulip)
const FlowerStem = createLucideIcon("FlowerStem", flowerStem)

export const LoveInHeartClient = () => {
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const {volume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)
    const [massage, setMassage] = useState<"Standard" | "Deluxe" | "VIP" | "Super VIP" | null>(null)
    const [mode, setMode] = useState<"Selection" | "Acceptance">("Selection")
    const [fade, setFade] = useState<boolean>(false)
    const [hostesses, setHostesses] = useState<HostessMassage[]>([])
    const [clubData, setClubData] = useState<Club | null>(null)
    const [money, setMoney] = useState<number>(0)
    const [club, setClub] = useState<Club | null>(null)

    const { data: session } = useSession()

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
                const resHostess = await fetch("/api/hostess")
                const hostessData: HostessMassage[] = await resHostess.json()
                const sortedHostess = hostessData.sort((a: HostessMassage, b: HostessMassage) => Number(a.id) - Number(b.id))

                const resFatigue = await fetch(`/api/user-hostess?userId=${session?.user?.id}`)
                const fatigueData: { hostessId: string, fatigue: number }[] = await resFatigue.json()

                const dataMap: Record<string, number> = {}
                fatigueData.forEach(f => dataMap[f.hostessId] = f.fatigue)

                const merged = sortedHostess.map(h => ({
                    ...h,
                    fatigue: dataMap[h.id]
                }))
                setHostesses(merged)

                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        if (session?.user?.id)
            fetchHostesses()
    }, [session?.user?.id])

    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if(!stored) return console.error("No such element as localStorage on Main")
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
                setMoney(userData.money)
                setClub(mergedClub)
            })
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
            price: 10000,
            onClick: () => setMassage("Standard")
        },
        {
            title: "Deluxe service",
            Icon: FlowerRose,
            description: "A more premium option for those, who look for a more professional and softer service.",
            fatigue: "Decreases the fatigue by 50.",
            price: 25000,
            onClick: () => setMassage("Deluxe")
        },
        {
            title: "VIP service",
            Icon: FlowerTulip,
            description: "For the lone souls seeking for a more intimate meeting.",
            fatigue: "Decreases the fatigue by 75.",
            price: 50000,
            onClick: () => setMassage("VIP")
        },
        {
            title: "Super VIP service",
            Icon: FlowerStem,
            description: "Only for the real massage lovers. All cosmetics included.",
            fatigue: "Decreases the fatigue absolutely.",
            price: 100000,
            onClick: () => setMassage("Super VIP")
        },
    ]

    const reduction = massage
        ? {
            Standard: 25,
            Deluxe: 50,
            VIP: 75,
            "Super VIP": 100,
        }[massage]
        : 0

    const price = massage ? {
        Standard: 10000,
        Deluxe: 25000,
        VIP: 50000,
        "Super VIP": 100000,
    }[massage] : 0

    const allFatigueZero = hostesses.length > 0 && hostesses.every(h => (h.fatigue ?? 0) <= 0)

    return(
        <>
            <LoadingBanner show={loading}/>
            <Image src={"/images/love_in_heart.png"} alt={"Love In Heart massage parlor"} fill={true} className={"object-cover"}/>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"LoveInHeart"} mode={mode} changeMode={changeMode}/>
            <Image src={"/images/saejima_massage.png"} alt={"Taiga Saejima"} height={300} width={250} className={"absolute left-20 bottom-10"}/>
            {club !== null && (
                <div
                    className={`${emilysCandy.className} gap-10 bg-[url(/images/wood_texture.png)] absolute bottom-5 right-5 h-40 p-2 text-center content-center items-center flex flex-row text-[20px] text-white z-50`}
                    style={{
                        borderWidth: "8px",
                        borderStyle: "solid",
                        borderImageSource: "url('/images/wood_texture2.png')",
                        borderImageSlice: 30,
                        borderImageRepeat: "round"
                    }}
                >
                    <Image
                        className={"flex"}
                        src={club.host.image}
                        alt={"Host"}
                        height={500}
                        width={150}
                    />
                    <div className={"flex flex-col justify-center items-center mr-5"}>
                        <h1 className={"text-[25px] text-nowrap text-rose-100"}>{club.host.name} {club.host.surname}</h1>
                        <h2 className={"text-[20px] text-rose-200"}>{club.name}</h2>
                        <h2 className={"text-[30px] text-rose-300 font-[600] flex flex-row justify-center items-center"}>
                            ¥ {money}
                        </h2>
                    </div>
                </div>
            )}
            {allFatigueZero ? (
                <div
                    className={`gap-10 h-screen w-screen flex flex-col items-center justify-center text-rose-100 ${emilysCandy.className}`}>
                    <h1 className={"z-10 text-[50px]"}>Your hostesses are filled with energy!</h1>
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
                                            Juiced!
                                        </p>
                                        <div className="relative w-32 h-3 bg-green-800 rounded overflow-hidden"/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={`duration-500 ease-in-out transition-all transform ${fade ? "opacity-0" : "opacity-100"}`}>
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
                                        <div
                                            className={"absolute -left-5 -top-5 p-2 bg-[url(/images/wood_texture2.png)]"}
                                            style={{
                                                borderWidth: "8px",
                                                borderStyle: "solid",
                                                borderImageSource: "url('/images/wood_texture2.png')",
                                                borderImageSlice: 30,
                                                borderImageRepeat: "round"
                                            }}
                                        >
                                            ¥ {item.price}
                                        </div>
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
                                        const current = hostess.fatigue
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
                                onClick={() => {
                                    handleFatigueTransaction({session, setHostesses, change: reduction}).then()
                                    handleMoneyTransaction({session, clubData, setClub, setMoney, change: price}).then()
                                    changeMode()
                                }}
                                className={"relative bg-[url(/images/wood_texture.png)] text-[30px] flex items-center justify-center flex-col z-1 p-2 rounded-[5] duration-300 ease-in-out hover:scale-110 active:scale-120"}
                            >
                                <div
                                    className={"absolute text-[15px] -right-7 -bottom-7 bg-[url(/images/wood_texture2.png)]"}
                                    style={{
                                        borderWidth: "8px",
                                        borderStyle: "solid",
                                        borderImageSource: "url('/images/wood_texture2.png')",
                                        borderImageSlice: 30,
                                        borderImageRepeat: "round"
                                    }}
                                >
                                    ¥ {price}
                                </div>
                                <p>
                                    Pay for the massage
                                </p>
                            </button>
                        </div>
                    )}
                </div>
            )}
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
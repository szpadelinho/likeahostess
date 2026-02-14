'use client'

import Image from "next/image";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import ReactPlayer from "react-player";
import Navbar from "@/components/navbar";
import {NotebookTabs, Play} from "lucide-react";
import {Club, Drink, drinks, DRINKS_MAP, Effect, molle, newSerenaType, StoredClub} from "@/app/types";
import LoadingBanner from "@/components/loadingBanner";
import {useVolume} from "@/app/context/volumeContext";
import {
    handleEffect,
    handleGameAction,
    handleSupplies,
} from "@/lib/transactions";
import {NewSerena} from "@/app/types";

const NewSerenaClient = () => {
    const [isPlaying, setIsPlaying] = useState<boolean>(true)
    const [muted, setMuted] = useState(false)
    const {volume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)
    const [mode, setMode] = useState<"Selection" | "Drinks" | "Supplies">("Selection")
    const [fade, setFade] = useState<boolean>(false)
    const [fadeDetail, setFadeDetail] = useState<boolean>(false)
    const [drink, setDrink] = useState<Drink | null>(null)
    const [clubData, setClubData] = useState<StoredClub | null>(null)
    const [money, setMoney] = useState<number>(0)
    const [club, setClub] = useState<Club | null>(null)
    const [supplies, setSupplies] = useState<number>(0)
    const [effect, setEffect] = useState<Effect | null>(null)
    const [newSerena, setNewSerena] = useState<NewSerena | null>(null)

    const drinkPosition = (id: number) : string => {
        switch(id){
            case 0:
                return "left-17 bottom-40"
            case 1:
                return "left-140 top-50"
            case 2:
                return "left-60 bottom-42"
            case 3:
                return "left-210 top-50"
            case 4:
                return "right-100 top-50"
            default:
                return ""
        }
    }

    const pointerPosition = (id: number) : string => {
        switch(id){
            case 0:
                return "left-23 bottom-70 rotate-90"
            case 1:
                return "left-146 top-80 -rotate-90"
            case 2:
                return "left-66.5 bottom-70 rotate-90"
            case 3:
                return "left-216 top-80 -rotate-90"
            case 4:
                return "right-106 top-80 -rotate-90"
            default:
                return ""
        }
    }

    const textPosition = (id: number) : string => {
        switch(id){
            case 0:
                return "left-16 bottom-85"
            case 1:
                return "left-139.5 top-95"
            case 2:
                return "left-60 bottom-85"
            case 3:
                return "left-209 top-95"
            case 4:
                return "right-100 top-95"
            default:
                return ""
        }
    }

    useEffect(() => {
        if(Math.random() > 0.1){
            setNewSerena(newSerenaType[0])
        }
        else{
            setNewSerena(newSerenaType[1])
        }
    }, [])

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
                setSupplies(userData.supplies)
                setClub(mergedClub)
            })
    }, [])

    useEffect(() => {
        if(clubData){
            const fetchEffect = async () => {
                try{
                    const res = await fetch(`/api/effect?clubId=${clubData.id}`, {method: "GET"})
                    const data = await res.json()
                    if(data === null) return
                    setEffect(data)
                }
                catch(err){
                    console.log("Failed to fetch effects", err)
                }
            }
            fetchEffect()
        }
    }, [clubData])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if(clubData && newSerena){
            setLoading(false)
        }
    }, [clubData, newSerena])

    const switchMode = (mode: "Selection" | "Drinks" | "Supplies") => {
        setFade(true)
        setTimeout(() => {
            setMode(mode)
            setFade(false)
        }, 300)
    }

    const switchDrink = (drink: Drink | null) => {
        if (drink) {
            setDrink(drink)
            setFadeDetail(true)
            setTimeout(() => {
                setFadeDetail(false)
            }, 50)
        } else {
            setFadeDetail(true)
            setTimeout(() => {
                setDrink(null)
                setFadeDetail(false)
            }, 300)
        }
    }

    const router = useRouter()
    return(
        <>
            <LoadingBanner show={loading}/>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"NewSerena"} mode={mode} switchMode={switchMode}/>
            {newSerena && (
                <>
                    <Image src={mode === "Selection" ? `/images/${newSerena?.selection}.png` : mode === "Drinks" ? `/images/${newSerena?.drinks}.png` : supplies && supplies >= 100 ? `/images/${newSerena?.selection}.png` : `/images/${newSerena?.supplies}.png`} alt={"New Serena interior"} fill={true} className={"object-cover"}/>
                    {club !== null && (
                        <div
                            className={`${molle.className} gap-2 absolute bg-black/60 border-2 border-white rounded-[5] bottom-5 right-5 h-40 p-2 text-center content-center items-center flex flex-row text-[20px] text-white z-1`}>
                            <Image
                                className={"flex"}
                                src={club.host.image}
                                alt={"Host"}
                                height={500}
                                width={100}
                            />
                            <div className={"flex flex-col justify-center items-center mr-5"}>
                                <h1 className={"text-[20px] text-nowrap text-stone-200"}>
                                    {club.host.name} {club.host.surname}
                                </h1>
                                <h2 className={"text-[15px] text-stone-300"}>
                                    {club.name}
                                </h2>
                                <div className={"flex flex-row gap-5 justify-center items-center"}>
                                    <h2 className={"text-[20px] text-stone-500 font-[600] flex flex-row justify-center items-center"}>
                                        ¥ {money}
                                    </h2>
                                    <h2 className={"text-[15px] text-stone-300"}>
                                        {supplies}/100
                                    </h2>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={`${molle.className} ${fade ? "opacity-0" : "opacity-100"} duration-300 ease-in-out w-screen h-screen flex flex-col items-center justify-center text-[30px]`}>
                        {mode === "Selection" && (
                            <div className={"absolute bottom-5 gap-10 flex flex-col items-center justify-center bg-black/60 border-2 border-white rounded-[5] p-15"}>
                                <h1 className={"text-white text-[50px]"}>What is the matter, {club?.host?.surname}?</h1>
                                <div className={"gap-20 flex flex-row items-center justify-center"}>
                                    <button
                                        onClick={() => {switchMode("Drinks")}}
                                        className={"border-white border-2 rounded-[5] w-120 h-15 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white z-1"}>
                                        Give me a drink, bartender!
                                    </button>
                                    <button
                                        onClick={() => {switchMode("Supplies")}}
                                        className={"border-white border-2 rounded-[5] w-120 h-15 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white z-1"}>
                                        Buy supply for your club
                                    </button>
                                </div>
                            </div>
                        )}
                        {mode === "Drinks" && (
                            <>
                                {effect === null ? (
                                    <>
                                        {drinks.map((drink, i) => (
                                            <div key={i}>
                                                <button
                                                    className={`absolute h-25 w-25 ${drinkPosition(i)} flex text-white flex-col items-center justify-center hover:backdrop-blur-sm duration-300 ease-in-out rounded-full p-2`}
                                                    onClick={() => {switchDrink(drink)}}>
                                                </button>
                                                <Play size={50} color={drink.color} fill={drink.color} className={`z-1 absolute ${pointerPosition(i)}`}/>
                                                <p className={`z-1 absolute ${textPosition(i)} text-white text-[20px] max-w-[100px] text-center`}>{drink.title}</p>
                                            </div>
                                        ))}
                                        {drink && (
                                            <div className={"absolute inset-0 flex justify-center items-center"} onClick={() => switchDrink(null)}>
                                                <div className={`absolute ${fadeDetail ? "opacity-0" : "opacity-100"} duration-300 ease-in-out z-10 border-2 border-white gap-10 flex flex-col items-center justify-center h-150 w-300 text-white bg-black/90`}>
                                                    <button
                                                        onClick={() => {switchDrink(null)}}
                                                        className={"absolute -left-5 -top-5 flex text-white flex-col items-center justify-center hover:bg-white hover:text-black duration-300 ease-in-out border-2 border-white rounded-[5] p-2 bg-black/90"}>
                                                        <NotebookTabs size={25}/>
                                                    </button>
                                                    <div className={"flex flex-row gap-5 items-center justify-center text-center m-5"}>
                                                        <div className={"flex flex-col gap-5 items-center justify-center"}>
                                                            <h1 className={"text-[55px] z-1"}>{drink.title}</h1>
                                                            <h2 className={"z-1 text-[30px]"}>{drink.description}</h2>
                                                            <h3 className={"z-1 text-[70px] absolute -right-10 -bottom-15 border-white border-2 rounded-[5] bg-black/90"}>¥{drink.price}</h3>
                                                            <button
                                                                onClick={() => {
                                                                    if(clubData){
                                                                        handleGameAction({type: "EFFECT", status: "ACTIVE"}).then()
                                                                        handleEffect({clubData, effect: DRINKS_MAP[drink.id], setMoney, setClub}).then()
                                                                        switchMode("Selection")
                                                                    }
                                                                }}
                                                                className={"flex text-white flex-col items-center justify-center hover:bg-white hover:text-black duration-300 ease-in-out border-2 border-white rounded-[5] p-2"}>
                                                                Buy the drink
                                                            </button>
                                                        </div>
                                                        <Image src={`/tattoos/${drink.tattoo}.png`} alt={"Tattoo of a respective drink owner"} className={"m-5 opacity-30"} height={250} width={250}/>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className={"absolute bottom-5 gap-10 flex flex-col items-center justify-center bg-black/60 border-2 border-white rounded-[5] p-15"}>
                                        <h1 className={"text-white text-[50px]"}>I think you had enough booze already...</h1>
                                        <div className={"gap-20 flex flex-row items-center justify-center"}>
                                            <button
                                                onClick={() => {switchMode("Selection")}}
                                                className={"border-white border-2 rounded-[5] w-120 h-15 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white z-1"}>
                                                Leave it
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {mode === "Supplies" && supplies !== null && (
                            <>
                                {supplies >= 100 ? (
                                    <div className={"absolute bottom-5 gap-10 flex flex-col items-center justify-center bg-black/60 border-2 border-white rounded-[5] p-15"}>
                                        <h1 className={"text-white text-[50px]"}>Hey, you are already fully supplied!</h1>
                                        <div className={"gap-20 flex flex-row items-center justify-center"}>
                                            <button
                                                onClick={() => {switchMode("Selection")}}
                                                className={"border-white border-2 rounded-[5] w-120 h-15 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white z-1"}>
                                                Oh, did not notice that...
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={"z-1"}>
                                        <div className={"z-1 text-center right-199 absolute bottom-44"}>
                                            <div className={`flex flex-col justify-center items-center gap-2 ${newSerena.name === "Reina" && "mr-2 mb-3 rotate-2"}`}>
                                                <h1 className={"text-[20px]"}>Supply payment</h1>
                                                <h2 className={`text-[10px] ${newSerena.name === "Reina" ? "max-w-40" : "max-w-50"}`}>I am obliged to pay the full price of the product mentioned earlier. I fully understand all the rules and necessities which I must follow. The supplies are automatically my property after signing this contract and paying the price of:</h2>
                                                <h1>¥{(100 - supplies) * 1000}</h1>
                                                <button
                                                    onClick={() => {
                                                        if(clubData) {
                                                            handleGameAction({type: "SUPPLIES", status: "ACTIVE"}).then()
                                                            handleSupplies({clubData, amount: 100 - supplies, setMoney, setSupplies, setClub}).then()
                                                        }
                                                        switchMode("Selection")
                                                    }}
                                                    className={"border-b-2 border-black text-[20px] opacity-50 hover:opacity-100 duration-300 ease-in-out"}>
                                                    Sign here...
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`absolute ${newSerena.name === "Reina" ? "left-100" : "left-110"} bottom-55 text-center rotate-y-[35deg]`}>
                                            <h1 className={"text-[65px]"}>Supplies</h1>
                                            <h2>{100 - supplies}/100</h2>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <ReactPlayer
                        src={`https://youtube.com/embed/${newSerena?.song}?autoplay=1`}
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
            )}
        </>
    )
}

export default NewSerenaClient
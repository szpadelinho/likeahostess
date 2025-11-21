import {ConciergeBell, LampDesk, LogOut, University, Volume, Volume1, Volume2, VolumeX} from "lucide-react";
import React, {useEffect, useState} from "react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {signOut} from "next-auth/react";
import LoadingBanner from "@/components/loadingBanner";

interface NavbarProps {
    router?: AppRouterInstance,
    isPlaying: boolean,
    setIsPlaying: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    game?: "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null,
    setGame?: (value: (((prevState: ("Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) => ("Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) | "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) => void,
    setBackground?: (value: (((prevState: string) => string) | string)) => void,
    page: "Auth" | "Casino" | "Moneylender" | "NewSerena" | "Profile" | "Selection" | "Tutorial" | "LoveInHeart",
    mode?: "Selection" | "Acceptance" | "Drinks" | "Supplies",
    changeMode?: () => void,
    switchMode?: (mode: ("Selection" | "Drinks" | "Supplies")) => void,
    setContract?: (show: boolean) => void,
    paper?: boolean,
    volume: number,
    setVolume: (value: (((prevState: number) => number) | number)) => void,
    setQuit?: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

const Navbar = ({
                    router,
                    isPlaying,
                    setIsPlaying,
                    game,
                    setGame,
                    setBackground,
                    page,
                    mode,
                    changeMode,
                    switchMode,
                    setContract,
                    paper,
                    volume,
                    setVolume,
                    setQuit
                }: NavbarProps) => {
    const [loading, setLoading] = useState<boolean>(false)

    const [showLamp, setShowLamp] = useState(false)
    const [fadeLamp, setFadeLamp] = useState(false)

    useEffect(() => {
        if (paper) {
            setShowLamp(true)
            setTimeout(() => setFadeLamp(false), 50)
        } else {
            setFadeLamp(true)
            setTimeout(() => setShowLamp(false), 50)
        }
    }, [paper])

    const getPageStyle = (page: string): string => {
        switch (page) {
            case "Auth":
                return "border-1 border-white text-white rounded-[10] hover:bg-white hover:text-black"
            case "Casino":
                return "border-1 backdrop-blur-sm text-white rounded-[10] hover:backdrop-blur-xl"
            case "Moneylender":
                return "rounded-[5] bg-[url(/images/paper_texture.png)] bg-center text-stone-700 border-none hover:text-black"
            case "NewSerena":
                return "rounded-[5] border-white text-white bg-black/20 hover:bg-white hover:text-black"
            case "Profile":
                return "rounded-[5] border-stone-400 text-stone-200 hover:bg-stone-200 hover:text-stone-950 hover:border-stone-200"
            case "Selection":
                return "rounded-[10] border-white text-white hover:text-black hover:bg-white"
            case "Tutorial":
                return "rounded-[10] border-white text-white hover:text-black hover:bg-white"
            case "LoveInHeart":
                return "bg-[url(/images/wood_texture.png)] text-rose-100 hover:text-rose-500"
            default:
                return ""
        }
    }

    return (
        <>
            <LoadingBanner show={loading}/>
            <div className={"absolute top-10 right-10 flex items-center justify-center flex-row gap-5 z-[100]"}>
                <div className={`${page === "Auth" && "right-5"} flex justify-center items-center group relative`}>
                    <button
                        className={`${getPageStyle(page)} border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                        style={page === "LoveInHeart" ? {
                            borderWidth: "8px",
                            borderStyle: "solid",
                            borderImageSource: "url('/images/wood_texture2.png')",
                            borderImageSlice: 30,
                            borderImageRepeat: "round"
                        } : {}}
                        onClick={() => {
                            if (volume === 0) {
                                setVolume(100)
                            } else {
                                setVolume(0)
                            }
                        }}>
                        {volume === 0 && <VolumeX/>}
                        {volume > 0 && volume < 34 && <Volume/>}
                        {volume > 33 && volume < 67 && <Volume1/>}
                        {volume > 66 && <Volume2/>}
                    </button>
                    <div
                        className={`absolute ${getPageStyle(page)} hover:opacity-100 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120 pt-2 flex justify-center items-center h-5 -bottom-6 opacity-0 group-hover:opacity-50 group-hover:pointer-events-auto pointer-events-none z-50`}
                        style={page === "LoveInHeart" ? {
                            borderWidth: "8px",
                            borderStyle: "solid",
                            borderImageSource: "url('/images/wood_texture2.png')",
                            borderImageSlice: 30,
                            borderImageRepeat: "round",
                            bottom: -35
                        } : {}}
                    >
                        <input className={"accent-white"} type={"range"} value={volume} min={0} max={100}
                               onChange={(e) => {
                                   setVolume(parseInt(e.target.value))
                               }}/>
                    </div>
                </div>
                {page !== "Auth" && (
                    <button onClick={() => {
                        if(page !== "Tutorial"){
                            setLoading(true)
                        }
                        else{
                            setQuit?.(true)
                        }
                        {
                            page !== "Selection" ? (
                                router?.push("/")
                            ) : (
                                signOut({redirectTo: "/auth"})
                            )
                        }
                    }}
                            className={`${page === "Profile" && "fixed left-10 top-10"} ${getPageStyle(page)} border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                            style={page === "LoveInHeart" ? {
                                borderWidth: "8px",
                                borderStyle: "solid",
                                borderImageSource: "url('/images/wood_texture2.png')",
                                borderImageSlice: 30,
                                borderImageRepeat: "round"
                            } : {}}
                    >
                        <LogOut size={25}/>
                    </button>
                )}
            </div>
            {game && (
                <button onClick={() => {
                    setGame?.(null)
                    setBackground?.("casino")
                }}
                        className={`${getPageStyle(page)} absolute top-10 left-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}>
                    <University size={25}/>
                </button>
            )}
            {mode === "Acceptance" && (
                <button onClick={() => {
                    changeMode?.()
                }}
                        className={`${getPageStyle(page)} z-10 absolute top-10 left-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                        style={page === "LoveInHeart" ? {
                            borderWidth: "8px",
                            borderStyle: "solid",
                            borderImageSource: "url('/images/wood_texture2.png')",
                            borderImageSlice: 30,
                            borderImageRepeat: "round"
                        } : {}}
                >
                    <ConciergeBell size={25}/>
                </button>
            )}
            {(mode === "Drinks" || mode === "Supplies") && (
                <button onClick={() => {
                    switchMode?.("Selection")
                }}
                        className={`${getPageStyle(page)} z-10 absolute top-10 left-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                >
                    <ConciergeBell size={25}/>
                </button>
            )}
            {showLamp && (
                <button onClick={() => {
                    setContract?.(false)
                }}
                        className={`${getPageStyle(page)} ${fadeLamp ? "opacity-0 scale-0" : "opacity-100 scale-100"} z-10 absolute top-10 left-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                >
                    <LampDesk size={25}/>
                </button>
            )}
        </>
    )
}

export default Navbar
import {
    ConciergeBell,
    LampDesk,
    LogOut, Medal, Pen, Play,
    Undo2,
    University,
    Volume,
    Volume1,
    Volume2,
    VolumeX
} from "lucide-react";
import React, {useEffect, useState} from "react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {signOut, useSession} from "next-auth/react";
import LoadingBanner from "@/components/loadingBanner";
import {useVolume} from "@/app/context/volumeContext";
import {getPageStyle, PageType, texturina} from "@/app/types";
import {auth} from "@/lib/auth";
import ChatClient from "@/components/chatClient";

interface NavbarProps {
    router?: AppRouterInstance,
    isPlaying: boolean,
    setIsPlaying: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    game?: "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null,
    setGame?: (value: (((prevState: ("Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) => ("Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) | "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) => void,
    setBackground?: (value: (((prevState: string) => string) | string)) => void,
    page: PageType,
    mode?: "Selection" | "Acceptance" | "Drinks" | "Supplies",
    changeMode?: () => void,
    switchMode?: (mode: ("Selection" | "Drinks" | "Supplies")) => void,
    setContract?: (show: boolean) => void,
    paper?: boolean,
    setQuit?: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    isLogged?: boolean,
    setEdit?: (show: boolean) => void,
    isMe?: boolean
}

const Navbar = ({
                    router,
                    game,
                    setGame,
                    setBackground,
                    page,
                    mode,
                    changeMode,
                    switchMode,
                    setContract,
                    paper,
                    setQuit,
                    isLogged,
                    setEdit,
                    isMe
                }: NavbarProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [showLamp, setShowLamp] = useState(false)
    const [fadeLamp, setFadeLamp] = useState(false)
    const {volume, setVolume} = useVolume()

    useEffect(() => {
        if (paper) {
            setShowLamp(true)
            setTimeout(() => setFadeLamp(false), 50)
        } else {
            setFadeLamp(true)
            setTimeout(() => setShowLamp(false), 50)
        }
    }, [paper])

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
                        if (page === "Tutorial" || page === "Selection") {
                            setQuit?.(true)
                        } else {
                            setLoading(true)
                        }
                        {
                            page !== "Selection" ? (
                                router?.push("/")
                            ) : (
                                signOut({redirectTo: "/auth"})
                            )
                        }
                    }}
                            className={`${(page === "Profile" || page === "Ranking") && "fixed left-10 top-10"} ${getPageStyle(page)} border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
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
            <div className={"absolute top-10 left-10 flex items-center justify-center flex-row gap-5 z-[100]"}>
                {game && (
                    <button onClick={() => {
                        setGame?.(null)
                        setBackground?.("casino")
                    }}
                            className={`${getPageStyle(page)} border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}>
                        <University size={25}/>
                    </button>
                )}
                {mode === "Acceptance" && (
                    <button onClick={() => {
                        changeMode?.()
                    }}
                            className={`${getPageStyle(page)} z-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
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
                            className={`${getPageStyle(page)} z-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                    >
                        <ConciergeBell size={25}/>
                    </button>
                )}
                {showLamp && (
                    <button onClick={() => {
                        setContract?.(false)
                    }}
                            className={`${getPageStyle(page)} ${fadeLamp ? "opacity-0 scale-0" : "opacity-100 scale-100"} z-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                    >
                        <LampDesk size={25}/>
                    </button>
                )}
                {page === "Profile" && (
                    <button onClick={() => {
                        setLoading?.(true)
                        setTimeout(() => {
                            router?.push("/ranking")
                        }, 500)
                    }}
                            className={`${getPageStyle(page)} z-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}>
                        <Medal size={25}/>
                    </button>
                )}
                {(page === "Profile" && isMe) && (
                    <button onClick={() => {
                        setEdit?.(true)
                    }}
                            className={`${getPageStyle(page)} z-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}>
                        <Pen size={25}/>
                    </button>
                )}
                {page === "Ranking" && (
                    <button onClick={() => {
                        setLoading?.(true)
                        setTimeout(() => {
                            router?.push("/profile")
                        }, 500)
                    }}
                            className={`${getPageStyle(page)} z-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}>
                        <Undo2 size={25}/>
                    </button>
                )}
                {page === "Selection" && (
                    <h1 className={`${texturina.className} left-1/2 -translate-x-[50%] z-10 absolute top-10 text-[30px] text-white bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,1)_-200%,_rgba(0,0,0,0)_80%)]`}>
                        Choose the club
                    </h1>
                )}
                {(page === "Tutorial" && isLogged) && (
                    <button
                        onClick={() => {
                            setLoading?.(true)
                            router?.push("/selection")
                        }}
                        className={`flex flex-row justify-center items-center gap-2 ${getPageStyle(page)} left-1/2 -translate-x-[50%] z-10 absolute top-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}>
                        Start
                        <Play size={25}/>
                    </button>
                )}
                <ChatClient page={page} />
            </div>
        </>
    )
}

export default Navbar
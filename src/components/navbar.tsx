import {ConciergeBell, LogOut, University, Volume2, VolumeOff} from "lucide-react";
import React, {useState} from "react";
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
    setMode?: (value: (((prevState: ("Selection" | "Acceptance")) => ("Selection" | "Acceptance")) | "Selection" | "Acceptance")) => void,
    mode?: "Selection" | "Acceptance"
}

const Navbar = ({router, isPlaying, setIsPlaying, game, setGame, setBackground, page, setMode, mode}: NavbarProps) => {
    const [loading, setLoading] = useState<boolean>(false)

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
                <button onClick={() => {
                    setIsPlaying(!isPlaying)
                }}
                        className={`${getPageStyle(page)} border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
                        style={page === "LoveInHeart" ? {
                            borderWidth: "8px",
                            borderStyle: "solid",
                            borderImageSource: "url('/images/wood_texture2.png')",
                            borderImageSlice: 30,
                            borderImageRepeat: "round"
                        } : {}}
                >
                    {
                        isPlaying ? <Volume2 size={25}/> : <VolumeOff size={25}/>
                    }
                </button>
                {page !== "Auth" && (
                    <button onClick={() => {
                        setLoading(true)
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
                    setMode?.("Selection")
                }}
                        className={`${getPageStyle(page)} z-1 absolute top-10 left-10 border-2 p-2 cursor-alias transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-120`}
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
        </>
    )
}

export default Navbar
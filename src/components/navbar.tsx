import {LogOut, University, Volume2, VolumeOff} from "lucide-react";
import React from "react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {signOut} from "next-auth/react";

interface NavbarProps {
    router?: AppRouterInstance,
    isPlaying: boolean,
    setIsPlaying: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    game?: "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null,
    setGame?: (value: (((prevState: ("Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) => ("Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) | "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null)) => void
    setBackground?: (value: (((prevState: string) => string) | string)) => void
    page: "Auth" | "Casino" | "Moneylender" | "NewSerena" | "Profile" | "Selection"  | "Tutorial"
}

const Navbar = ({router, isPlaying, setIsPlaying, game, setGame, setBackground, page}: NavbarProps) => {
    return (
        <>
            <div className={"absolute top-10 right-10 flex items-center justify-center flex-row gap-5 z-10"}>
                <button onClick={() => {
                    setIsPlaying(!isPlaying)
                }}
                        className={"border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                    {
                        isPlaying ? <Volume2/> : <VolumeOff/>
                    }
                </button>
                {page !== "Auth" && (
                    <button onClick={() => {
                        {page !== "Selection" ? (
                            router?.push("/")
                        ) : (
                            signOut({redirectTo: "/auth"})
                        )
                    }}}
                            className={`${page === "Profile" && "fixed left-10 top-10"} border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}>
                        <LogOut/>
                    </button>
                )}
            </div>
            {game && (
                <button onClick={() => {
                    setGame?.(null)
                    setBackground?.("casino")
                }}
                        className={"backdrop-blur-xl z-50 absolute top-10 left-10  border-white border-2 rounded-[10] p-2 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                    <University/>
                </button>
            )}
        </>
    )
}

export default Navbar
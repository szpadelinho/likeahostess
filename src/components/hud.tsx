import {
    HeartHandshake,
    JapaneseYen,
    Menu, Package,
} from "lucide-react";
import Image from "next/image";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {MenuModal} from "@/components/menuModal";
import {Clock} from "@/components/clock";
import {Club, Rank, WindowType, yesteryear} from "@/app/types";
import {XPBar} from "@/components/XPBar";

interface Hud {
    club: Club
    windowType: WindowType | null,
    setWindow: (value: (((prevState: (WindowType | null)) => (WindowType | null)) | WindowType | null)) => void
    setFade: Dispatch<SetStateAction<boolean>>
    money: number
    popularity: number
    experience: number
    supplies: number
    rank: Rank
}


const Hud = ({club, windowType, setWindow, setFade, money, popularity, experience, supplies, rank}: Hud) => {
    const [menu, setMenu] = useState<boolean>(false)
    const [closing, setClosing] = useState<boolean>(false)

    const handleClick = (close?: boolean) => {
        if(menu || close){
            if(windowType){
                setFade(true)
                setTimeout(() => {
                    setWindow(null)
                    setFade(false)
                }, 300)
            }

            setClosing(true)
            setTimeout(() => {
                setMenu(!menu)
                setClosing(false)
            }, 300)
        }
        else{
            if(windowType){
                setFade(true)
                setTimeout(() => {
                    setWindow(null)
                    setFade(false)
                }, 300)
            }

            setClosing(true)
            setTimeout(() => {
                setMenu(!menu)
                setClosing(false)
            }, 0)
        }
    }

    const handleWindow = (window: WindowType | null) => {
        if(menu){
            setClosing(true)
            setTimeout(() => {
                setMenu(false)
                setClosing(false)
            }, 300)
        }

        if (windowType === window || window === null) {
            setFade(true)
            setTimeout(() => {
                setWindow(null)
                setFade(false)
            }, 300)
        }
        else {
            setWindow(window)
        }
    }

    const handleButton = useCallback((e: KeyboardEvent) => {
        switch(e.key){
            case "Escape":
                handleClick()
                break
            case "m":
                handleWindow("Management")
                break
            case "p":
                handleWindow("Activities")
                break
            case "q":
                handleWindow("LogOff")
                break
            case "e":
                handleWindow("NewSerena")
                break
            case "i":
                handleWindow("Profile")
                break
            case "c":
                handleWindow("Casino")
                break
            case "s":
                handleWindow("Selection")
                break
            case "l":
                handleWindow("LoveInHeart")
                break
            case "b":
                handleWindow("Moneylender")
                break

        }
    }, [handleClick, handleWindow])

    useEffect(() => {
        window.addEventListener("keydown", handleButton)
        return () => window.removeEventListener("keydown", handleButton)
    }, [handleButton])

    return (
        <>
            {supplies <= 0 && (
                handleWindow("SupplyAlert")
            )}
            {money <= 0 && (
                handleWindow("MoneyAlert")
            )}
            <div
                className={`flex flex-row justify-between items-end z-10 p-5 w-screen h-70`}>
                <Clock/>
                <button
                    className={`absolute top-5 left-5 h-[50px] w-[50px] bg-pink-950 border-pink-200 border-2 p-3 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[12] text-pink-200 duration-300 ease-in-out hover:bg-pink-200 hover:text-pink-950 hover:scale-110 active:scale-120`}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}
                    onClick={() => {
                        setClosing(true)
                        setTimeout(() => {
                            setMenu(!menu)
                            setClosing(false)
                        }, 0)
                    }}>
                    <Menu size={30}/>
                </button>
                <div
                    className={`text-center items-center flex flex-row text-[20px] rounded-[20] text-pink-200 absolute bottom-5 right-15`}>
                    <div className={"flex flex-col text-center justify-center gap-3"}>
                        <h1 className={`absolute left-78 -top-25 text-nowrap rotate-90 text-[50px] opacity-50 ${yesteryear.className}`}>
                            {club.host.name} {club.host.surname}
                        </h1>
                        <div className={`flex flex-row justify-center items-center gap-3 opacity-50 relative ${yesteryear.className}`}>
                            <Image
                                className={"object-contain absolute left-1/2 -translate-x-[50%] bottom-7.5 z-9"}
                                src={club.logo}
                                alt={"Logo"}
                                height={100}
                                width={150}
                            />
                            <h2 className={"text-[20px] font-[400] flex flex-row justify-center items-center z-10"}>
                                <JapaneseYen/>
                                <p>{money}</p>
                            </h2>
                            <h2 className={"flex flex-row text-[20px] font-[400] justify-center gap-1 items-center z-10"}>
                                <HeartHandshake/>
                                <p>{popularity}</p>
                            </h2>
                            <h2 className={`${supplies <= 20 && "text-red-600"} flex flex-row text-[20px] font-[400] justify-center gap-1 items-center z-10`}>
                                <Package/>
                                <p>{supplies}%</p>
                            </h2>
                        </div>
                        <div className={`flex flex-row justify-center group ${yesteryear.className}`}>
                            <div className={`flex flex-row justify-center items-center gap-10 opacity-50`}>
                                <p className={"ease-in-out duration-300 text-pink-200 hover:text-pink-100 text-[25px]"}>
                                    {rank.rank}
                                </p>
                            </div>
                            <div className={"relative flex justify-center items-center opacity-0 pointer-events-none group-hover:opacity-100 ease-in-out duration-300"}>
                                <XPBar value={experience} rank={rank}/>
                            </div>
                        </div>
                    </div>
                    <div className={"rounded-[20] flex justify-center w-40"}>
                        <Image
                            className={"flex absolute -bottom-50"}
                            src={club.host.image}
                            alt={"Host"}
                            height={500}
                            width={150}
                        />
                    </div>
                </div>
            </div>
            {(menu || closing) && (
                <MenuModal handleClick={handleClick} menu={menu} closing={closing} setWindow={setWindow}/>
            )}
        </>
    )
}

export default Hud
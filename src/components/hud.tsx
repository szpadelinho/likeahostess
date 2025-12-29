import {
    HeartHandshake,
    JapaneseYen,
    Menu, Package,
} from "lucide-react";
import Image from "next/image";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {MenuModal} from "@/components/menuModal";
import {Clock} from "@/components/clock";
import {Club, Effect, Loan, Rank, WindowType, yesteryear} from "@/app/types";
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
    loan: Loan | null
    effect: Effect | null
}


const Hud = ({club, windowType, setWindow, setFade, money, popularity, experience, supplies, rank, loan, effect}: Hud) => {
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

    useEffect(() => {
        if(supplies <= 0) handleWindow("SupplyAlert")
        if(money <= 0) handleWindow("MoneyAlert")
    }, [supplies, money])

    const Countdown = ({ value }: { value: Loan | Effect }) => {
        const [now, setNow] = useState<Date>(new Date())

        useEffect(() => {
            const interval = setInterval(() => {
                setNow(new Date())
            }, 1000)

            return () => clearInterval(interval)
        }, [])

        const final = new Date("dueAt" in value ? value.dueAt : value.expiresAt)
        const diff = final.getTime() - now.getTime()

        const totalSeconds = Math.max(0, Math.floor(diff / 1000))

        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        const pad = (n: number) => n.toString().padStart(2, "0")

        return (
            <h1 className={`${hours === 0 && minutes === 0 && seconds === 0 && "text-pink-400"} z-50`}>
                {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </h1>
        )
    }

    const effectChecker = (effect: Effect) => {
        switch (effect.type) {
            case "DRAGON_OF_DOJIMA":
                return "oryu"
            case "LIFELINE_OF_KAMUROCHO":
                return "phoenix"
            case "DRAGON_OF_KANSAI":
                return "yellow_dragon"
            case "SAFEKEEPER_OF_THE_TOJO_CLAN":
                return "kirin"
            case "FIGHTING_VIPER":
                return "viper"
            default:
                return "spoinkbop"
        }
    }

    return (
        <>
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
                {effect && (
                    <div className={`absolute left-80 bottom-5 flex flex-row gap-5 z-50 text-pink-200 opacity-60 ${yesteryear.className}`}>
                        <Image src={`/tattoos/${effectChecker(effect)}.png`} alt={`${effect.type} picture`} height={75} width={75} className={"object-content mix-blend-color-burn"}/>
                        <div className={"flex flex-col text-center justify-center"}>
                            <Countdown value={effect}/>
                            <p className={"flex text-center items-center justify-center text-[20px]"}>
                                {effect.type.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())}
                            </p>
                        </div>
                    </div>
                )}
                <div
                    className={`text-center items-center flex flex-row text-[20px] rounded-[20] text-pink-200 absolute bottom-5 right-15`}>
                    <div className={"flex flex-col text-center justify-center gap-3"}>
                        <div className={`flex flex-row justify-center items-center gap-3 opacity-50 relative ${yesteryear.className}`}>
                            {loan && (
                                <div className={`absolute -top-30 flex flex-row gap-2 z-50 text-pink-200 ${yesteryear.className}`}>
                                    <Image src={"/images/mine_photo.png"} alt={"Mine picture"} height={50} width={50} className={"absolute left-15 -top-10 mix-blend-color-burn"}/>
                                    <Countdown value={loan}/>
                                    <p className={"flex text-center items-center justify-center"}>
                                        ¥{loan.amount}
                                    </p>
                                </div>
                            )}
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
                            <div className={"absolute flex justify-center items-center opacity-0 pointer-events-none group-hover:opacity-100 ease-in-out duration-300"}>
                                <XPBar value={experience} rank={rank}/>
                            </div>
                        </div>
                    </div>
                    <div className={"relative rounded-[20] flex justify-center w-40"}>
                        <Image
                            className={"flex absolute -bottom-50"}
                            src={club.host.image}
                            alt={"Host"}
                            height={500}
                            width={150}
                        />
                        <h1 className={`absolute right-3 -bottom-10 origin-bottom-right text-nowrap rotate-90 opacity-50 text-[clamp(24px,4vw,50px)] ${yesteryear.className}`}>
                            {club.host.name} {club.host.surname}
                        </h1>
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
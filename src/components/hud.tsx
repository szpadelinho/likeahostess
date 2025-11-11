import {
    HeartHandshake,
    JapaneseYen,
    Menu,
} from "lucide-react";
import Image from "next/image";
import {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {MenuModal} from "@/components/menuModal";
import {Yesteryear} from "next/font/google";
import {Clock} from "@/components/clock";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

type Club = {
    name: string
    host: {
        name: string
        surname: string
        image: string
    },
    money: number
    popularity: number
    logo: string
}

interface Hud {
    club: Club
    windowType: "Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null,
    setWindow: (value: (((prevState: ("Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null)) => ("Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null)) | "Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null)) => void
    setFade: Dispatch<SetStateAction<boolean>>
}


const Hud = ({club, windowType, setWindow, setFade}: Hud) => {
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

    const handleWindow = (window: "Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null) => {
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
            <div
                className={`flex flex-row justify-between items-end z-10 p-5 w-screen h-70`}>
                <Clock/>
                <button
                    className={`absolute top-5 left-5 h-[50px] w-[50px] bg-pink-950 border-pink-200 border-2 p-3 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[12] text-pink-200 duration-300 ease-in-out hover:bg-pink-200 hover:text-pink-950 hover:scale-110 active:scale-120`}
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
                    <div className={"flex flex-col text-center justify-center"}>
                        <h1 className={`absolute left-60 -top-35 text-nowrap rotate-90 text-[50px] opacity-50 ${yesteryear.className}`}>
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
                                <p>{club.money}</p>
                            </h2>
                            <h2 className={"flex flex-row text-[20px] font-[400] justify-center gap-1 items-center z-10"}>
                                <HeartHandshake/>
                                <p>{club.popularity}</p>
                            </h2>
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
import {CircleSmall, GlassWater, JapaneseYen, Minus, Plus} from "lucide-react";
import {StoredClub, yesteryear} from "@/app/types";
import {renderDice} from "@/lib/casino";
import React, {useState} from "react";
import {handleGameAction} from "@/lib/transactions";
import MessageSplash from "@/components/messageSplash";

interface ChohanProps {
    clubData: StoredClub,
    setMoney: (fn: (x: number) => number) => void,
    array: number[],
    setArray: (value: (((prevState: number[]) => number[]) | number[])) => void,
    setPrize: (value: (((prevState: number) => number) | number)) => void,
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void,
    setTotal: (value: (((prevState: number) => number) | number)) => void
}

export const Chohan = ({clubData, setMoney, array, setArray, setPrize, setScore, setTotal}: ChohanProps) => {
    const [bet, setBet] = useState<number>(1000)
    const [isRolling, setIsRolling] = useState<boolean>(false)
    const [message, setMessage] = useState<{ text: string; id: number } | null>(null)

    const showMessage = (text: string) => {
        setMessage({ text, id: Date.now() })
    }

    const handleGame = async (game: "Even" | "Odd") => {
        setIsRolling(true)
        showMessage("No more bets!")

        await handleGameAction({type: "CASINO", status: "ACTIVE"}).then()

        try {
            const res = await fetch("api/casino/chohan", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    clubData,
                    bet,
                    game
                }),
            })

            const data = await res.json()

            setMoney(data.clubData.money)
            setArray(data.array)
            setPrize(data.prize)
            setScore(data.score)
            setTotal(data.total)
        } finally {
            setTimeout(() => {
                setIsRolling(false)
            }, 500)
        }
    }

    return (
        <div className={"flex flex-col justify-center items-center gap-5"}>
            <MessageSplash message={message}/>
            <div className={"flex flex-row justify-center items-center h-160 gap-5"}>
                <GlassWater fill={"white"} size={400}
                            className={`-rotate-180 transition-all duration-200 ${isRolling ?? "shake"}`}/>
                <div className={"flex flex-row justify-center items-center gap-5"}>
                    {array.map((item, i) => (
                        <div
                            key={i}
                            className={"flex justify-center items-center border-2 bg-white rounded-[20px] h-40 w-40"}
                        >
                            {renderDice(item)}
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={"rounded-[10] backdrop-blur-md flex flex-row justify-center items-center gap-5"}>
                <button
                    disabled={isRolling}
                    className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                    onClick={() => {
                        handleGame("Even").then()
                    }}>
                    <p className={"text-[25px]"}>Even</p>
                    <CircleSmall fill={"white"}/>
                </button>
                <button
                    disabled={isRolling}
                    className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                    onClick={() => {
                        setBet(prev => Math.max(prev - 1000, 0))
                    }}>
                    <Minus size={30}/>
                </button>
                <p className={"p-2 rounded-[10] w-25 justify-center items-center text-center flex text-nowrap gap-1"}>
                    <JapaneseYen size={15}/>{bet}
                </p>
                <button
                    disabled={isRolling}
                    className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                    onClick={() => {
                        setBet(prev => Math.min(prev + 1000, 100000))
                    }}>
                    <Plus size={30}/>
                </button>
                <button
                    disabled={isRolling}
                    className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                    onClick={() => {
                        handleGame("Odd").then()
                    }}>
                    <p className={"text-[25px]"}>Odd</p>
                    <CircleSmall/>
                </button>
            </div>
        </div>
    )
}
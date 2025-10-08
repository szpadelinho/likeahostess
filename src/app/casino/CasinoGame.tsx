import React, {useState} from "react";
import {Yesteryear} from "next/font/google";
import {CircleSmall, GlassWater, JapaneseYen, Minus, Plus} from "lucide-react";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

interface CasinoGameProps {
    game: "Roulette" | "Blackjack" | "Poker" | "Chohan" | null,
    money: number
}

const CasinoGame = ({game, money}: CasinoGameProps) => {
    const [score, setScore] = useState<boolean | null>(null)
    const [value, setValue] = useState<string>("")
    const [total, setTotal] = useState<number>(0)
    const [array, setArray] = useState<number[]>([])
    const [bet, setBet] = useState<number>(1000)
    const [prize, setPrize] = useState<number>(0)

    const handleGame = (type: string, value: string) => {
        if (type === "Chohan") {
            let sum = Array(2)
            for (let i = 0; i < 2; i++) {
                sum[i] = Math.floor(Math.random() * (6 - 1)) + 1
            }
            const total = sum.reduce((a, b) => a + b, 0)
            if (total % 2 === 0) {
                if (value === "Even") {
                    handleScore("Chohan", "even", total, sum, true)
                } else {
                    handleScore("Chohan", "even", total, sum, false)
                }
            } else {
                if (value === "Odd") {
                    handleScore("Chohan", "odd", total, sum, true)
                } else {
                    handleScore("Chohan", "odd", total, sum, false)
                }
            }
        }
    }

    const handleScore = (type: string, value: string, total: number, array: Array<number>, won: boolean) => {
        if (type === "Chohan") {
            setValue(value)
            setTotal(total)
            setArray(array)
            setScore(won)
            if(won){
                setPrize(bet * 2)
            }
            else{
                setPrize(bet)
            }
        }
    }

    const handleBet = (type: string, action: "Add" | "Lower") => {
        if (type === "Chohan") {
            setBet(prev => {
                if (action === "Add") {
                    return Math.min(prev + 1000, 10000, money)
                } else {
                    return Math.max(prev - 1000, 1000)
                }
            })
        }
    }


    const renderDice = (value: number) => {
        return (
            <div className={"grid grid-cols-3 grid-rows-3"}>
                {Array.from({length: 9}).map((_, i) => {
                    const positions: Record<number, number[]> = {
                        1: [4],
                        2: [0, 8],
                        3: [0, 4, 8],
                        4: [0, 2, 6, 8],
                        5: [0, 2, 4, 6, 8],
                        6: [0, 2, 3, 5, 6, 8],
                    }
                    return positions[value].includes(i) ? (
                        <CircleSmall key={i} size={50} fill="black"/>
                    ) : (
                        <div key={i}></div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={"flex flex-col justify-center items-center"}>
            {game === "Chohan" && (
                <>
                    <h1 className={`text-[75px] ${yesteryear.className}`}>Chō-Han</h1>
                    <div className={"flex flex-col justify-center items-center gap-5"}>
                        <div className={"flex flex-row justify-center items-center h-140 gap-5"}>
                            <GlassWater fill={"white"} size={400} className={"-rotate-180"}/>
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
                        <h1 className={`${yesteryear.className} text-[30px]`}>Place your bet</h1>
                        <div className={"flex flex-row justify-center items-center gap-5"}>
                            <button
                                className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] border-white border-2 rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                onClick={() => {
                                    handleGame("Chohan", "Even")
                                }}>
                                <p>Even</p>
                                <CircleSmall fill={"white"}/>
                            </button>
                            <button
                                className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] border-white border-2 rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                onClick={() => {
                                    handleGame("Chohan", "Odd")
                                }}>
                                <p>Odd</p>
                                <CircleSmall/>
                            </button>
                        </div>
                        <div className={"rounded-[10] backdrop-blur-md flex flex-row justify-center items-center"}>
                            <button
                                className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                onClick={() => {
                                    handleBet("Chohan", "Lower")
                                }}>
                                <Minus size={30}/>
                            </button>
                            <p className={"p-2 rounded-[10] w-30 justify-center items-center text-center flex text-nowrap gap-2"}>
                                <JapaneseYen size={15}/>{bet}
                            </p>
                            <button
                                className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                onClick={() => {
                                    handleBet("Chohan", "Add")
                                }}>
                                <Plus size={30}/>
                            </button>
                        </div>
                    </div>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} absolute bottom-5 right-5 backdrop-blur-md p-2 h-55 w-120 rounded-[20] text-[40px] flex justify-center items-center flex-col`}>
                            <p>{score ? `You won ${prize}!` : `You lost ${prize}.`}</p>
                            <p>{total ? `The sum  ${total} was ${value}.` : "The draw is rigged."}</p>
                            <p>{array ? `The winning pair was ${array[0]} and ${array[1]}.` : "The draw is rigged."}</p>
                        </h1>
                    )}
                </>
            )}
        </div>
    )
}

export default CasinoGame
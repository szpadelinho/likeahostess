import {Yesteryear} from "next/font/google";
import {Diamond, JapaneseYen, Minus, Plus} from "lucide-react";
import {useState} from "react";
import clsx from "clsx";
import Image from "next/image";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

interface RouletteBoardProps {
    bets: { type: string; amount: number }[],
    handleBet: (type: string, action: ("Add" | "Lower")) => void,
    selectedBet: string | null,
    setSelectedBet: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void
}

export default function RouletteBoard({
                                          bets,
                                          handleBet,
                                          selectedBet,
                                          setSelectedBet
                                      }: RouletteBoardProps) {
    const [hovered, setHovered] = useState<string | null>(null)

    const numbers = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    ]

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    const blackNumbers = numbers.flat().filter((n) => !redNumbers.includes(n))

    const getBetAmount = (type: string) => {
        const bet = bets.find(b => b.type === type)
        return bet ? bet.amount : 0
    }

    const isHighlighted = (num: number): boolean => {
        if (!hovered) return false

        switch (hovered) {
            case "Red":
                return redNumbers.includes(num)
            case "Black":
                return blackNumbers.includes(num)
            case "Even":
                return num % 2 === 0
            case "Odd":
                return num % 2 === 1
            case "1 to 18":
                return num >= 1 && num <= 18
            case "19 to 36":
                return num >= 19 && num <= 36
            case "1st 12":
                return num >= 1 && num <= 12
            case "2nd 12":
                return num >= 13 && num <= 24
            case "3rd 12":
                return num >= 25 && num <= 36
            case "Column 1":
                return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(num)
            case "Column 2":
                return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(num)
            case "Column 3":
                return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(num)
            default:
                return false
        }
    }

    const renderBetControls = (type: string) => {
        const amount = getBetAmount(type)
        return (
            <div
                className={
                    `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-1 rounded-[20] flex flex-row items-center justify-center gap-5 z-[100] ${(type === "Column 1" || type === "Column 2" || type === "Column 3") && "rotate-90"}`
                }
            >
                <div
                    className="p-5 text-white hover:bg-white hover:text-black transition-all duration-200 rounded-[15]"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleBet(type, "Lower")
                    }}
                >
                    <Minus size={20}/>
                </div>
                <div
                    className="flex flex-row items-center gap-1 text-white text-[16px] hover:bg-white hover:text-black transition-all duration-200 p-5 rounded-[15]"
                    onClick={e => {
                        e.stopPropagation()
                        setSelectedBet(null)
                    }}>
                    <JapaneseYen size={16}/> {amount}
                </div>
                <div
                    className="p-5 text-white hover:bg-white hover:text-black transition-all duration-200 rounded-[15]"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleBet(type, "Add")
                    }}
                >
                    <Plus size={20}/>
                </div>
            </div>
        )
    }

    const renderChips = (type: string) => {
        const amount = getBetAmount(type)
        if(amount <= 0) return null

        const getChipSrc = (amount: number): string => {
            switch (amount) {
                case 1000:
                    return "one"
                case 2000:
                    return "two"
                case 3000:
                    return "three"
                case 4000:
                    return "four"
                case 5000:
                    return "five"
                case 6000:
                    return "six"
                case 7000:
                    return "seven"
                case 8000:
                    return "eight"
                case 9000:
                    return "nine"
                case 10000:
                    return "ten"
                default:
                    return ""
            }
        }

        return(
            <div className={`absolute z-50 rounded-full text-[20px] flex justify-center items-center h-15 w-15>`}>
                <Image src={`/chips/${getChipSrc(amount)}.png`} alt={"Chip image"} height={50} width={50}/>
            </div>
        )
    }

    return (
        <div
            className={`grid grid-cols-[80px_repeat(12,60px)_80px] grid-rows-[repeat(5,60px)] text-[35px] ${yesteryear.className}`}>
            <button
                className={"relative flex row-span-3 items-center justify-center border-2 border-white hover:bg-green-950 duration-200 ease-in-out"}
                onClick={() => {
                    setSelectedBet(selectedBet === "0" ? null : "0")
                }}>
                <p className={"-rotate-90"}>0</p>
                {renderChips("0")}
                {selectedBet === "0" && renderBetControls("0")}
            </button>

            {numbers.flat().map((num, i) => {
                const isRed = redNumbers.includes(num)
                const baseColor = isRed ? "bg-red-800" : "bg-black"
                const hoverColor = isRed ? "hover:bg-red-950" : "hover:bg-stone-700"
                const hoverGroupColor = clsx(
                    isRed ? "bg-red-950" : "bg-stone-700",
                    "!border-purple-950"
                )
                const selected = selectedBet === num.toString()

                return (
                    <button
                        key={i}
                        className={`relative flex items-center justify-center border-2 border-white duration-200 ease-in-out ${baseColor} ${hoverColor} ${
                            isHighlighted(num) ? hoverGroupColor : ""
                        }`}
                        onClick={() => {
                            setSelectedBet(selected ? null : num.toString())
                        }}>
                        <p className={"-rotate-90"}>{num}</p>
                        {renderChips(num.toString())}
                        {selected && renderBetControls(num.toString())}
                    </button>
                )
            })}

            {[...Array(3)].map((_, i) => {
                const row = 3 - i
                const columnLabel = `Column ${i + 1}`
                const selected = selectedBet === columnLabel
                return (
                    <button
                        key={columnLabel}
                        onClick={() => {
                            setSelectedBet(selected ? null : columnLabel)
                        }}
                        onMouseEnter={() => setHovered(columnLabel)}
                        onMouseLeave={() => setHovered(null)}
                        className={`relative border-2 border-white col-start-14 row-start-${row} flex items-center justify-center w-[60px] h-[60px] -rotate-90 text-[20px] hover:bg-green-950 duration-200 ease-in-out`}
                    >
                        2 to 1
                        {renderChips(columnLabel)}
                        {selected && renderBetControls(columnLabel)}
                    </button>
                )
            })}

            {["1st 12", "2nd 12", "3rd 12"].map((label, i) => {
                const selected = selectedBet === label

                return (
                    <button
                        key={label}
                        onClick={() => {
                            setSelectedBet(selected ? null : label)
                        }}
                        onMouseEnter={() => setHovered(label)}
                        onMouseLeave={() => setHovered(null)}
                        className={`relative border-2 border-white col-start-${2 + i * 4} row-start-4 col-span-4 flex items-center justify-center hover:bg-green-950 duration-200 ease-in-out`}
                    >
                        {label}
                        {renderChips(label)}
                        {selected && renderBetControls(label)}
                    </button>
                )
            })}

            {[
                "1 to 18",
                "Even",
                "Red",
                "Black",
                "Odd",
                "19 to 36",
            ].map((label, i) => {
                const selected = selectedBet === label
                return (
                    <button
                        key={label}
                        onClick={() => {
                            setSelectedBet(selected ? null : label)
                        }}
                        onMouseEnter={() => setHovered(label)}
                        onMouseLeave={() => setHovered(null)}
                        className={`relative border-2 border-white row-start-5 col-span-2 flex items-center justify-center hover:bg-green-950 duration-200 ease-in-out ${
                            label === "Red"
                                ? "col-start-6"
                                : label === "Black"
                                    ? "col-start-8"
                                    : label === "Odd"
                                        ? "col-start-10"
                                        : label === "19 to 36"
                                            ? "col-start-12"
                                            : `col-start-${2 + i * 2}`
                        }`}
                    >
                        {label === "Red" ? (
                            <Diamond fill="red" size={40}/>
                        ) : label === "Black" ? (
                            <Diamond fill="black" size={40}/>
                        ) : (
                            label
                        )}
                        {renderChips(label)}
                        {selected && renderBetControls(label)}
                    </button>
                )
            })}
        </div>
    )
}
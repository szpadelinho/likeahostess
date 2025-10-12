import {Yesteryear} from "next/font/google";
import {Diamond} from "lucide-react";
import {useState} from "react";
import clsx from "clsx";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

export default function RouletteBoard(){
    const [hovered, setHovered] = useState<string | null>(null)

    const numbers = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    ]

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    const blackNumbers = numbers.flat().filter((n) => !redNumbers.includes(n))

    const isHighlighted = (num: number) : boolean => {
        if(!hovered) return false

        switch(hovered){
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
    return(
        <div className={`grid grid-cols-[80px_repeat(12,60px)_80px] grid-rows-[repeat(5,60px)] text-[35px] ${yesteryear.className}`}>
            <button className={"flex row-span-3 items-center justify-center border-2 border-white hover:bg-green-950 duration-200 ease-in-out"}>
                <p className={"-rotate-90"}>0</p>
            </button>

            {numbers.flat().map((num, i) => {
                const isRed = redNumbers.includes(num)
                const baseColor = isRed ? "bg-red-800" : "bg-black"
                const hoverColor = isRed ? "hover:bg-red-950" : "hover:bg-stone-700"
                const hoverGroupColor = clsx(
                    isRed ? "bg-red-950": "bg-stone-700",
                    "!border-purple-950"
                )

                return(
                    <button key={i}  className={`flex items-center justify-center border-2 border-white duration-200 ease-in-out ${baseColor} ${hoverColor} ${
                        isHighlighted(num) ? hoverGroupColor : ""
                    }`}>
                        <p className={"-rotate-90"}>{num}</p>
                    </button>
                )
            })}

            {[...Array(3)].map((_, i) => {
                const row = 3 - i
                const columnLabel = `Column ${i + 1}`

                return (
                    <button
                        key={`col-${i}`}
                        onMouseEnter={() => setHovered(columnLabel)}
                        onMouseLeave={() => setHovered(null)}
                        className={`border-2 border-white col-start-14 row-start-${row} flex items-center justify-center w-[60px] h-[60px] -rotate-90 text-[20px] hover:bg-green-950 duration-200 ease-in-out`}
                    >
                        2 to 1
                    </button>
                )
            })}

            {["1st 12", "2nd 12", "3rd 12"].map((label, i) => (
                <button
                    key={label}
                    onMouseEnter={() => setHovered(label)}
                    onMouseLeave={() => setHovered(null)}
                    className={`border-2 border-white col-start-${2 + i * 4} row-start-4 col-span-4 flex items-center justify-center hover:bg-green-950 duration-200 ease-in-out`}
                >
                    {label}
                </button>
            ))}

            {[
                "1 to 18",
                "Even",
                "Red",
                "Black",
                "Odd",
                "19 to 36",
            ].map((label, i) => (
                <button
                    key={label}
                    onMouseEnter={() => setHovered(label)}
                    onMouseLeave={() => setHovered(null)}
                    className={`border-2 border-white row-start-5 col-span-2 flex items-center justify-center hover:bg-green-950 duration-200 ease-in-out ${
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
                        <Diamond fill="red" size={40} />
                    ) : label === "Black" ? (
                        <Diamond fill="black" size={40} />
                    ) : (
                        label
                    )}
                </button>
            ))}
        </div>
    )
}
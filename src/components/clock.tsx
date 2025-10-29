import {useEffect, useState} from "react";
import {Bitcount_Grid_Single, Yesteryear} from "next/font/google";
import {flowerStem} from "@lucide/lab";
import {createLucideIcon, Leaf, Snowflake, Sun} from "lucide-react";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

const bitcountGridSingle = Bitcount_Grid_Single({
    weight: "400",
    subsets: ['latin'],
})

export const Clock = () => {
    const [analog, setAnalog] = useState(new Date())
    const [digital, setDigital] = useState("")
    const [day, setDay] = useState("")
    const [type, setType] = useState<boolean>(true)
    const [semicolon, setSemicolon] = useState<":" | " ">(":")

    const FlowerStem = createLucideIcon("FlowerStem", flowerStem)

    useEffect(() => {
        const timer = setInterval(() => {
            setAnalog(new Date())
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            setDay(days[analog.getDay()])

            setSemicolon(prev => (prev === ":" ? " " : ":"))

            const hours = analog.getHours().toString().padStart(2, "0")
            const minutes = analog.getMinutes().toString().padStart(2, "0")
            setDigital(`${hours}${semicolon}${minutes}`)
        }, 1000)

        return () => clearInterval(timer)
    }, [semicolon])

    const getSeason = (date: Date) => {
        const month = date.getMonth()
        const day = date.getDate()

        if ((month === 2 && day >= 21) || (month > 2 && month < 5) || (month === 5 && day < 22)) {
            return <FlowerStem size={20}/>
        } else if ((month === 5 && day >= 22) || (month > 5 && month < 8) || (month === 8 && day < 23)) {
            return <Sun size={20}/>
        } else if ((month === 8 && day >= 23) || (month > 8 && month < 11) || (month === 11 && day < 22)) {
            return <Leaf size={20}/>
        } else {
            return <Snowflake size={20}/>
        }
    }

    const seconds = analog.getSeconds()
    const minutes = analog.getMinutes()
    const hours = analog.getHours()

    const secondsDeg = seconds * 6
    const minutesDeg = minutes * 6 + seconds * 0.1
    const hoursDeg = hours * 30 + minutes * 0.5

    return(
        <div className={`absolute ${type ? "top-5" : "top-7.5"} active:scale-110 hover:scale-105 left-1/2 -translate-x-[50%] flex items-center justify-center text-pink-200 transition duration-200 ease-in-out`} onClick={() => setType(!type)}>
            {type ? (
                    <div
                        className={"relative h-20 w-20 rounded-[15] flex bg-pink-950 gap-5 active:bg-pink-900 hover:bg-pink-800 justify-center items-center flex-row border-pink-200 border-2 p-2 transition duration-200 ease-in-out"}>
                        <div className={"relative flex items-center justify-center absolute -top-7.5"}>
                            <div
                                className={"absolute w-[4px] -top-0.5 h-8 bg-pink-300 origin-bottom rounded-full z-1"}
                                style={{transform: `rotate(${hoursDeg}deg)`}}
                            />
                            <div
                                className={"absolute w-[4px] -top-2.5 h-10 bg-pink-400 origin-bottom rounded-full z-2"}
                                style={{transform: `rotate(${minutesDeg}deg)`}}
                            />
                            <div
                                className={"absolute w-[2px] h-10 -top-2.5 bg-pink-600 origin-bottom rounded-full z-3"}
                                style={{transform: `rotate(${secondsDeg}deg)`}}
                            />
                        </div>

                        <div className={`${yesteryear.className} text-[20px] absolute right-5 top-4.5 flex items-center justify-center`}>
                            {day[0]}
                        </div>

                        <div className={"absolute bottom-4.5 left-4"}>
                            {getSeason(analog)}
                        </div>

                        <div className={"absolute w-1.5 h-1.5 bg-pink-200 rounded-full"}/>

                        <div className={"absolute top-0 left-5 -rotate-30 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute top-0 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute top-0 right-5 rotate-30 w-[2px] h-4 bg-pink-200 rounded-full"}/>

                        <div className={"absolute top-3 right-1.5 rotate-60 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute top-0 top-8 right-1.5 rotate-90 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute bottom-3 right-1.5 -rotate-60 w-[2px] h-4 bg-pink-200 rounded-full"}/>

                        <div className={"absolute bottom-0 left-5 rotate-30 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute bottom-0 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute bottom-0 right-5 -rotate-30 w-[2px] h-4 bg-pink-200 rounded-full"}/>

                        <div className={"absolute top-3 left-1.5 -rotate-60 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute top-0 top-8 left-1.5 rotate-90 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                        <div className={"absolute bottom-3 left-1.5 rotate-60 w-[2px] h-4 bg-pink-200 rounded-full"}/>
                    </div>
            ) : (
                <div className={`${bitcountGridSingle.className} flex bg-pink-950 gap-5 active:bg-pink-900 hover:bg-pink-800 justify-center items-center flex-row border-pink-200 border-2 rounded-[15] p-2 transition duration-200 ease-in-out`}>
                    <p className={"text-[20px] flex justify-center items-center"}>
                        {digital}
                    </p>
                    <p className={"flex justify-center items-center"}>
                        {getSeason(analog)}
                    </p>
                    <p className={"flex justify-center items-center"}>
                        {day}
                    </p>
                </div>
            )}
        </div>
    )
}
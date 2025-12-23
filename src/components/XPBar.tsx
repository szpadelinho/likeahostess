import {Badge} from "lucide-react";
import {Rank} from "@/app/types";

interface XPBarProps{
    value: number,
    rank: Rank
}

export const XPBar = ({value, rank}: XPBarProps) => {
    const level = Math.floor(value / 1000)
    const current = value % 1000
    const percent = Math.min(100, (current / 1000) * 100)

    return(
        <div className={"absolute -top-0.5 h-10 flex flex-row gap-5 justify-center items-center"}>
            <div
                className={`h-full transition-all duration-100 ease-linear bg-pink-600/40 rounded-[20] text-[15px] justify-center items-center flex`}
                style={{width: 200}}>
                <div
                    className={"absolute left-0 h-full bg-pink-600 transition-all duration-300 rounded-[20]"}
                    style={{
                        width: `${percent}%`
                    }}
                />
                <p className={"absolute w-full text-center text-white text-[15px] font-semibold"}>
                    {value}/1000
                </p>
            </div>
            <div className={"flex flex-col justify-center items-center text-center opacity-50"}>
                <p className={"text-[15px]"}>
                    {level}
                </p>
                <Badge size={40} className={"absolute"}/>
            </div>
        </div>
    )
}
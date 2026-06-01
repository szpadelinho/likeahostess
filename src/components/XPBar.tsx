import {Badge} from "lucide-react";
import {Rank} from "@/app/types";

interface XPBarProps{
    value: number,
    rank: Rank
}

export const XPBar = ({value}: XPBarProps) => {
    const level = Math.floor(value / 1000)
    const current = value % 1000
    const percent = Math.min(100, (current / 1000) * 100)

    return(
        <div className={"absolute -top-0.5 h-10 flex flex-row gap-5 justify-center items-center"}>
            <div
                className="relative h-full w-[200px] bg-pink-600/40 rounded-full overflow-hidden"
            >
                <div
                    className="absolute left-0 top-0 h-full bg-pink-600 transition-all duration-300"
                    style={{
                        width: `${percent}%`,
                    }}
                />

                <p className="relative z-10 h-full flex items-center justify-center text-white text-[15px] font-semibold">
                    {current}/1000
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
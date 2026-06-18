import {Hostess} from "@/app/types";
import {Droplet, Flame, PlugZap, Snowflake, Zap} from "lucide-react";

interface FatigueBarProps {
    hostess: Hostess | null,
    source: "panel" | "table"
}

export const FatigueBar = ({hostess, source}: FatigueBarProps) => {
    if (!hostess) return
    const current = hostess.fatigue % 100
    const percent = Math.min(100, (current / 100) * 100)

    return (
        source === "panel" ? (
            <div className={"absolute -top-5 h-5 flex flex-row gap-5 justify-center items-center"}>
                <div
                    className="relative h-full w-[100px] bg-pink-950/40 border-pink-200 border-1 rounded-lg overflow-hidden"
                >
                    <div
                        className="absolute left-0 top-0 h-full bg-linear-to-r from-rose-500 to-pink-800 transition-all duration-300"
                        style={{
                            width: `${percent}%`,
                        }}
                    />
                    <p className="relative z-10 h-full flex items-center justify-center font-semibold">
                        {hostess.fatigue < 10 ? <Zap size={16}/>
                            : hostess.fatigue >= 11 && hostess.fatigue < 25 ? <Flame size={16}/>
                                : hostess.fatigue >= 26 && hostess.fatigue < 50 ? <Droplet size={16}/>
                                    : hostess.fatigue >= 50 && hostess.fatigue < 75 ? <Snowflake size={16}/>
                                        : hostess.fatigue && <PlugZap size={16}/>}
                    </p>
                </div>
            </div>
        ) : (
            <div className={"absolute -left-5 w-5 flex flex-row gap-5 justify-center items-center"}>
                <div
                    className="relative h-[100px] w-full bg-pink-950/40 border-pink-200 border-1 rounded-lg overflow-hidden"
                >
                    <div
                        className="absolute bottom-0 w-full bg-linear-to-t from-rose-400 via-indigo-400 to-red-400 transition-all duration-300"
                        style={{
                            height: `${percent}%`,
                        }}
                    />
                    <p className="relative z-10 h-full flex items-center justify-center text-[15px] font-semibold">
                        {hostess.fatigue < 10 ? <Zap size={20}/>
                            : hostess.fatigue >= 11 && hostess.fatigue < 25 ? <Flame size={20}/>
                                : hostess.fatigue >= 26 && hostess.fatigue < 50 ? <Droplet size={20}/>
                                    : hostess.fatigue >= 50 && hostess.fatigue < 75 ? <Snowflake size={20}/>
                                        : hostess.fatigue && <PlugZap size={20}/>}
                    </p>
                </div>
            </div>
        )
    )
}
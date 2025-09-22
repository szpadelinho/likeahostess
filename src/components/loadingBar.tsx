import React, {useEffect, useState} from "react";
import {Hourglass} from "lucide-react";

interface Props {
    duration: number
    onComplete?: () => void
    paused: boolean
}

const LoadingBar = ({duration, onComplete, paused} : Props) => {
    const [progress, setProgress] = useState<number>(0)

    useEffect(() => {
        if (paused) return
        setProgress(0)
        const interval = 50
        const step = 100 / (duration / interval)

        const timer = setInterval(() => {
            setProgress(prev => {
                if(prev + step >= 100){
                    clearInterval(timer)
                    if(onComplete) onComplete()
                    return 100
                }
                return prev + step
            })
        }, interval)
        return () => clearInterval(timer)
    }, [duration, paused])

    return(
        <div className={`flex border-2 rounded-md h-4 w-[120px] overflow-hidden ${paused ? "border-pink-300" : "border-white"}`}>
            <div
                className={`h-full transition-all duration-100 ease-linear z-50 ${paused ? "bg-[repeating-linear-gradient(135deg,#fff_0px,#fff_6px,#111_6px,#111_12px)]" : "bg-pink-600"}`}
                style={{width: `${progress}%`}}
            >
                {paused ? (
                    <div className={"absolute left-[37%] -top-[40%] border-2 rounded-[8] p-1 bg-pink-300 text-pink-900"}>
                        <Hourglass size={20}/>
                    </div>
                ) : ""}
            </div>
        </div>
    )
}

export default LoadingBar
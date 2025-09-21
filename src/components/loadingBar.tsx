import React, {useEffect, useState} from "react";

interface Props {
    duration: number
    onComplete?: () => void
}

const LoadingBar = ({duration, onComplete} : Props) => {
    const [progress, setProgress] = useState<number>(0)

    useEffect(() => {
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
    }, [duration])

    return(
        <div className={"flex border-2 border-white rounded-md h-4 w-[120px] overflow-hidden"}>
            <div
                className={"h-full bg-pink-600 transition-all duration-100 ease-linear"}
                style={{width: `${progress}%`}}
            />
        </div>
    )
}

export default LoadingBar
import React, {useEffect, useRef, useState} from "react"
import { bitcountGridDouble } from "@/app/types"

interface MessageSplashProps {
    message: { text: string; id: number } | null
}

const MessageSplash = ({ message }: MessageSplashProps) => {
    const [phase, setPhase] = useState<"in" | "out" | "hidden">("hidden")
    const objectiveRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (!message) return

        objectiveRef.current = new Audio("/sfx/objective.mp3")
        objectiveRef.current.play().catch()

        setPhase("in")

        const visibleTimer = setTimeout(() => {
            setPhase("out")
        }, 1500)

        const hideTimer = setTimeout(() => {
            setPhase("hidden")
        }, 1800)

        return () => {
            clearTimeout(visibleTimer)
            clearTimeout(hideTimer)
        }
    }, [message?.id])

    if (!message || phase === "hidden") return null

    return (
        <>
            <div className={`absolute inset-0 z-50 flex items-center justify-center pointer-events-none ${phase === "in" ? "splash-in" : ""} ${phase === "out" ? "splash-out" : ""}`}>
                <h1 className={`${bitcountGridDouble.className} text-[125px] z-1 [mask-image:linear-gradient(to_top,transparent,black)] [-webkit-mask-image:linear-gradient(to_top,transparent,black)]`}>
                    {message.text}
                </h1>
            </div>
            <div className={`${phase === "in" ? "fade-in" : ""} ${phase === "out" ? "fade-out" : ""} inset-0 absolute z-49 bg-gradient-to-b from-transparent to-black/75`}/>
        </>
    )
}

export default MessageSplash
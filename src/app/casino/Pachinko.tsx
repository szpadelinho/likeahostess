import Image from "next/image";
import {useCallback, useEffect, useRef, useState} from "react";
import {elements, getIcon} from "@/lib/casino";

interface PachinkoProps {
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void,
    onTransaction: (type: "jackpot" | "pair" | "lose" | "start") => Promise<void>
}

export const Pachinko = ({setScore, onTransaction}: PachinkoProps) => {
    const [slots, setSlots] = useState([0, 0, 0])
    const [spinning, setSpinning] = useState([false, false, false])

    const loopRef = useRef<HTMLAudioElement | null>(null)
    const stopRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        loopRef.current = new Audio("/sfx/slot_loop.m4a")
        loopRef.current.loop = true
        loopRef.current.volume = 1

        stopRef.current = new Audio("/sfx/slot_stop.m4a")
        stopRef.current.volume = 1

        return () => {
            loopRef.current?.pause()
            loopRef.current = null
            stopRef.current = null
        }
    }, [])

    const startGame = () => {
        onTransaction("start").then()
        setScore(null)
        setSpinning([true, true, true])

        const loop = loopRef.current
        if (loop && loop.paused) {
            loop.currentTime = 0
            loop.play().catch(() => {
            })
        }
    }

    const toggleHold = (index: number) => {
        if (spinning[index]) {
            const stop = stopRef.current
            if (stop) {
                stop.currentTime = 0
                stop.play().catch(() => {
                })
            }
        }
        setSpinning(prev => {
            return prev.map((val, i) => index === i ? false : val)
        })
    }

    const handleButton = useCallback((e: KeyboardEvent) => {
        if (e.code === "Space") {
            e.preventDefault()
            if (spinning.every(s => s)) {
                toggleHold(0)
            } else if (!spinning[0] && spinning[1] && spinning[2]) {
                toggleHold(1)
            } else if (!spinning[0] && !spinning[1] && spinning[2]) {
                toggleHold(2)
            } else {
                startGame()
            }
        }
    }, [spinning, slots, startGame, toggleHold])

    useEffect(() => {
        window.addEventListener("keydown", handleButton)
        return () => {
            window.removeEventListener("keydown", handleButton)
        }
    }, [handleButton])

    useEffect(() => {
        const intervals: NodeJS.Timeout[] = []

        spinning.forEach((isSpinning, i) => {
            if (isSpinning) {
                const interval = setInterval(() => {
                    setSlots(prev =>
                        prev.map((val, index) =>
                            index === i ? Math.floor(Math.random() * elements.length) : val
                        ))
                }, 50)
                intervals.push(interval)
            }
        })

        return () => {
            intervals.forEach(clearInterval)
        }
    }, [spinning, elements.length])

    const prevSpinningRef = useRef(spinning)

    useEffect(() => {
        const loop = loopRef.current

        const prev = prevSpinningRef.current
        prevSpinningRef.current = spinning

        const wasSpinning = prev.some(s => s)
        const isSpinning = spinning.some(s => s)

        if (isSpinning && loop && loop.paused) {
            loop.currentTime = 0
            loop.play().catch(() => {
            })
        }

        if (!isSpinning && wasSpinning) {
            setTimeout(() => {
                if (loop && !loop.paused) {
                    loop.pause()
                    loop.currentTime = 0
                }
            }, 100)

            const [a, b, c] = slots
            if (a === b && b === c) {
                setScore("JACKPOT!!! +10000")
                onTransaction("jackpot").then()
            } else if (a === b || b === c || a === c) {
                setScore("Two of a kind! +1000")
                onTransaction("pair").then()
            } else {
                setScore("No luck.")
                onTransaction("lose").then()
            }
        }
    }, [spinning, slots, setScore, onTransaction])

    return (
        <>
            <Image className={"absolute bottom-0"} src={"/images/pachinko.png"} alt={"Pachinko slot"} height={1300}
                   width={800}/>
            <div className={"flex flex-row justify-center items-center z-50 gap-12 absolute top-115"}>
                {slots.map((index, i) => {
                    const Icon = elements[index]
                    return (
                        <div
                            key={i}
                            className={`slot-icon ${spinning[i] ? "spinning" : "stopped"}`}
                        >
                            <Icon fill={getIcon(Icon).fill} color={getIcon(Icon).color} size={100}/>
                        </div>
                    )
                })}
            </div>
            <div className={"absolute bottom-0 w-[800px] h-[800px]"}>
                <button
                    className={"absolute bottom-27 left-25 rounded-full h-13 w-13 duration-300 ease-in-out hover:backdrop-blur-sm"}
                    onClick={startGame}/>
                <button
                    className={"absolute bottom-30 left-71 rounded-full h-12 w-12 duration-300 ease-in-out hover:backdrop-blur-sm"}
                    onClick={() => toggleHold(0)}/>
                <button
                    className={"absolute bottom-30 left-94 rounded-full h-12 w-12 duration-300 ease-in-out hover:backdrop-blur-sm"}
                    onClick={() => toggleHold(1)}/>
                <button
                    className={"absolute bottom-30 left-116 rounded-full h-12 w-12 duration-300 ease-in-out hover:backdrop-blur-sm"}
                    onClick={() => toggleHold(2)}/>
            </div>
        </>
    )
}
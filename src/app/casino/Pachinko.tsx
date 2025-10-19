import Image from "next/image";
import {Cherry, Apple, Heart, Star, Citrus, createLucideIcon} from "lucide-react"
import {strawberry, peach, pumpkin, pear, watermelon, flowerTulip} from "@lucide/lab"
import {useEffect, useRef, useState} from "react";

interface PachinkoProps {
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void
}

export const Pachinko = ({setScore}: PachinkoProps) => {
    const Strawberry = createLucideIcon("Strawberry", strawberry)
    const Peach = createLucideIcon("Peach", peach)
    const Pumpkin = createLucideIcon("Pumpkin", pumpkin)
    const Pear = createLucideIcon("Pear", pear)
    const Watermelon = createLucideIcon("Watermelon", watermelon)
    const FlowerTulip = createLucideIcon("FlowerTulip", flowerTulip)

    const elements = [Apple, Cherry, Star, Heart, Citrus, Strawberry, Peach, Pumpkin, Pear, Watermelon, FlowerTulip]

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
        setScore(null)
        setSpinning([true, true, true])

        const loop = loopRef.current
        if(loop && loop.paused){
            loop.currentTime = 0
            loop.play().catch(() => {})
        }
    }

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
    }, [spinning])

    const toggleHold = (index: number) => {
        if(spinning[index]){
            const stop = stopRef.current
            if(stop){
                stop.currentTime = 0
                stop.play().catch(() => {})
            }
        }
        setSpinning(prev => {
            return prev.map((val, i) => index === i ? false : val)
        })
    }

    useEffect(() => {
        const isAnySpinning = spinning.some((s) => s)
        const loop = loopRef.current

        if (!isAnySpinning) {
            setTimeout(() => {
                if (loop && !loop.paused) {
                    loop.pause()
                    loop.currentTime = 0
                }
            }, 1)

            const [a, b, c] = slots
            if (a === b && b === c) {
                setScore("JACKPOT!!! +1000")
            } else if (a === b || b === c || a === c) {
                setScore("Two of a kind! +500")
            } else {
                setScore("No luck.")
            }
        }
        else {
            if (loop && loop.paused) {
                loop.currentTime = 0
                loop.play().catch(() => {})
            }
        }
    }, [spinning, slots, setScore])

    return (
        <>
            <Image className={"absolute bottom-0"} src={"/images/pachinko.png"} alt={"Pachinko slot"} height={1300}
                   width={800}/>
            <div className={"flex flex-row justify-center items-center z-50 gap-12 absolute top-115"}>
                {slots.map((index, i) => {
                    const Icon = elements[index]
                    return (
                        <div key={i}>
                            <Icon size={100}/>
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
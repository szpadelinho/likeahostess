"use client"

import {createContext, useContext, useEffect, useRef, useState} from "react";
import {VolumeContextType} from "@/app/types";

const VolumeContext = createContext<VolumeContextType | null>(null)

export function VolumeProvider({ children }: { children: React.ReactNode }) {
    const [volume, setVolumeState] = useState<number>(100)
    const [baseVolume, setBaseVolume] = useState<number>(100)
    const animationRef = useRef<number | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("volume")
        if (stored !== null) {
            const v = Number(stored)
            setVolumeState(v)
            setBaseVolume(v)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("volume", baseVolume.toString())
    }, [baseVolume])

    const setVolume = (v: number) => {
        setVolumeState(v)
        setBaseVolume(v)
    }

    const fadeTo = (target: number, duration = 1000) => {
        if(animationRef.current){
            cancelAnimationFrame(animationRef.current)
        }

        const from = volume
        const start = performance.now()

        const animate = (time: number) => {
            const progress = Math.min((time - start) / duration, 1)
            const eased = progress * (2 - progress)
            const current = from + (target - from) * eased

            setVolumeState(Math.round(current))

            if(progress < 1){
                animationRef.current = requestAnimationFrame(animate)
            }
        }

        animationRef.current = requestAnimationFrame(animate)
    }

    const restore = () => fadeTo(baseVolume)

    return (
        <VolumeContext.Provider value={{ volume, setVolume, fadeTo, restore }}>
            {children}
        </VolumeContext.Provider>
    );
}

export function useVolume() {
    const context = useContext(VolumeContext);
    if (!context) {
        throw new Error("useVolume must be used inside VolumeProvider")
    }
    return context
}
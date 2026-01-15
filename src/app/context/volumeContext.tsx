"use client"

import {createContext, useContext, useEffect, useState} from "react";

interface VolumeContextType {
    volume: number
    setVolume: (v: number) => void
}

const VolumeContext = createContext<VolumeContextType | null>(null);

export function VolumeProvider({ children }: { children: React.ReactNode }) {
    const [volume, setVolume] = useState<number>(100)

    useEffect(() => {
        const storedVolume = localStorage.getItem("volume")
        if(storedVolume !== null) setVolume(Number(storedVolume))
    }, [])

    useEffect(() => {
        localStorage.setItem("volume", volume.toString())
    }, [volume])

    return (
        <VolumeContext.Provider value={{ volume, setVolume }}>
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
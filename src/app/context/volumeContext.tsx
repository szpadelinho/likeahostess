"use client"

import { createContext, useContext, useState } from "react";

interface VolumeContextType {
    volume: number
    setVolume: (v: number) => void
}

const VolumeContext = createContext<VolumeContextType | null>(null);

export function VolumeProvider({ children }: { children: React.ReactNode }) {
    const [volume, setVolume] = useState(100)

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
'use client'

import React, {createContext, useContext, useRef, useState, useCallback} from "react";

interface VolumeContextType {
    volume: number;
    setVolume: (value: number, instant?: boolean) => void;
    fadeTo: (value: number) => void;
    restore: () => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export const VolumeProvider = ({children}: {children: React.ReactNode}) => {
    const [volume, setVolumeState] = useState(50);
    const volumeRef = useRef(50);
    const savedVolumeRef = useRef<number>(50);
    const animationRef = useRef<number | null>(null);
    const startValueRef = useRef<number>(0);
    const targetValueRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    const setVolume = useCallback((target: number, instant: boolean = false) => {
        const clampedTarget = Math.min(Math.max(target, 0), 100);

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (instant) {
            volumeRef.current = clampedTarget;
            setVolumeState(clampedTarget)
            savedVolumeRef.current = clampedTarget;
            return;
        }

        startValueRef.current = volumeRef.current;
        targetValueRef.current = clampedTarget;
        startTimeRef.current = performance.now();
        const duration = 500; // ms

        const animate = (time: number) => {
            const elapsed = time - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startValueRef.current + (targetValueRef.current - startValueRef.current) * eased;
            const nextVal = Math.round(current);

            volumeRef.current = nextVal;

            setVolumeState(nextVal);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                animationRef.current = null;
                volumeRef.current = targetValueRef.current;
                setVolumeState(targetValueRef.current);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    const fadeTo = useCallback((target: number) => {
        savedVolumeRef.current = volumeRef.current;
        setVolume(target, false);
    }, [setVolume]);

    const restore = useCallback(() => {
        setVolume(savedVolumeRef.current, false);
    }, [setVolume]);

    return (
        <VolumeContext.Provider value={{volume, setVolume, fadeTo, restore}}>
            {children}
        </VolumeContext.Provider>
    );
};

export const useVolume = () => {
    const context = useContext(VolumeContext);
    if (!context) {
        throw new Error("useVolume must be used within a VolumeProvider");
    }
    return context;
};
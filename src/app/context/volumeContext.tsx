'use client'

import React, {createContext, useContext, useRef, useState, useCallback, useEffect} from "react"

interface VolumeContextType {
    volume: number
    setVolume: (value: number, instant?: boolean) => void
    fadeTo: (value: number) => void
    restore: () => void
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'userVolume'

export const VolumeProvider = ({children}: {children: React.ReactNode}) => {
    const [volume, setVolumeState] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedVolume = localStorage.getItem(LOCAL_STORAGE_KEY)
            return savedVolume ? parseInt(savedVolume, 10) : 50
        }
        return 50
    })

    const volumeRef = useRef(volume)
    const savedVolumeRef = useRef<number>(volume)
    const animationRef = useRef<number | null>(null)
    const startValueRef = useRef<number>(0)
    const targetValueRef = useRef<number>(0)
    const startTimeRef = useRef<number>(0)

    useEffect(() => {
        volumeRef.current = volume
        savedVolumeRef.current = volume
    }, [volume])


    const setVolume = useCallback((target: number, instant: boolean = false) => {
        const clampedTarget = Math.min(Math.max(target, 0), 100)

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }

        if (instant) {
            volumeRef.current = clampedTarget
            setVolumeState(clampedTarget)
            savedVolumeRef.current = clampedTarget
            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_KEY, clampedTarget.toString())
            }
            return
        }

        startValueRef.current = volumeRef.current
        targetValueRef.current = clampedTarget
        startTimeRef.current = performance.now()
        const duration = 500 // ms

        const animate = (time: number) => {
            const elapsed = time - startTimeRef.current
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = startValueRef.current + (targetValueRef.current - startValueRef.current) * eased
            const nextVal = Math.round(current)

            volumeRef.current = nextVal
            setVolumeState(nextVal)

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEY, nextVal.toString())
                }
            } else {
                animationRef.current = null
                volumeRef.current = targetValueRef.current
                setVolumeState(targetValueRef.current)
                if (typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEY, targetValueRef.current.toString())
                }
            }
        }

        animationRef.current = requestAnimationFrame(animate)
    }, [])

    const fadeTo = useCallback((target: number) => {
        savedVolumeRef.current = volumeRef.current
        setVolume(target, false)
    }, [setVolume])

    const restore = useCallback(() => {
        setVolume(savedVolumeRef.current, false)
    }, [setVolume])

    return (
        <VolumeContext.Provider value={{volume, setVolume, fadeTo, restore}}>
            {children}
        </VolumeContext.Provider>
    )
}

export const useVolume = () => {
    const context = useContext(VolumeContext)
    if (!context) {
        throw new Error("useVolume must be used within a VolumeProvider")
    }
    return context
}
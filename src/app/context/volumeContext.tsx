'use client'

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react"

interface VolumeContextType {
    volume: number
    setVolume: (value: number, instant?: boolean, persist?: boolean) => void
    fadeTo: (value: number) => void
    restore: () => void
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined)

const LOCAL_STORAGE_KEY = 'userVolume'

export const VolumeProvider = ({ children }: { children: React.ReactNode }) => {
    const [volume, setVolumeState] = useState(50)

    const volumeRef = useRef(volume)
    const savedVolumeRef = useRef<number>(volume)

    const animationRef = useRef<number | null>(null)
    const startValueRef = useRef<number>(0)
    const targetValueRef = useRef<number>(0)
    const startTimeRef = useRef<number>(0)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
            if (saved !== null) {
                const parsed = parseInt(saved, 10)
                if (!isNaN(parsed) && parsed > 0) {
                    setVolumeState(parsed)
                    volumeRef.current = parsed
                    savedVolumeRef.current = parsed
                }
            }
        }
    }, [])

    useEffect(() => {
        volumeRef.current = volume
    }, [volume])

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    const setVolume = useCallback((target: number, instant: boolean = false, persist: boolean = true) => {
        const clampedTarget = Math.min(Math.max(target, 0), 100)

        if (persist && clampedTarget > 0) {
            savedVolumeRef.current = clampedTarget
        }

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
        }

        if (instant) {
            volumeRef.current = clampedTarget
            setVolumeState(clampedTarget)
            if (persist && typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_KEY, clampedTarget.toString())
            }
            return
        }

        startValueRef.current = volumeRef.current
        targetValueRef.current = clampedTarget
        startTimeRef.current = performance.now()
        const duration = 500

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
                if (persist && typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEY, nextVal.toString())
                }
            } else {
                animationRef.current = null
                volumeRef.current = targetValueRef.current
                setVolumeState(targetValueRef.current)
                if (persist && typeof window !== 'undefined') {
                    localStorage.setItem(LOCAL_STORAGE_KEY, targetValueRef.current.toString())
                }
            }
        }

        animationRef.current = requestAnimationFrame(animate)
    }, [])

    const fadeTo = useCallback((target: number) => {
        setVolume(target, false, false)
    }, [setVolume])

    const restore = useCallback(() => {
        setVolume(savedVolumeRef.current, false, true)
    }, [setVolume])

    return (
        <VolumeContext.Provider value={{ volume, setVolume, fadeTo, restore }}>
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
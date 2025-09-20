'use client'

import React, {useEffect, useState} from "react";
import {LogOut, Volume2, VolumeOff} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import LoadingBanner from "@/components/loadingBanner";
import {signOut} from "next-auth/react";
import ReactPlayer from "react-player";
import clsx from "clsx";

type Club = {
    id: string;
    name: string
    description: string
    cost: number
    exterior: string
    logo: string
    host: {
        image: string
    }
}

const SelectionClient = () => {
    const [clubs, setClubs] = useState<Club[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const [fadeOut, setFadeOut] = useState(false)
    const [direction, setDirection] = useState<"prev" | null | "next">(null)

    const [loading, setLoading] = useState(true)

    const router = useRouter();

    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const checkSession = async () => {
            const res = await fetch('/api/auth/session');
            const session = await res.json();

            if (!session || Object.keys(session).length === 0) {
                router.push('/auth');
            }
        };

        checkSession();
    }, []);

    useEffect(() => {
        if(clubs.length > 0 && clubs[currentIndex]){
            setLoading(false)
        }
        else{
            setLoading(true)
        }
    }, [clubs, currentIndex]);

    const currentClub = clubs[currentIndex]

    useEffect(() => {
        fetch('/api/clubs')
            .then(res => res.json())
            .then(data => setClubs(data))
    }, [])

    useEffect(() => {
        if (direction) {
            const timer = setTimeout(() => setDirection(null), 400)
            return () => clearTimeout(timer)
        }
    }, [direction])

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % clubs.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + clubs.length) % clubs.length)
    }

    const getClubs = () => {
        if (clubs.length === 0) return []

        const prevIndex = (currentIndex - 1 + clubs.length) % clubs.length
        const nextIndex = (currentIndex + 1) % clubs.length

        return [
            {...clubs[prevIndex], position: "left"},
            {...clubs[currentIndex], position: "center"},
            {...clubs[nextIndex], position: "right"}
        ]
    }

    const getTransform = (position: string) => {
        if(direction === "prev"){
            switch(position){
                case "left": return "translateX(300px) scale(0.5)"
                case "center": return "translateX(300px) scale(1)"
                case "right": return "translateX(300px) scale(0.5)"
            }
        }
        if(direction === "next"){
            switch(position){
                case "left": return "translateX(-300px) scale(0.5)"
                case "center": return "translateX(-300px) scale(1)"
                case "right": return "translateX(-300px) scale(0.5)"
            }
        }
        switch(position){
            case "left": return "translateX(0px) scale(0.5)"
            case "center": return "translateX(0px) scale(1)"
            case "right": return "translateX(0px) scale(0.5)"
        }
    }

    const getOpacity = (position: string) => {
        if(direction === "prev" || direction === "next") return 0
        switch(position){
            case "left": return 0.7
            case "center": return 1
            case "right": return 0.7
        }
    }

    return (
        <>
            <LoadingBanner show={loading}/>
            <button onClick={() => {
                signOut({redirectTo: "/auth"})
            }}
                    className={"absolute top-10 right-10 border-white border-2 rounded-[10] p-1 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                <LogOut/>
            </button>
            <button onClick={() => {
                if(isPlaying){
                    setIsPlaying(false)
                }
                else{
                    setIsPlaying(true)
                }
            }}
                    className={"absolute top-10 right-25 border-white border-2 rounded-[10] p-1 cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                {
                    isPlaying ? <Volume2/> : <VolumeOff/>
                }
            </button>
            {!loading && (
                <div className={`flex justify-center content-center w-screen h-screen overflow-hidden ${fadeOut ? "opacity-0 transition-all duration-500" : "opacity-100 transition-all"}`}>
                    <div className={"flex content-center items-center justify-center flex-col gap-10"}>
                        <div className={"relative flex flex-row items-center justify-center gap-10"}>
                            {getClubs().map((club) => (
                                <div
                                    key={club.id}
                                    className={`relative flex flex-col items-center justify-center`}
                                    style={{
                                        transform: getTransform(club.position),
                                        opacity: getOpacity(club.position),
                                        transition: 'transform 0.4s ease-in, opacity 0.4s ease-in-out'
                                    }}
                                >
                                    <div
                                        className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_40%,_rgba(0,0,0,0)_0%,_rgba(0,0,0,1)_70%)] scale-101"/>
                                    <Image
                                        src={`${club.exterior}`}
                                        alt="Club exterior"
                                        width={club.position === "center" ? 800 : 600}
                                        height={club.position === "center" ? 400 : 300}
                                        className="rounded-md object-cover"
                                    />

                                    <div
                                        className={`absolute left-5 bottom-[-20px] z-10 ${club.position !== 'center' ? 'scale-75 opacity-80' : ''}`}>
                                        <Image
                                            src={`${club.host.image}`}
                                            alt="Host"
                                            height={200}
                                            width={125}
                                            className="rounded-md"
                                        />
                                    </div>
                                    <div className={`absolute right-5 h-20 w-50 flex justify-center items-center bottom-[-20px] z-10 ${club.position !== 'center' ? 'scale-75 opacity-80' : ''} bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,1)_-60%,_rgba(0,0,0,0)_65%)]`}>
                                        <Image src={`${club.logo}`} alt="Club logo" height={100} width={150}/>
                                    </div>
                                    {club.position === "left" && (
                                        <button
                                            className={"absolute h-full w-full z-50"}
                                            onClick={() => {
                                                setDirection("prev")
                                                setTimeout(() => {
                                                    prev()
                                                }, 400)
                                            }}
                                        />
                                    )}
                                    {club.position === "center" && (
                                        <button
                                            className={"absolute h-full w-full z-50"}
                                            onClick={async () => {
                                                setFadeOut(true)
                                                setTimeout(async () => {
                                                    localStorage.setItem("selectedClub", JSON.stringify(club))
                                                    await fetch("/api/user-club", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ clubId: club.id })
                                                    })
                                                    router.push("/")
                                                }, 500)
                                            }}
                                        />
                                    )}
                                    {club.position === "right" && (
                                        <button
                                            className="absolute h-full w-full z-50"
                                            onClick={() => {
                                                setDirection("next")
                                                setTimeout(() => {
                                                    next()
                                                }, 400)
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div
                            className={`flex flex-col text-center justify-center rounded-[20] -mb-20 mt-20 h-1/8 w-[800px] text-white bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,1)_-200%,_rgba(0,0,0,1)_70%)] ${clsx(
                                "transition-opacity duration-400",
                                direction === "prev" && "opacity-0",
                                direction === "next" && "opacity-0"
                            )}`}>
                            <h2 className={"m-5"}>{currentClub.description}</h2>
                        </div>
                    </div>
                </div>
            )}
            <ReactPlayer
                src={"https://youtube.com/embed/il5oBnsieks?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                className={"flex absolute top-0 left-0 z-[-1]"}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
        </>
    )
}

export default SelectionClient;
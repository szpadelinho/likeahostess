'use client'

import Image from "next/image";
import {DatabaseBackup, Trash2, Undo2, Volume2, VolumeOff} from "lucide-react";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import {Yesteryear} from "next/font/google";
import {Session} from "next-auth";
import type {Prisma} from "@prisma/client";

type FavClub = Prisma.UserClubGetPayload<{
    include: {
        club: {
            include: { host: true }
        }
    }
}>

interface ProfileClientProps {
    session?: Session | null,
    totals: {
        money: number,
        popularity: number
    } | undefined,
    favClub: FavClub,
}

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

const ProfileClient = ({session, totals, favClub}: ProfileClientProps) => {
    const router = useRouter();

    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    const handleReset = async () => {
        const res = await fetch('/api/resetUserClub', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session?.user?.id }),
        })
        if (res.ok) {
            console.log("Successfully reset user data and stats")
        }
    }

    const handleDelete = async () => {
        const res = await fetch('/api/deleteUser', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session?.user?.id }),
        })
        if (res.ok) {
            router.push('/auth')
            console.log("Successfully deleted user data and stats")
        }
    }

    return (
        <div className={"grayscale-100"}>
            <ReactPlayer
                src={"https://youtube.com/embed/hU7iW2-RtzI?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                className={"flex absolute top-0 left-0 z-[-1]"}
                loop={true}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
            <Image src={"/images/paper_card.png"} alt={"Paper card being held"} fill={true}
                   className={"absolute inset-0"}/>
            <div className={"h-screen w-screen flex items-center justify-center z-50 text-black"}>
                <button
                    className={"absolute top-5 left-5 border-pink-500 hover:border-pink-300 border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-pink-500 bg-pink-300 text-pink-500 hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-110 z-50"}
                    onClick={() => {
                        router.push("/")
                    }}>
                    <Undo2/>
                </button>
                <button onClick={() => {
                    if (isPlaying) {
                        setIsPlaying(false)
                    } else {
                        setIsPlaying(true)
                    }
                }}
                        className={"absolute top-5 right-5 border-pink-500 hover:border-pink-300 border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-pink-500 bg-pink-300 text-pink-500 hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-110 z-50"}>
                    {
                        isPlaying ? <Volume2/> : <VolumeOff/>
                    }
                </button>
                <h1 className={`z-50 text-[50px] absolute top-35 ${yesteryear.className}`}>
                    {session?.user?.name}'s card
                </h1>
                <h2 className={`absolute top-70 z-50 text-[25px] ${yesteryear.className}`}>
                    Summed money: {totals?.money}
                </h2>
                <h2 className={`absolute top-80 z-50 text-[25px] ${yesteryear.className}`}>
                    Summed up popularity: {totals?.popularity}
                </h2>
                <div className={"absolute top-120 flex justify-center items-center gap-1 flex-col"}>
                    <h1 className={`z-50 text-[30px] ${yesteryear.className}`}>
                        Favourite club
                    </h1>
                    <div className={"relative flex justify-center items-center z-50"}>
                        <Image src={favClub.club.logo} alt={"Club logo"} width={200} height={100} className={"z-50"}/>
                        <Image src={favClub.club.host.image} alt={"Host render"} width={40} height={100}
                               className={"absolute z-50 ml-55 mt-15"}/>
                        <div
                            className={"absolute flex h-full w-full scale-200 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,.5)_-50%,_rgba(0,0,0,0)_50%)] z-49"}/>
                    </div>
                </div>
                <div className={"flex justify-center items-center gap-5 flex-row absolute bottom-50 left-[47.5%]"}>
                    <button
                        className={"border-pink-500 hover:border-pink-300 border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-pink-500 bg-pink-300 text-pink-500 hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-110 z-50"}
                        onClick={handleReset}>
                        <DatabaseBackup/>
                    </button>
                    <button
                        className={"border-pink-500 hover:border-pink-300 border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-pink-500 bg-pink-300 text-pink-500 hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-110 z-50"}
                        onClick={handleDelete}>
                        <Trash2/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileClient
'use client'

import React, {useEffect, useState} from "react";
import {ChevronsLeft, ChevronsRight} from "lucide-react";
import Image from "next/image";
import {useRouter} from "next/navigation";

type Club = {
    id: string;
    name: string
    description: string
    cost: number
    exterior: string
    host: {
        image: string
    }
}

const Selection = () => {
    const [clubs, setClubs] = useState<Club[]>([])
    const [currentIndex, setCurrentIndex] = useState(1)
    const [refresh, setRefresh] = useState(Date.now())

    const router = useRouter();

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

    const currentClub = clubs[currentIndex]

    useEffect(() => {
        fetch('/api/clubs')
            .then(res => res.json())
            .then(data => setClubs(data))
    }, [])

    useEffect(() => {
        if (!currentClub) return
        setRefresh(Date.now())
    }, [currentClub?.exterior])

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

    const getClubsStyles = (position: string) => {
        switch (position) {
            case "left":
                return "transform scale-50 opacity-70"
            case "center":
                return "transform scale-100 opacity-100"
            case "right":
                return "transform scale-50 opacity-70"
            default:
                return ""
        }
    }

    if (clubs.length === 0 || !clubs[currentIndex]) {
        return (
            <div className={"flex w-screen h-screen justify-center items-center"}>
                <h1 className={"text-white text-[30px]"}>
                    Loading...
                </h1>
            </div>
        )
    }

    return (
        <div className={"flex justify-center content-center w-screen h-screen"}>
            <div className={"flex flex-1/200 content-center items-center justify-start m-5 "}>
                <button
                    className={"border-white border-2 rounded-[10] p-1 text-white hover:bg-white hover:text-black transition duration-200 ease-in-out"}
                    onClick={prev}>
                    <ChevronsLeft/>
                </button>
            </div>
            <div className={"flex flex-198/200 content-center items-center justify-center flex-col gap-10"}>
                <div className="relative flex flex-row items-center justify-center gap-10">
                    {getClubs().map((club) => (
                        <div
                            key={club.id}
                            className={`relative flex flex-col items-center justify-center transition-all duration-300 ${getClubsStyles(club.position)}`}
                        >
                            <div
                                className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_40%,_rgba(0,0,0,0)_0%,_rgba(0,0,0,1)_70%)] scale-101"/>
                            <Image
                                src={`${club.exterior}?ts=${refresh}`}
                                alt="Club exterior"
                                width={club.position === "center" ? 800 : 600}
                                height={club.position === "center" ? 400 : 300}
                                className="rounded-md object-cover"
                            />

                            <div
                                className={`absolute left-5 bottom-[-20px] z-10 ${club.position !== 'center' ? 'scale-75 opacity-80' : ''}`}>
                                <Image
                                    src={`${club.host.image}?ts=${refresh}`}
                                    alt="Host"
                                    height={200}
                                    width={125}
                                    className="rounded-md"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className={"flex flex-col text-center justify-center rounded-[20] bg-pink-900 h-1/8 w-[800px] text-white"}>
                    <h2 className={"m-5"}>{currentClub.description}</h2>
                </div>
                <div className={"absolute bottom-20 flex items-center justify-center"}>
                    <button
                        className={"border-white border-2 rounded-[10] p-1 text-white w-50 hover:bg-white hover:text-black transition duration-200 ease-in-out"}
                        onClick={async () => {
                            localStorage.setItem("selectedClub", JSON.stringify(currentClub))

                            await fetch("/api/user-club", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({clubId: currentClub.id})
                            })
                            router.push("/")
                        }}>Select
                    </button>
                </div>
            </div>
            <div className={"flex flex-1/200 content-center items-center justify-end m-5"}>
                <button
                    className={"border-white border-2 rounded-[10] p-1 text-white hover:bg-white hover:text-black transition duration-200 ease-in-out"}
                    onClick={next}><ChevronsRight/>
                </button>
            </div>
        </div>
    )
}

export default Selection;
'use client'

import {useEffect, useState} from "react";
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

    if (clubs.length === 0 || !clubs[currentIndex]) {
        return (
            <div className={"flex justify-center content-center w-screen h-screen flex-row"}>
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        <div className={"flex justify-center content-center w-screen h-screen"}>
            <div className={"flex flex-1/10 content-center items-center justify-start m-5"}>
                <button className={"border-white border-2 rounded-[5] p-1 text-white"} onClick={prev}>
                    <ChevronsLeft/>
                </button>
            </div>
            <div className={"flex flex-8/10 content-center items-center justify-center flex-col gap-10"}>
                <div className={"relative flex content-center items-center justify-center flex-row-reverse"}>
                    <div className={"flex"}>
                        <Image
                            key={currentClub.exterior}
                            src={`${currentClub.exterior}?ts=${refresh}`}
                            alt={"Club exterior"}
                            width={800}
                            height={400}
                        />
                    </div>
                    <div className={"flex absolute left-5 bottom-[-20]"}>
                        <Image
                            key={currentClub.host.image}
                            src={`${currentClub.host.image}?ts=${refresh}`}
                            alt={"Host"}
                            height={200}
                            width={125}
                        />
                    </div>
                </div>
                <div
                    className={"flex flex-col text-center justify-center rounded-[5] bg-pink-500 h-1/8 w-[800px] text-white"}>
                    <h2 className={"m-5"}>{currentClub.description}</h2>
                </div>
                <div className={"absolute bottom-20 flex items-center justify-center"}>
                    <button className={"border-white border-2 rounded-[5] p-1 text-white w-50"} onClick={async () => {
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
            <div className={"flex flex-1/10 content-center items-center justify-end m-5"}>
                <button className={"border-white border-2 rounded-[5] p-1 text-white"} onClick={next}><ChevronsRight/>
                </button>
            </div>
        </div>
    )
}

export default Selection;
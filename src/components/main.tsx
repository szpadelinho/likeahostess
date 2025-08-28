'use client'

import {useEffect, useState} from "react";
import Hud from "@/components/hud";
import Navbar from "@/components/navbar"

type Club = {
    name: string,
    host: {
        name: string,
        surname: string,
        image: string
    },
    money: number,
    popularity: number
}

const Main = () => {
    const [club, setClub] = useState<Club | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if (!stored) return

        const clubData = JSON.parse(stored)

        fetch(`/api/user-club?clubId=${clubData.id}`, {method: "POST"})
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch club data")
                }
                return res.json()
            })
            .then((userData) => {
                const mergedClub: Club = {
                    name: clubData.name,
                    host: clubData.host,
                    money: userData.money,
                    popularity: userData.popularity,
                }
                setClub(mergedClub)
            })
    }, [])

    if (!club) return <div>Loading...</div>

    return (
        <>
            <Navbar/>
            <Hud club={club}/>
        </>
    )
}

export default Main
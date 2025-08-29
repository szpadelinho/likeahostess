'use client'

import {useEffect, useState} from "react";
import Hud from "@/components/hud";
import Navbar from "@/components/navbar"
import LogOut from "@/components/logOut";
import SelectionPrompt from "@/components/selection";

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
    const [logOff, setLogOff] = useState<boolean>(false)
    const [selectionPrompt, setSelectionPrompt] = useState<boolean>(false)

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
            {selectionPrompt && <SelectionPrompt setSelectionPrompt={setSelectionPrompt}/>}
            {logOff && <LogOut setLogOff={setLogOff}/>}
            <Hud club={club} setLogOff={setLogOff} setSelectionPrompt={setSelectionPrompt}/>
        </>
    )
}

export default Main
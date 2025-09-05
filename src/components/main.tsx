'use client'

import React, {useEffect, useState} from "react";
import Hud from "@/components/hud";
import Navbar from "@/components/navbar"
import LogOut from "@/components/logOut";
import SelectionPrompt from "@/components/selection";
import MainWrapper from "@/components/mainWrapper";
import Interior from "@/components/interior";
import ModalWrapper from "@/components/modalWrapper";
import Management from "@/components/management";
import HostessPanel from "@/components/hostessPanel";
import Activities from "@/components/activities";

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

interface Hostess {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    attractiveness: number
    bio: string
}

const Main = () => {
    const [club, setClub] = useState<Club | null>(null)
    const [logOff, setLogOff] = useState<boolean>(false)
    const [selectionPrompt, setSelectionPrompt] = useState<boolean>(false)
    const [management, setManagement] = useState<boolean>(false)
    const [activites, setActivities] = useState<boolean>(false)

    const [hostessesManagement, setHostessesManagement] = useState<Hostess[]>([])
    const [hostessesPanel, setHostessesPanel] = useState<(Hostess | null)[]>(Array(8).fill(null))
    const [selectedHostess, setSelectedHostess] = useState<Hostess | null>(null)

    useEffect(() => {
        const fetchHostesses = async () => {
            try {
                const res = await fetch("/api/hostess")
                const data = await res.json()
                setHostessesManagement(data)
            } catch (err) {
                console.log("Failed to fetch hostesses", err)
            }
        }

        fetchHostesses()
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if (!stored) return

        const clubData = JSON.parse(stored)

        fetch(`/api/user-club?clubId=${clubData.id}`, {method: "POST"})
            .then(async (res) => {
                const data = await res.text()
                if (!res.ok) {
                    console.error("API error:", res.status, data)
                    throw new Error("Failed to fetch club data")
                }
                return JSON.parse(data)
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

    if (!club) return <div className={"flex w-screen h-screen justify-center items-center"}><h1
        className={"text-white text-[30px]"}>Loading...</h1></div>

    return (
        <>
            <MainWrapper>
                <Navbar/>
                <Interior/>
                <Hud club={club} logOff={logOff} setLogOff={setLogOff} selectionPrompt={selectionPrompt}
                     setSelectionPrompt={setSelectionPrompt} setManagement={setManagement}
                     setActivities={setActivities}/>
                <HostessPanel management={management} hostesses={hostessesPanel} setHostesses={setHostessesPanel}
                              selectedHostess={selectedHostess} setSelectedHostess={setSelectedHostess}/>
                {selectionPrompt && (
                    <ModalWrapper onClose={() => setSelectionPrompt(false)}>
                        {({onCloseModal}) => <SelectionPrompt onCloseModal={onCloseModal}/>}
                    </ModalWrapper>
                )}
                {logOff && (
                    <ModalWrapper onClose={() => setLogOff(false)}>
                        {({onCloseModal}) => <LogOut onCloseModal={onCloseModal}/>}
                    </ModalWrapper>
                )}
                {management && (
                    <ModalWrapper onClose={() => setManagement(false)}>
                        {({onCloseModal}) => <Management onCloseModal={onCloseModal} hostesses={hostessesManagement}
                                                         selectedHostess={selectedHostess}
                                                         setSelectedHostess={setSelectedHostess}/>}
                    </ModalWrapper>
                )}
                {activites && (
                    <ModalWrapper onClose={() => setActivities(false)}>
                        {({onCloseModal}) => <Activities onCloseModal={onCloseModal}/>}
                    </ModalWrapper>
                )}
            </MainWrapper>
        </>
    )
}

export default Main
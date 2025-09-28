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
import LoadingBanner from "@/components/loadingBanner";
import VideoWindow from "@/components/videoWindow";
import JamPlayer from "@/components/jamPlayer";
import {Inquiry} from "@/components/inquiry";
import {BuffetType} from "@prisma/client";

type Club = {
    name: string
    host: {
        name: string
        surname: string
        image: string
    },
    money: number
    popularity: number
    logo: string
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

interface Performer {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    bio: string
}

interface Activity {
    id: string
    name: string
    popularityGain: number
    cost: number
    media: string
    performerId: string
}

interface Jam {
    id: string
    title: string
    media: string
}

interface Buffet{
    id: string
    name: string
    price: number
    description: string
    type: BuffetType
}

const Main = () => {
    const [club, setClub] = useState<Club | null>(null)
    const [logOff, setLogOff] = useState<boolean>(false)
    const [selectionPrompt, setSelectionPrompt] = useState<boolean>(false)

    const [management, setManagement] = useState<boolean>(false)
    const [activities, setActivities] = useState<boolean>(false)

    const [activity, setActivity] = useState<Activity[]>([])
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

    const [performers, setPerformers] = useState<Performer[]>([])
    const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null)

    const [hostessesManagement, setHostessesManagement] = useState<Hostess[]>([])
    const [hostessesPanel, setHostessesPanel] = useState<(Hostess | null)[]>(Array(8).fill(null))
    const [selectedHostess, setSelectedHostess] = useState<Hostess | null>(null)

    const [hostessesWorking, setHostessesWorking] = useState<(Hostess | null)[]>(Array(8).fill(null))

    const [loading, setLoading] = useState(true)
    const [clubLogo, setClubLogo] = useState("")

    const [jams, setJams] = useState<Jam[]>([])
    const [isJamPlaying, setIsJamPlaying] = useState(true)
    const [jamToggle, setJamToggle] = useState<boolean | null>(null)

    const [visit, setVisit] = useState<boolean[]>(Array(8).fill(false))

    const [buffet, setBuffet] = useState<Buffet[]>([])

    const [dinedTables, setDinedTables] = useState<boolean[]>(Array(8).fill(false))
    const [inquiryTableId, setInquiryTableId] = useState<number | null>(null)
    const [inquiryWindow, setInquiryWindow] = useState<boolean>(false)

    const [inquiry, setInquiry] = useState<boolean[]>(Array(8).fill(false))
    const [inquiryType, setInquiryType] = useState<("Service" | "Buffet" | "End" | null)[]>(Array(8).fill(null))

    const SERVICE_TYPES = [
        "ashtray",
        "lady_glass",
        "guest_glass",
        "towel",
        "menu",
        "ice"
    ] as const

    type ServiceType = typeof SERVICE_TYPES[number]

    const [serviceType, setServiceType] = useState<(ServiceType | null)[]>(Array(8).fill(null))

    useEffect(() => {
        const fetchHostesses = async () => {
            try {
                const res = await fetch("/api/hostess")
                const data = await res.json()
                const sortedData = data.sort((a: Hostess, b: Hostess) => Number(a.id) - Number(b.id))
                setHostessesManagement(sortedData)
            } catch (err) {
                console.log("Failed to fetch hostesses", err)
            }
        }

        fetchHostesses()
    }, [])

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch("/api/activities")
                const data = await res.json()
                const sortedData = data.sort((a: Activity, b: Activity) => Number(a.id) - Number(b.id))
                setActivity(sortedData)
            } catch (err) {
                console.log("Failed to fetch activities", err)
            }
        }

        fetchActivities()
    }, [])

    useEffect(() => {
        const fetchJams = async () => {
            try {
                const res = await fetch("/api/jams")
                const data = await res.json()
                const sortedData = data.sort((a: Jam, b: Jam) => Number(a.id) - Number(b.id))
                setJams(sortedData)
            } catch (err) {
                console.log("Failed to fetch jams", err)
            }
        }

        fetchJams()
    }, [])

    useEffect(() => {
        const fetchBuffet = async () => {
            try {
                const res = await fetch("/api/buffet")
                const data = await res.json()
                const sortedData = data.sort((a: Buffet, b: Buffet) => Number(a.id) - Number(b.id))
                setBuffet(sortedData)
            } catch (err) {
                console.log("Failed to fetch buffet", err)
            }
        }

        fetchBuffet()
    }, [])

    useEffect(() => {
        if (!club || jams.length === 0 || performers.length === 0 || activity.length === 0) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [club, jams, performers, activity])

    useEffect(() => {
        const fetchPerformers = async () => {
            try {
                const res = await fetch("/api/performers")
                const data = await res.json()
                const sortedData = data.sort((a: Performer, b: Performer) => Number(a.id) - Number(b.id))
                setPerformers(sortedData)
            } catch (err) {
                console.log("Failed to fetch performers", err)
            }
        }

        fetchPerformers()
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
                    logo: clubData.logo,
                    money: userData.money,
                    popularity: userData.popularity,
                }
                setClubLogo(clubData.logo)
                setClub(mergedClub)
            })
    }, [])

    return (
        <>
            {inquiryWindow && (
                <ModalWrapper
                    onClose={() => {
                        if (inquiryTableId !== null) {
                            setInquiry(prev => {
                                const updated = [...prev]
                                updated[inquiryTableId] = false
                                return updated
                            })
                            setInquiryType(prev => {
                                const updated = [...prev]
                                updated[inquiryTableId] = null
                                return updated
                            })
                            setInquiryWindow(false)
                        }
                    }}
                >
                    {({onCloseModal}) => (
                        <Inquiry buffet={buffet} onCloseModal={onCloseModal} dinedTables={dinedTables} setDinedTables={setDinedTables} inquiryTableId={inquiryTableId} inquiryType={inquiryType} setVisit={setVisit} setInquiryWindow={setInquiryWindow} setInquiryType={setInquiryType} setInquiry={setInquiry} serviceType={serviceType} setServiceType={setServiceType} hostesses={hostessesWorking}/>
                    )}
                </ModalWrapper>
            )}
            <LoadingBanner show={loading}/>
            {selectedActivity && (
                <ModalWrapper
                    onClose={() => {
                        setSelectedActivity(null)
                        if(jamToggle !== null){
                            setIsJamPlaying(jamToggle)
                        }
                    }}
                >
                    {({ onCloseModal }) => (
                        <VideoWindow selectedActivity={selectedActivity} onCloseModal={onCloseModal} setIsJamPlaying={setIsJamPlaying} jamToggle={jamToggle}/>
                    )}
                </ModalWrapper>
            )}
            {!loading && (
                <MainWrapper>
                    <JamPlayer jams={jams} isJamPlaying={isJamPlaying} setIsJamPlaying={setIsJamPlaying}/>
                    <Navbar logo={clubLogo}/>
                    <Interior hostesses={hostessesWorking} setHostesses={setHostessesWorking} selectedHostess={selectedHostess} setSelectedHostess={setSelectedHostess} setHostessesPanel={setHostessesPanel} dinedTables={dinedTables} setInquiryTableId={setInquiryTableId} setInquiryWindow={setInquiryWindow} inquiry={inquiry} setInquiry={setInquiry} inquiryType={inquiryType} setInquiryType={setInquiryType} visit={visit} setVisit={setVisit} serviceType={serviceType} setServiceType={setServiceType}/>
                    {club && (
                        <Hud
                            club={club}
                            logOff={logOff}
                            setLogOff={setLogOff}
                            selectionPrompt={selectionPrompt}
                            setSelectionPrompt={setSelectionPrompt}
                            setManagement={setManagement}
                            setActivities={setActivities}
                        />
                    )}
                    <HostessPanel management={management} hostesses={hostessesPanel} setHostesses={setHostessesPanel}
                                  selectedHostess={selectedHostess} setSelectedHostess={setSelectedHostess}
                                  setHostessesManagement={setHostessesManagement} setManagement={setManagement}/>
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
                        <ModalWrapper onClose={() => {
                            setSelectedHostess(null)
                            setManagement(false)
                        }}>
                            {({onCloseModal}) => <Management onCloseModal={onCloseModal} hostesses={hostessesManagement}
                                                             selectedHostess={selectedHostess}
                                                             setSelectedHostess={setSelectedHostess}/>}
                        </ModalWrapper>
                    )}
                    {activities && (
                        <ModalWrapper onClose={() => {
                            setSelectedPerformer(null)
                            setActivities(false)
                        }}>
                            {({onCloseModal}) => <Activities onCloseModal={onCloseModal} performers={performers}
                                                             selectedPerformer={selectedPerformer}
                                                             setSelectedPerformer={setSelectedPerformer} activities={activity} setSelectedActivity={setSelectedActivity} club={club} isJamPlaying={isJamPlaying} setIsJamPlaying={setIsJamPlaying} setJamToggle={setJamToggle}/>}
                        </ModalWrapper>
                    )}
                </MainWrapper>
            )}
        </>
    )
}

export default Main
'use client'

import React, {useEffect, useState} from "react";
import Hud from "@/components/hud";
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
import {ModalContent} from "@/components/modalContent";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import InteriorBanner from "@/components/interiorBanner";
import {
    Club,
    Activity,
    Jam,
    Performer,
    Hostess,
    Buffet,
    ServiceType,
    StoredClub,
    CLUB_RANKS,
    getLevel, getRank, Rank, WindowType
} from "@/app/types";
import {useSession} from "next-auth/react";

const Main = () => {
    const {data: session, status} = useSession()
    const [money, setMoney] = useState<number>(0)
    const [popularity, setPopularity] = useState<number>(0)
    const [experience, setExperience] = useState<number>(0)
    const [supplies, setSupplies] = useState<number>(0)
    const [rank, setRank] = useState<Rank>({lvl: 0, rank: CLUB_RANKS[0]})
    const [clubData, setClubData] = useState<Club | null>(null)

    const [club, setClub] = useState<Club | null>(null)

    const [window, setWindow] = useState<WindowType | null>(null)
    const [fade, setFade] = useState<boolean>(false)

    const [activity, setActivity] = useState<Activity[]>([])
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

    const [performers, setPerformers] = useState<Performer[]>([])
    const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null)

    const [hostessesManagement, setHostessesManagement] = useState<Hostess[]>([])
    const [hostessesPanel, setHostessesPanel] = useState<(Hostess | null)[]>(Array(6).fill(null))
    const [selectedHostess, setSelectedHostess] = useState<Hostess | null>(null)

    const [hostessesWorking, setHostessesWorking] = useState<(Hostess | null)[]>(Array(6).fill(null))

    const [loading, setLoading] = useState(true)
    const [fetched, setFetching] = useState<boolean>(true)

    const [jams, setJams] = useState<Jam[]>([])
    const [isJamPlaying, setIsJamPlaying] = useState(true)
    const [jamToggle, setJamToggle] = useState<boolean | null>(null)

    const [visit, setVisit] = useState<boolean[]>(Array(6).fill(false))

    const [buffet, setBuffet] = useState<Buffet[]>([])

    const [dinedTables, setDinedTables] = useState<boolean[]>(Array(6).fill(false))
    const [inquiryTableId, setInquiryTableId] = useState<number | null>(null)
    const [inquiryWindow, setInquiryWindow] = useState<boolean>(false)

    const [inquiry, setInquiry] = useState<boolean[]>(Array(8).fill(false))
    const [inquiryType, setInquiryType] = useState<("Service" | "Buffet" | "End" | null)[]>(Array(8).fill(null))

    const [barKeys, setBarKeys] = useState<number[]>(Array(8).fill(0))

    const [showInteriorBanner, setShowInteriorBanner] = useState<boolean>(false)
    const [animateInteriorBanner, setAnimateInteriorBanner] = useState<boolean>(false)

    const [serviceType, setServiceType] = useState<(ServiceType | null)[]>(Array(8).fill(null))

    const [quit, setQuit] = useState<boolean>(false)

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
        if(status !== "authenticated" || hostessesManagement.length === 0) return

        const fetchFatigue = async () => {
            try{
                await fetch("/api/user-hostess", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId: session?.user?.id})
                })
                console.log("Fatigue fetch succedeed")
            }
            catch(err){
                console.error("Failed to fetch fatigue", err)
            }
        }

        fetchFatigue()
    }, [status, session?.user?.id, hostessesManagement])

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
            setFetching(true)
        } else {
            setLoading(false)
            setFetching(false)
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
        if(!stored) return console.error("No such element as localStorage on Main")
        const parsedClub: StoredClub = JSON.parse(stored)
        setClubData(parsedClub)

        fetch(`/api/user-club?clubId=${parsedClub.id}`, {method: "POST"})
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
                    name: parsedClub.name,
                    host: parsedClub.host,
                    logo: parsedClub.logo,
                    money: userData.money,
                    popularity: userData.popularity,
                    supplies: userData.supplies
                }
                setSupplies(userData.supplies)
                setMoney(userData.money)
                setPopularity(userData.popularity)
                setClub(mergedClub)
            })
    }, [])

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const res = await fetch("/api/user", {method: "GET"})
                const data = await res.json()
                setExperience(data.experience)
            } catch (err) {
                console.log("Failed to fetch user experience", err)
            }
        }
        fetchExperience()
    }, [])

    useEffect(() => {
        const lvl = getLevel(experience)
        const rank = getRank(lvl)
        setRank({lvl, rank})
    }, [experience])

    useEffect(() => {
        const isFromAuth = sessionStorage.getItem("firstEnter")

        if(isFromAuth == "true"){
            setTimeout(() => {
                sessionStorage.removeItem("firstEnter")
                setShowInteriorBanner(true)
                setTimeout(() => setAnimateInteriorBanner(true), 500)
                setTimeout(() => {
                    setAnimateInteriorBanner(false)
                }, 3000)
                setTimeout(() => setShowInteriorBanner(false), 3500)
            }, 2500)
        }
    }, [])

    return (
        <DndProvider backend={HTML5Backend}>
            {inquiryWindow && (
                <ModalWrapper
                    fade={fade}
                    onClose={() => {
                        if (inquiryTableId !== null) {
                            setInquiryWindow(false)
                        }
                    }}
                >
                    {({onCloseModal}) => (
                        <Inquiry buffet={buffet} onCloseModal={onCloseModal} dinedTables={dinedTables} setDinedTables={setDinedTables} inquiryTableId={inquiryTableId} inquiryType={inquiryType} setVisit={setVisit} setInquiryWindow={setInquiryWindow} setInquiryType={setInquiryType} setInquiry={setInquiry} serviceType={serviceType} setServiceType={setServiceType} hostesses={hostessesWorking} setBarKeys={setBarKeys} session={session} clubData={clubData} setMoney={setMoney} setClub={setClub} setPopularity={setPopularity} setExperience={setExperience} setSupplies={setSupplies}/>
                    )}
                </ModalWrapper>
            )}
            <div className={`z-[1000] fixed h-screen w-screen bg-black duration-1000 ease-in-out pointer-events-none ${quit ? "opacity-100" : "opacity-0"}`}/>
            <LoadingBanner show={loading && !quit}/>
            {(!loading && showInteriorBanner) && (
                <InteriorBanner show={animateInteriorBanner} club={club}/>
            )}
            {selectedActivity && (
                <ModalWrapper
                    isKaraoke={true}
                    fade={fade}
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
            {!fetched && (
                <MainWrapper>
                    <JamPlayer jams={jams} isJamPlaying={isJamPlaying} setIsJamPlaying={setIsJamPlaying}/>
                    <Interior hostesses={hostessesWorking} setHostesses={setHostessesWorking} selectedHostess={selectedHostess} setSelectedHostess={setSelectedHostess} setHostessesPanel={setHostessesPanel} dinedTables={dinedTables} setDinedTables={setDinedTables} setInquiryTableId={setInquiryTableId} setInquiryWindow={setInquiryWindow} inquiry={inquiry} setInquiry={setInquiry} inquiryType={inquiryType} setInquiryType={setInquiryType} visit={visit} setVisit={setVisit} serviceType={serviceType} setServiceType={setServiceType} barKeys={barKeys}/>
                    {club && (
                        <>
                            <HostessPanel hostesses={hostessesPanel} setHostesses={setHostessesPanel}
                                          selectedHostess={selectedHostess} setSelectedHostess={setSelectedHostess}
                                          setHostessesManagement={setHostessesManagement} window={window} setWindow={setWindow}/>
                            <Hud
                                club={club}
                                windowType={window}
                                setWindow={setWindow}
                                setFade={setFade}
                                money={money}
                                popularity={popularity}
                                experience={experience}
                                supplies={supplies}
                                rank={rank}
                            />
                        </>
                    )}
                    {window && (
                        <ModalWrapper
                            fade={fade}
                            onClose={() => {
                            setWindow(null)
                        }}>
                            {({onCloseModal}) => <ModalContent onCloseModal={onCloseModal} window={window} setLoading={setLoading} setQuit={setQuit}/>}
                        </ModalWrapper>
                    )}
                    {window === "Management" && (
                        <ModalWrapper
                            fade={fade}
                            onClose={() => {
                            setSelectedHostess(null)
                            setWindow(null)
                        }}>
                            {({onCloseModal}) => <Management onCloseModal={onCloseModal} hostesses={hostessesManagement}
                                                             selectedHostess={selectedHostess}
                                                             setSelectedHostess={setSelectedHostess}/>}
                        </ModalWrapper>
                    )}
                    {window === "Activities" && (
                        <ModalWrapper
                            fade={fade}
                            onClose={() => {
                            setSelectedPerformer(null)
                            setWindow(null)
                        }}>
                            {({onCloseModal}) => <Activities onCloseModal={onCloseModal} performers={performers}
                                                             selectedPerformer={selectedPerformer}
                                                             setSelectedPerformer={setSelectedPerformer} activities={activity} setSelectedActivity={setSelectedActivity} club={club} isJamPlaying={isJamPlaying} setIsJamPlaying={setIsJamPlaying} setJamToggle={setJamToggle} session={session} clubData={clubData} setPopularity={setPopularity} setMoney={setMoney} setClub={setClub}/>}
                        </ModalWrapper>
                    )}
                </MainWrapper>
            )}
        </DndProvider>
    )
}

export default Main
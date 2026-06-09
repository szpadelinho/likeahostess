'use client'

import React, {useEffect, useRef, useState} from "react";
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
    getLevel, getRank, Rank, WindowType, Loan, Effect, Client
} from "@/app/types";
import {useSession} from "next-auth/react";
import {useVolume} from "@/app/context/volumeContext";
import ChatClient from "@/components/chatClient";

const Main = () => {
    const {data: session} = useSession()
    const {volume} = useVolume()

    const [money, setMoney] = useState<number>(0)
    const [popularity, setPopularity] = useState<number>(0)
    const [experience, setExperience] = useState<number>(0)
    const [supplies, setSupplies] = useState<number>(0)
    const [rank, setRank] = useState<Rank>({lvl: 0, rank: CLUB_RANKS[0]})
    const [clubData, setClubData] = useState<StoredClub | null>(null)
    const [loan, setLoan] = useState<Loan | null>(null)
    const [effect, setEffect] = useState<Effect | null>(null)

    const [club, setClub] = useState<Club | null>(null)

    const [window, setWindow] = useState<WindowType | null>(null)
    const [fade, setFade] = useState<boolean>(false)

    const [activity, setActivity] = useState<Activity[]>([])
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

    const [performers, setPerformers] = useState<Performer[]>([])
    const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null)

    const [clients, setClients] = useState<(Client | null)[]>(Array(8).fill(null))

    const [hostessesManagement, setHostessesManagement] = useState<Hostess[]>([])
    const [hostessesPanel, setHostessesPanel] = useState<(Hostess | null)[]>(Array(6).fill(null))
    const [selectedHostess, setSelectedHostess] = useState<Hostess | null>(null)

    const [hostessesWorking, setHostessesWorking] = useState<(Hostess | null)[]>(Array(6).fill(null))

    const [loading, setLoading] = useState(true)
    const [fetched, setFetching] = useState<boolean>(true)

    const [jams, setJams] = useState<Jam[]>([])
    const [isJamPlaying, setIsJamPlaying] = useState(volume > 0)
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
    const [isTyping, setIsTyping] = useState<boolean>(false)

    const welcomeRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const initGame = async () => {
            try {
                const stored = localStorage.getItem("selectedClub")
                if(!stored) return console.error("No such element as localStorage on Main")
                const parsedClub: StoredClub = JSON.parse(stored)
                setClubData(parsedClub)

                const res = await fetch(`/api/init?clubId=${parsedClub.id}`)
                const data = await res.json()

                const hostesses: Hostess[] = data.hostesses
                const sortedHostesses = hostesses.sort(
                    (a, b) => Number(a.id) - Number(b.id)
                )
                setHostessesManagement(sortedHostesses)

                const activities = data.activities
                const sortedActivities = activities.sort((a: Activity, b: Activity) => Number(a.id) - Number(b.id))
                setActivity(sortedActivities)

                const jams = data.jams
                const sortedJams = jams.sort((a: Jam, b: Jam) => Number(a.id) - Number(b.id))
                setJams(sortedJams)

                const buffet = data.buffet
                const sortedBuffet = buffet.sort((a: Buffet, b: Buffet) => Number(a.id) - Number(b.id))
                setBuffet(sortedBuffet)

                const performers = data.performers
                const sortedPerformers = performers.sort((a: Performer, b: Performer) => Number(a.id) - Number(b.id))
                setPerformers(sortedPerformers)

                const experience = data.experience
                setExperience(experience)

                const userData = data.club
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

                const loan = data.loan
                if(loan){
                    setLoan(loan)
                }

                const effect = data.effect
                if(effect){
                    setEffect(effect)
                }

                setLoading(false)
                setFetching(false)
            }
            catch(err) {
                console.log(err)
            }
        }

        if(session?.user?.id) initGame().then()
    }, [session?.user?.id])

    useEffect(() => {
        const lvl = getLevel(experience)
        const rank = getRank(lvl)
        setRank({lvl, rank})
    }, [experience])

    useEffect(() => {
        if (loading) return

        const isFromAuth = sessionStorage.getItem("firstEnter")
        if (isFromAuth !== "true") return

        sessionStorage.removeItem("firstEnter")
        welcomeRef.current = new Audio("/sfx/greet.mp3")
        welcomeRef.current.volume = .10

        const start = setTimeout(() => {
            setShowInteriorBanner(true)
            welcomeRef?.current?.play().catch()
            setTimeout(() => setAnimateInteriorBanner(true), 500)
            setTimeout(() => setAnimateInteriorBanner(false), 3000)
            setTimeout(() => setShowInteriorBanner(false), 3500)
        }, 500)

        return () => {
            clearTimeout(start)
            welcomeRef.current = null
        }
    }, [loading])


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
                        <Inquiry buffet={buffet} onCloseModal={onCloseModal} dinedTables={dinedTables} setDinedTables={setDinedTables} inquiryTableId={inquiryTableId} inquiryType={inquiryType} setVisit={setVisit} setInquiryWindow={setInquiryWindow} setInquiryType={setInquiryType} setInquiry={setInquiry} serviceType={serviceType} setServiceType={setServiceType} hostesses={hostessesWorking} setHostesses={setHostessesWorking} setBarKeys={setBarKeys} session={session} clubData={clubData} setMoney={setMoney} setClub={setClub} setPopularity={setPopularity} setExperience={setExperience} setSupplies={setSupplies} clients={clients}/>
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
                    <ChatClient page={"Main"} setIsTyping={setIsTyping} setLoading={setLoading}/>
                    <JamPlayer jams={jams} isJamPlaying={isJamPlaying} setIsJamPlaying={setIsJamPlaying}/>
                    <Interior hostesses={hostessesWorking} setHostesses={setHostessesWorking} selectedHostess={selectedHostess} setSelectedHostess={setSelectedHostess} setHostessesPanel={setHostessesPanel} dinedTables={dinedTables} setDinedTables={setDinedTables} setInquiryTableId={setInquiryTableId} setInquiryWindow={setInquiryWindow} inquiry={inquiry} setInquiry={setInquiry} inquiryType={inquiryType} setInquiryType={setInquiryType} visit={visit} setVisit={setVisit} serviceType={serviceType} setServiceType={setServiceType} barKeys={barKeys} money={money} supplies={supplies} clients={clients} setClients={setClients}/>
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
                                loan={loan}
                                effect={effect}
                                isTyping={isTyping}
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
                    {window === "Activities" && clubData && (
                        <ModalWrapper
                            fade={fade}
                            onClose={() => {
                            setSelectedPerformer(null)
                            setWindow(null)
                        }}>
                            {({onCloseModal}) => <Activities onCloseModal={onCloseModal} performers={performers}
                                                             selectedPerformer={selectedPerformer}
                                                             setSelectedPerformer={setSelectedPerformer} activities={activity} setSelectedActivity={setSelectedActivity} club={club} isJamPlaying={isJamPlaying} setIsJamPlaying={setIsJamPlaying} setJamToggle={setJamToggle} session={session} clubData={clubData} setPopularity={setPopularity} setMoney={setMoney} setClub={setClub} setExperience={setExperience}/>}
                        </ModalWrapper>
                    )}
                </MainWrapper>
            )}
        </DndProvider>
    )
}

export default Main
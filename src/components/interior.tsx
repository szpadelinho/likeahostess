'use client'

import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {
    BookHeart,
    BrushCleaning,
    Gavel,
    HandHeart,
    Martini,
    Play,
    Wind
} from "lucide-react";
import LoadingBar from "@/components/loadingBar";
import {DraggableDoor, DroppableClient, DroppableHostessTableSlot} from "@/scripts/DNDItems";
import {ServiceType, SERVICE_TYPES, Hostess, Client, sourGummy, clientMugshots} from "@/app/types";

interface InteriorProps {
    hostesses: (Hostess | null)[],
    setHostesses: React.Dispatch<React.SetStateAction<(Hostess | null)[]>>,
    selectedHostess: Hostess | null,
    setSelectedHostess: (hostess: Hostess | null) => void,
    setHostessesPanel: React.Dispatch<React.SetStateAction<(Hostess | null)[]>>,
    dinedTables: boolean[],
    setInquiryTableId: React.Dispatch<React.SetStateAction<number | null>>,
    setInquiryWindow: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    inquiry: boolean[],
    setInquiry: (value: (((prevState: boolean[]) => boolean[]) | boolean[])) => void,
    inquiryType: ("Service" | "Buffet" | "End" | null)[],
    setInquiryType: (value: (((prevState: ("Service" | "Buffet" | "End" | null)[]) => ("Service" | "Buffet" | "End" | null)[]) | ("Service" | "Buffet" | "End" | null)[])) => void,
    visit: boolean[],
    setVisit: (value: (((prevState: boolean[]) => boolean[]) | boolean[])) => void,
    serviceType: (ServiceType | null)[],
    setServiceType: (
        value:
            | ((prevState: (ServiceType | null)[]) => (ServiceType | null)[])
            | (ServiceType | null)[]
    ) => void,
    setDinedTables: (value: (((prevState: boolean[]) => boolean[]) | boolean[])) => void,
    barKeys: number[],
    money: number,
    supplies: number,
    clients: (Client | null)[],
    setClients: (value: (((prevState: (Client | null)[]) => (Client | null)[]) | (Client | null)[])) => void
}

const Interior = ({
                      hostesses,
                      setHostesses,
                      setHostessesPanel,
                      dinedTables,
                      setInquiryTableId,
                      setInquiryWindow,
                      inquiry,
                      setInquiry,
                      inquiryType,
                      setInquiryType,
                      visit,
                      setVisit,
                      setServiceType,
                      setDinedTables,
                      barKeys,
                      money,
                      supplies,
                      clients,
                      setClients
                  }: InteriorProps) => {
    const items = Array(8).fill(null)

    const [wiggleHostess, setWiggleHostess] = useState<boolean[]>(Array(8).fill(false))

    const [waitingClient, setWaitingClient] = useState<Client | null>(null)

    const clientRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (supplies > 0 && money > 0) {
            if (!waitingClient) {
                const random = Math.floor(Math.random() * 19000) + 1000
                const timer = setTimeout(() => {
                    const gender = Math.random() < 0.5 ? "MALE" : "FEMALE"
                    const filtered = gender === "MALE" ? clientMugshots.filter(e => e.includes("_m_")) : clientMugshots.filter(e => e.includes("_f_"))
                    const image = filtered[Math.floor(Math.random() * filtered.length)]

                    setWaitingClient({
                        present: true,
                        expectedAttractiveness: Math.round(Math.random() * 6),
                        preference: Math.random() < 0.5 ? "MALE" : "FEMALE",
                        gender,
                        mugshot: image
                    })
                    clientRef.current = new Audio("/sfx/client_arrived.m4a")
                    clientRef.current.play().catch()
                }, random)
                return () => {
                    clearTimeout(timer)
                    clientRef.current = null
                }
            }
        }
    }, [waitingClient, money, supplies])

    useEffect(() => {
        visit.forEach((v, i) => {
            if (!v && !inquiry[i] && clients[i] && dinedTables[i]) {
                if (clients[i] && hostesses[i]) {
                    setClients(prev => {
                        const updated = [...prev]
                        updated[i] = null
                        return updated
                    })
                    if (hostesses[i]) {
                        setHostesses(prev => {
                            const updated = [...prev]
                            updated[i] = null
                            return updated
                        })
                        setHostessesPanel(prev => {
                            const updated = [...prev]
                            const firstEmpty = updated.findIndex(h => h === null)
                            if (firstEmpty !== -1) {
                                updated[firstEmpty] = hostesses[i]
                            } else {
                                updated.push(hostesses[i])
                            }
                            return updated
                        })
                    }
                }
            }
        })
    }, [visit, inquiry, clients, hostesses, setClients, setHostesses, setHostessesPanel, dinedTables])

    const positioning = (i: number) => {
        switch (i) {
            case 0:
                return "col-start-1 row-start-2"
            case 1:
                return "col-start-2 row-start-1"
            case 2:
                return "col-start-3 row-start-2"
            case 3:
                return "col-start-4 row-start-1"
            case 4:
                return "col-start-5 row-start-2"
            case 5:
                return "col-start-6 row-start-1"
            case 6:
                return "col-start-1 row-start-1 invisible"
            case 7:
                return "col-start-1 row-start-1 invisible"
            default:
                return ""
        }
    }

    const tableUIPositioning = (i: number) => {
        switch (i) {
            case 0:
                return "-top-35"
            case 1:
                return "-bottom-35"
            case 2:
                return "-top-35"
            case 3:
                return "-bottom-35"
            case 4:
                return "-top-35"
            case 5:
                return "-bottom-35"
            case 6:
                return "-top-35"
            case 7:
                return "-bottom-35"
            default:
                return ""
        }
    }

    const ArrowPositioning = (i: number) => {
        switch (i) {
            case 0:
                return "top-30 rotate-90"
            case 1:
                return "bottom-30 -rotate-90"
            case 2:
                return "top-30 rotate-90"
            case 3:
                return "bottom-30 -rotate-90"
            case 4:
                return "top-30 rotate-90"
            case 5:
                return "bottom-30 -rotate-90"
            case 6:
                return "top-30 rotate-90"
            case 7:
                return "bottom-30 -rotate-90"
            default:
                return ""
        }
    }

    const TimePositioning = (i: number) => {
        switch (i) {
            case 0:
                return "bottom-30"
            case 1:
                return "top-30"
            case 2:
                return "bottom-30"
            case 3:
                return "top-30"
            case 4:
                return "bottom-30"
            case 5:
                return "top-30"
            case 6:
                return "bottom-30"
            case 7:
                return "top-30"
            default:
                return ""
        }
    }

    const InquiryHandler = (i: number, type: "Service" | "Buffet" | "End" | null, status: boolean) => {
        setVisit(prev => {
            const updated = [...prev]
            updated[i] = status
            return updated
        })
        setInquiry(prev => {
            const updated = [...prev]
            updated[i] = status
            return updated
        })
        setInquiryType(prev => {
            const updated = [...prev]
            updated[i] = type
            return updated
        })
        if (type === "Service") {
            setServiceType(prev => {
                const updated = [...prev]
                updated[i] = SERVICE_TYPES[Math.floor(Math.random() * SERVICE_TYPES.length)]
                return updated
            })
        }
    }

    return (
        <>
            <div
                className={`${waitingClient ? "opacity-100" : "opacity-25"} duration-300 ease-in-out absolute flex justify-center items-center -left-5 -bottom-5 z-3 text-pink-200`}>
                <Image src={"/images/entry.png"} alt={"Entry corridor"} height={200} width={255}/>
                <DraggableDoor waitingClient={waitingClient}/>
                {waitingClient && (
                    <h1 className={`${sourGummy.className} absolute top-5 text-pink-300 font-[700]`}>
                        A client has arrived!
                    </h1>
                )}
            </div>
            <div
                className="w-screen absolute top-[45%] -translate-y-1/2 flex justify-center items-center p-10 text-pink-200">
                <div className="grid grid-cols-6 grid-rows-2 gap-10 h-full w-full">
                    {items.map((_, i) => {
                        const getPositionImage = (i: number) => {
                            const hostess = hostesses[i]
                            const client = clients[i]

                            const genderClient = client?.gender[0].toLowerCase()
                            const genderHost = hostess?.gender[0].toLowerCase()

                            if (!visit[i] && dinedTables[i]) return "/images/service/position_empty_dined.png"

                            if (inquiry[i] && dinedTables[i]) return `/images/service/position_call_dined_${genderHost}_${genderClient}.png`

                            if (dinedTables[i] && hostess && client) return `/images/service/position_dined_${genderHost}_${genderClient}.png`

                            if (inquiry[i]) return `/images/service/position_call_${genderHost}_${genderClient}.png`

                            if (hostess && client) return `/images/service/position_full_${genderHost}_${genderClient}.png`

                            if (hostess) return `/images/service/position_hostess_${genderHost}.png`

                            if (client) return `/images/service/position_client_${genderClient}.png`

                            return "/images/service/position_empty.png"
                        }

                        return (
                            <div key={i}
                                 className={`${hostesses[i] || clients[i] ? "opacity-100" : "opacity-75"} duration-300 ease-in-out relative flex justify-center items-center p-4 ${positioning(i)}`}>
                                <div
                                    className={"absolute h-75 w-75 -z-1 flex"}/>
                                <div
                                    className={"absolute -z-1 w-80 h-80 bg-[radial-gradient(ellipse_at_center,_rgba(170,0,100,.8)_50%,_rgba(134,16,67,0)_70%,_rgba(134,16,67,0)_100%)]"}/>
                                <Image
                                    src={getPositionImage(i)}
                                    alt={"Meeting position"}
                                    height={424}
                                    width={528}
                                    className={"flex justify-center items-center"}
                                />
                                {!visit[i] && dinedTables[i] && (
                                    <button
                                        className={`absolute top-17.5 border-pink-300 hover:border-pink-500 border-2 p-2 rounded-[10] z-[100] text-pink-300 hover:text-pink-500 bg-pink-950/70 hover:bg-pink-300 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}
                                        onClick={() => {
                                            setDinedTables(prev => {
                                                const updated = [...prev]
                                                updated[i] = false
                                                return updated
                                            })
                                        }}>
                                        <BrushCleaning size={30}/>
                                    </button>
                                )}
                                <div
                                    className={`absolute w-55 flex flex-row justify-between items-center z-49 ${tableUIPositioning(i)}`}>
                                    <>
                                        <DroppableHostessTableSlot
                                            index={i}
                                            hostessAtTable={hostesses[i]}
                                            hostesses={hostesses}
                                            setHostesses={setHostesses}
                                            setHostessesPanel={setHostessesPanel}
                                            wiggleHostess={wiggleHostess}
                                            setWiggleHostess={setWiggleHostess}
                                            clients={clients}
                                            inquiryType={inquiryType}
                                            InquiryHandler={InquiryHandler}
                                        />
                                        {hostesses[i] && (
                                            <button
                                                onClick={() => {
                                                    setHostessesPanel(prev => {
                                                        const updated = [...prev]
                                                        const firstEmptyIndex = updated.findIndex(h => h === null)
                                                        if (firstEmptyIndex !== -1) {
                                                            updated[firstEmptyIndex] = hostesses[i]
                                                        } else {
                                                            updated.push(hostesses[i]!)
                                                        }
                                                        return updated
                                                    })
                                                    setHostesses(prev => {
                                                        const updated = [...prev]
                                                        updated[i] = null
                                                        return updated
                                                    })
                                                    InquiryHandler(i, null, false)
                                                }}
                                                className={"absolute -bottom-5 left-6.5 flex justify-center items-center bg-pink-900 hover:bg-pink-700 transition duration-200 ease-in-out rounded-[7] h-[25px] w-[50px] opacity-40 hover:opacity-100"}>
                                                <Wind size={20}/>
                                            </button>
                                        )}
                                    </>
                                    <DroppableClient index={i} clients={clients} setClients={setClients}
                                                     hostesses={hostesses}
                                                     InquiryHandler={InquiryHandler}
                                                     waitingClient={waitingClient} setWaitingClient={setWaitingClient}
                                                     inquiryType={inquiryType}
                                                     attractiveness={hostesses[i]?.attractiveness}/>
                                    {clients[i] && (
                                        <button onClick={() => {
                                            const updatedClients =
                                                [...clients]
                                            updatedClients[i] = null
                                            setClients(updatedClients)
                                            InquiryHandler(i, null, false)
                                        }}
                                                className={"absolute left-35.5 -bottom-5 flex justify-center items-center hover:bg-pink-950/70 transition duration-200 ease-in-out rounded-[7] h-[25px] w-[50px] opacity-40 hover:opacity-100"}>
                                            <Gavel size={20}/>
                                        </button>
                                    )}
                                    {visit[i] && (
                                        <div className={`absolute left-12.5 z-50 ${TimePositioning(i)}`}>
                                            <LoadingBar key={`loading-${i}-${barKeys[i]}`} duration={60000}
                                                        onComplete={() => setTimeout(() => InquiryHandler(i, "End", true), 0)}
                                                        paused={inquiry[i]}
                                                        onProgressChange={() => {
                                                            if (Math.random() < 0.002) {
                                                                setTimeout(() => InquiryHandler(i, "Service", true), 0)
                                                            }
                                                        }}/>
                                        </div>
                                    )}
                                    {inquiry[i] && (
                                        <div
                                            className={`absolute -top-5 -left-5 border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950/70 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 hover:shadow-pink-500`}
                                            onClick={() => {
                                                setInquiryTableId(i)
                                                setInquiryWindow(true)
                                            }}>
                                            {inquiryType[i] === "Service" && <HandHeart scale={25}/>}
                                            {inquiryType[i] === "Buffet" && <Martini scale={25}/>}
                                            {inquiryType[i] === "End" && <BookHeart scale={25}/>}
                                        </div>
                                    )}
                                    <div className={`absolute ${ArrowPositioning(i)} left-24 z-50`}>
                                        <Play size={30}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Interior
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
import {ServiceType, SERVICE_TYPES, Hostess} from "@/app/types";

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
    money: number
    supplies: number
}

const Interior = ({
                      hostesses,
                      setHostesses,
                      selectedHostess,
                      setSelectedHostess,
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
                      supplies
                  }: InteriorProps) => {
    const items = Array(8).fill(null)
    const [clients, setClients] = useState<boolean[]>(Array(8).fill(false))

    const [wiggleHostess, setWiggleHostess] = useState<boolean[]>(Array(8).fill(false))
    const [wiggleClient, setWiggleClient] = useState<boolean[]>(Array(8).fill(false))

    const [waitingClient, setWaitingClient] = useState<boolean>(false)
    const [selectedClient, setSelectedClient] = useState<boolean>(false)

    const clientRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if(supplies > 0 && money > 0){
            if (!waitingClient) {
                const random = Math.floor(Math.random() * 19000) + 1000
                const timer = setTimeout(() => {
                    setWaitingClient(true)
                    clientRef.current = new Audio("/sfx/client_arrived.m4a")
                    clientRef.current.play().catch(() => {
                    })
                }, random)
                return () => {
                    clearTimeout(timer)
                    clientRef.current = null
                }
            }
        }
    }, [waitingClient])

    useEffect(() => {
        visit.forEach((v, i) => {
            if (!v && !inquiry[i] && clients[i] && dinedTables[i]) {
                if (clients[i] && hostesses[i]) {
                    setClients(prev => {
                        const updated = [...prev]
                        updated[i] = false
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
            <div className={"absolute flex justify-center items-center -left-5 -bottom-5 z-3 text-pink-200"}>
                <Image src={"/images/entry.png"} alt={"Entry corridor"} height={200} width={255}/>
                <DraggableDoor waitingClient={waitingClient}/>
            </div>
            <div
                className="w-screen absolute top-[45%] -translate-y-1/2 flex justify-center items-center p-10 text-pink-200">
                <div className="grid grid-cols-6 grid-rows-2 gap-10 h-full w-full">
                    {items.map((_, i) => (
                        <div key={i}
                             className={`${hostesses[i] || clients[i] ? "opacity-100" : "opacity-75"} duration-300 ease-in-out relative flex justify-center items-center p-4 ${positioning(i)}`}>
                            <div
                                className={"absolute h-75 w-75 -z-1 flex bg-[radial-gradient(ellipse_at_center,_rgba(163,0,76,1)_50%,_rgba(134,16,67,1)_75%,_rgba(134,16,67,1)_100%)]"}/>
                            <Image
                                src={
                                    !visit[i] && dinedTables[i] ?
                                        "/images/position_empty_dined.png"
                                        : inquiry[i] && dinedTables[i]
                                            ? "/images/position_call_dined.png"
                                            : dinedTables[i] && hostesses[i] && clients[i]
                                                ? "/images/position_dined.png"
                                                : inquiry[i]
                                                    ? "/images/position_call.png"
                                                    : hostesses[i] && clients[i]
                                                        ? "/images/position_full.png"
                                                        : hostesses[i]
                                                            ? "/images/position_hostess.png"
                                                            : clients[i]
                                                                ? "/images/position_client.png"
                                                                : "/images/position_empty.png"
                                }
                                alt={"Meeting position"}
                                height={424}
                                width={528}
                                className={"flex justify-center items-center"}
                            />
                            {!visit[i] && dinedTables[i] && (
                                <button
                                    className={`absolute top-17.5 border-pink-300 hover:border-pink-500 border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950/70 hover:bg-pink-300 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}
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
                                                 hostesses={hostesses} setSelectedClient={setSelectedClient}
                                                 InquiryHandler={InquiryHandler} wiggleClient={wiggleClient}
                                                 setWaitingClient={setWaitingClient} inquiryType={inquiryType}/>
                                {clients[i] && (
                                    <button onClick={() => {
                                        const updatedClients =
                                            [...clients]
                                        updatedClients[i] = false
                                        setClients(updatedClients)
                                        InquiryHandler(i, null, false)
                                    }}
                                            className={"absolute left-35.5 -bottom-5 flex justify-center items-center hover:bg-pink-950/70 transition duration-200 ease-in-out rounded-[7] h-[25px] w-[50px] opacity-40 hover:opacity-100"}>
                                        <Gavel size={20}/>
                                    </button>
                                )}
                                {visit[i] && (
                                    <div className={`absolute left-12.5 z-50 ${TimePositioning(i)}`}>
                                        <LoadingBar key={`loading-${i}-${barKeys}`} duration={60000}
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
                    ))}
                </div>
            </div>
        </>
    )
}

export default Interior
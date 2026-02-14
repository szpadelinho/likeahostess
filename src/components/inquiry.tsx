import Image from "next/image";
import {
    ChefHat,
    Boxes,
    Cigarette,
    ScrollText,
    createLucideIcon,
    LucideIcon,
    DoorOpen,
    TimerReset,
    Gift,
    BanknoteX,
    Martini,
    Beer
} from "lucide-react";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {towelFolded, cupSaucer} from "@lucide/lab";
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DraggableItem, DroppableSlot} from "@/scripts/DNDItems";
import {Buffet, ServiceType, Hostess, Club, StoredClub, getPageStyle} from "@/app/types";
import {Session} from "next-auth";
import {
    handleExperienceTransaction, handleGameAction, handleHostessFatigueTransaction, handleInquiry,
    handleMoneyTransaction,
    handlePopularityTransaction,
    handleSuppliesTransaction
} from "@/lib/transactions";

const TowelFolded = createLucideIcon("TowelFolded", towelFolded)
const CupSaucer = createLucideIcon("CupSaucer", cupSaucer)

interface Props {
    buffet: Buffet[],
    onCloseModal: () => void,
    setDinedTables: (value: (((prevState: boolean[]) => boolean[]) | boolean[])) => void,
    inquiryTableId: number | null,
    inquiryType: ("Service" | "Buffet" | "End" | null)[],
    dinedTables: boolean[],
    setVisit: (value: (((prevState: boolean[]) => boolean[]) | boolean[])) => void,
    setInquiryWindow: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    setInquiryType: (value: (((prevState: ("Service" | "Buffet" | "End" | null)[]) => ("Service" | "Buffet" | "End" | null)[]) | ("Service" | "Buffet" | "End" | null)[])) => void,
    setInquiry: (value: (((prevState: boolean[]) => boolean[]) | boolean[])) => void,
    serviceType: (ServiceType | null)[],
    setServiceType: (value: (((prevState: (ServiceType | null)[]) => (ServiceType | null)[]) | (ServiceType | null)[])) => void,
    hostesses: (Hostess | null)[],
    setBarKeys: (value: (((prevState: number[]) => number[]) | number[])) => void,
    session: Session | null,
    clubData: StoredClub | null,
    setMoney: (value: (((prevState: number) => number) | number)) => void,
    setClub: (value: (((prevState: (Club | null)) => (Club | null)) | Club | null)) => void,
    setPopularity: (value: (((prevState: number) => number) | number)) => void,
    setExperience: (value: (((prevState: number) => number) | number)) => void,
    setSupplies: (value: (((prevState: number) => number) | number)) => void,
    setHostesses: Dispatch<SetStateAction<(Hostess | null)[]>>
}

export const Inquiry = ({
                            buffet,
                            onCloseModal,
                            setDinedTables,
                            inquiryTableId,
                            inquiryType,
                            dinedTables,
                            setVisit,
                            setInquiryType,
                            setInquiry,
                            serviceType,
                            hostesses,
                            setBarKeys,
                            session,
                            clubData,
                            setMoney,
                            setClub,
                            setPopularity,
                            setExperience,
                            setSupplies,
                            setHostesses
                        }: Props) => {
    const [wiggle, setWiggle] = useState<"Beverage" | "Meal" | ServiceType | null>(null)

    const beverages = buffet.filter(b => b.type === "Beverage")
    const meals = buffet.filter(b => b.type === "Meal")

    const [randomBeverageIndex, setRandomBeverageIndex] = useState(-1)
    const [randomMealIndex, setRandomMealIndex] = useState(-1)

    useEffect(() => {
        if (beverages.length > 0) {
            setRandomBeverageIndex(Math.floor(Math.random() * beverages.length))
        }
        if (meals.length > 0) {
            setRandomMealIndex(Math.floor(Math.random() * meals.length))
        }
    }, [beverages.length, meals.length])

    const randomBeverage = randomBeverageIndex >= 0.2 ? beverages[randomBeverageIndex] : null
    const randomMeal = randomMealIndex >= 0.2 ? meals[randomMealIndex] : null

    const [orderedBeverage, setOrderedBeverage] = useState<Buffet | null>(null)
    const [orderedMeal, setOrderedMeal] = useState<Buffet | null>(null)

    let orderSentence = "We will have "
    if (randomBeverage && randomMeal) {
        orderSentence += `some ${randomBeverage.name} and delicious ${randomMeal.name}, please.`
    } else if (randomBeverage) {
        orderSentence += `only ${randomBeverage.name}, please.`
    } else if (randomMeal) {
        orderSentence += `just ${randomMeal.name}, please.`
    } else {
        orderSentence = "Actually... never mind... I am so sorry."
    }

    const handleBeverageDrop = (id: string, correct: boolean) => {
        const beverage = beverages.find(b => b.id === id)
        if (beverage && correct) setOrderedBeverage(beverage)
    }

    const handleMealDrop = (id: string, correct: boolean) => {
        const meal = meals.find(m => m.id === id)
        if (meal && correct) setOrderedMeal(meal)
    }

    const serviceActions: { title: ServiceType, Icon: LucideIcon }[] = [
        {
            title: "towel",
            Icon: TowelFolded
        },
        {
            title: "ice",
            Icon: Boxes
        },
        {
            title: "ashtray",
            Icon: Cigarette
        },
        {
            title: "lady_glass",
            Icon: CupSaucer
        },
        {
            title: "guest_glass",
            Icon: Beer
        },
        {
            title: "menu",
            Icon: ScrollText
        },
    ]

    const endActions: { fun: () => void, Icon: LucideIcon }[] = [
        {
            fun: () => InquiryEndHandler("End", false, true),
            Icon: DoorOpen
        },
        {
            fun: () => InquiryEndHandler("End", false, false),
            Icon: BanknoteX
        },
        {
            fun: () => InquiryEndHandler("End", true, true),
            Icon: Gift
        },
        {
            fun: () => InquiryEndHandler("Extend", false, true),
            Icon: TimerReset
        },
    ]

    const isOrderCorrect = (() => {
        if (randomBeverage && randomMeal) {
            return (
                orderedBeverage?.id === randomBeverage.id &&
                orderedMeal?.id === randomMeal.id
            )
        }
        if (randomBeverage && !randomMeal) {
            return (
                orderedBeverage?.id === randomBeverage.id &&
                !orderedMeal
            )
        }
        if (!randomBeverage && randomMeal) {
            return (
                orderedMeal?.id === randomMeal.id &&
                !orderedBeverage
            )
        }
        if (!randomBeverage && !randomMeal) {
            return !orderedBeverage && !orderedMeal
        }
        return false
    })()

    const InquiryEndHandler = (type: "End" | "Extend", present: boolean, payment: boolean) => {
        handleGameAction({type: "INQUIRY_END", status: "ACTIVE"}).then()
        if (inquiryTableId !== null && hostesses[inquiryTableId] !== null && clubData) {
            if (present) {
                handleInquiry({setMoney, setPopularity, setExperience, setSupplies, setHostesses, hostessId: hostesses[inquiryTableId].id, clubId: clubData.id, type: "STOP", endOption: "PRESENT"}).then()
            }
            if (type === "End") {
                setVisit(prev => {
                    const updated = [...prev]
                    updated[inquiryTableId] = false
                    return updated
                })
                if (payment) {
                    handleInquiry({setMoney, setPopularity, setExperience, setSupplies, setHostesses, hostessId: hostesses[inquiryTableId].id, clubId: clubData.id, type: "STOP", endOption: "GOODBYE"}).then()
                }
            } else {
                const extensionChance = Math.random()
                if (extensionChance < 0.5) {
                    setVisit(prev => {
                        const updated = [...prev]
                        updated[inquiryTableId] = true
                        return updated
                    })
                    setBarKeys(prev => {
                        const updated = [...prev]
                        updated[inquiryTableId] += 1
                        return updated
                    })
                } else {
                    setVisit(prev => {
                        const updated = [...prev]
                        updated[inquiryTableId] = false
                        return updated
                    })
                }
                handleInquiry({setMoney, setPopularity, setExperience, setSupplies, setHostesses, hostessId: hostesses[inquiryTableId].id, clubId: clubData.id, type: "STOP", endOption: "EXTEND"}).then()
            }
            handleInquiry({setMoney, setPopularity, setExperience, setSupplies, setHostesses, hostessId: hostesses[inquiryTableId].id, clubId: clubData.id, type: "STOP", endOption: "COVER"}).then()
            inquiryClose(inquiryTableId)
        }
    }

    const InquiryServiceHandler = (type: ServiceType) => {
        if (inquiryTableId !== null && type === serviceType[inquiryTableId] && hostesses[inquiryTableId] !== null && clubData) {
            handleGameAction({type: "INQUIRY_START", status: "ACTIVE"}).then()
            handleInquiry({setMoney, setPopularity, setExperience, setSupplies, setHostesses, hostessId: hostesses[inquiryTableId].id, clubId: clubData.id, type: "SERVICE"}).then()
            inquiryClose(inquiryTableId)
        } else {
            setWiggle(type)
            setTimeout(() => {
                setWiggle(null)
            }, 200)
        }
    }

    const inquiryClose = (id: number) => {
        setInquiry(prev => {
            const updated = [...prev]
            updated[id] = false
            return updated
        })
        setInquiryType(prev => {
            const updated = [...prev]
            updated[id] = null
            return updated
        })
        onCloseModal()
    }

    const dealButtonText =
        !randomBeverage && !randomMeal
            ? "Walk off awkwardly"
            : "Seal the deal"

    return (
        <DndProvider backend={HTML5Backend}>
            <div
                className={"relative w-[1400px] h-[800px] gap-5 bg-[radial-gradient(ellipse_at_center,_rgba(150,20,70,1)_50%,_rgba(134,16,67,1)_75%,_rgba(150,50,100,1)_100%)] text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                {inquiryTableId !== null && inquiryType[inquiryTableId] === "Buffet" && (
                    <div className={"flex flex-row gap-40 justify-center items-center"}>
                        <div className={"flex flex-col justify-center items-center"}>
                            <div
                                className={"flex w-120 h-15 justify-center items-center flex-row rounded-[15] p-2 text-[16px]"}
                                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .2)'}}>
                                {orderSentence}
                            </div>
                            <div
                                className={"absolute left-97 bottom-60 flex flex-row gap-5 justify-center items-center"}>
                                {randomBeverage && (
                                    <DroppableSlot type={"beverage"} onDrop={handleBeverageDrop}
                                                   expectedId={randomBeverage.id}>
                                        <Martini size={50}/>
                                    </DroppableSlot>
                                )}
                                {randomMeal && (
                                    <DroppableSlot type={"meal"} onDrop={handleMealDrop} expectedId={randomMeal.id}>
                                        <ChefHat size={50}/>
                                    </DroppableSlot>
                                )}
                            </div>
                            <Image
                                src={"/images/hostess_buffet.png"}
                                alt={"Hostess is ordering"}
                                height={200}
                                width={700}/>
                        </div>
                        <div
                            className={"gap-5 bg-[radial-gradient(ellipse_at_center,_rgba(150,20,100,1)_0%,_rgba(134,16,67,1)_50%,_rgba(175,50,100,1)_100%)] text-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
                            style={{boxShadow: '0 0 25px rgba(0, 0, 0, .2)'}}>
                            <div className={"flex flex-col gap-5 p-3"}>
                                {randomBeverage && (
                                    <>
                                        <h1>Beverages</h1>
                                        <div className={"grid grid-cols-5 gap-5"}>
                                            {beverages.map((beverage, i) => (
                                                <div key={i} className={"relative group"}>
                                                    <DraggableItem item={beverage} type="beverage"/>
                                                    <span className={`absolute text-nowrap -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-pink-950 text-pink-200 rounded-[10] p-1 z-50`}>
                                                        {beverage.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {randomMeal && (
                                    <>
                                        <h1>Meals</h1>
                                        <div className={"grid grid-cols-5 gap-5"}>
                                            {meals.map((meal, i) => (
                                                <div key={i} className={"relative group"}>
                                                    <DraggableItem key={i} item={meal} type={"meal"}/>
                                                    <span className={`absolute text-nowrap -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-pink-950 text-pink-200 rounded-[10] p-1 z-50`}>
                                                        {meal.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {isOrderCorrect && (
                            <button
                                className={"absolute bottom-5 left-[69%] border-white border-2 rounded-[15] p-1 w-50 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}
                                onClick={() => {
                                    if (inquiryTableId !== null) {
                                        setDinedTables(prev => {
                                            const updated = [...prev]
                                            updated[inquiryTableId] = !(!randomBeverage && !randomMeal)
                                            return updated
                                        })
                                    }
                                    inquiryClose(inquiryTableId)
                                    if (hostesses[inquiryTableId] !== null && clubData) {
                                        handleGameAction({type: "INQUIRY_START", status: "ACTIVE"}).then()
                                        handleInquiry({setMoney, setPopularity, setExperience, setSupplies, setHostesses, hostessId: hostesses[inquiryTableId].id, clubId: clubData.id, mealId: randomMealIndex, beverageId: randomBeverageIndex, type: "START"}).then()
                                    }
                                }}>
                                {dealButtonText}
                            </button>
                        )}
                    </div>
                )}
                {inquiryTableId !== null && inquiryType[inquiryTableId] === "Service" && (
                    <div className={"flex flex-row items-center justify-center gap-30"}>
                        <div className={"flex flex-col items-center justify-center"}>
                            <div
                                className={"flex w-140 h-15 justify-center items-center flex-row bg-transparent rounded-[15] p-2 text-[16px]"}
                                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .2)'}}>
                                {`Looks like ${hostesses[inquiryTableId]?.name} ${hostesses[inquiryTableId]?.surname !== null ? hostesses[inquiryTableId]?.surname : ""} is calling you for a service assistance`}
                            </div>
                            <Image
                                src={`/images/hostess_service_${serviceType[inquiryTableId]}.png`}
                                alt={"Hostess is calling for a service"}
                                height={200}
                                width={700}
                            />
                        </div>
                        <div
                            className={"flex flex-col justify-center items-center rounded-[20] text-white font-[600]"}
                            style={{boxShadow: '0 0 25px rgba(0, 0, 0, .2)'}}>
                            <div className={"grid grid-cols-3 grid-rows-2 gap-10 p-3"}>
                                {serviceActions.map((action, i) => (
                                    <div key={i} className={"relative group"}>
                                        <button
                                            className={`flex justify-center items-center border-white border-2 rounded-[20] p-5 transition-all duration-200 ease-in-out transform active:scale-110 ${wiggle === action.title ? "!bg-red-600 !hover:bg-red-600 !active:bg-red-600" : "bg-pink-900 hover:bg-white hover:text-black"}`}
                                            onClick={() => {
                                                InquiryServiceHandler(action.title)
                                            }}>
                                            <action.Icon size={50}/>
                                        </button>
                                        <span className={`absolute text-nowrap -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-pink-950 text-pink-200 rounded-[10] p-1 z-50`}>
                                            {action.title.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {inquiryTableId !== null && inquiryType[inquiryTableId] === "End" && (
                    <div className={"flex flex-row gap-50 justify-center items-center"}>
                        <div className={"flex flex-col gap-20 bg-transparent justify-center items-center"}>
                            <div
                                className={"flex w-120 h-15 justify-center items-center flex-row rounded-[15] p-2 text-[16px]"}
                                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .2)'}}>
                                The visit is over. Please choose an option:
                            </div>
                            <Image
                                src={dinedTables[inquiryTableId] ? "/images/hostess_end.png" : "/images/hostess_end_dined.png"}
                                alt={"Hostess is ordering"}
                                height={200}
                                width={700}
                            />
                        </div>
                        <div
                            className={"flex bg-transparent text-center items-center justify-center rounded-[20] text-white font-[600]"}
                            style={{boxShadow: '0 0 25px rgba(0, 0, 0, .2)'}}>
                            <div className={"grid grid-cols-2 grid-rows-2 gap-10 p-3"}>
                                {endActions.map((action, i) => (
                                    <button
                                        key={i}
                                        className={"border-white bg-pink-900 border-2 rounded-[20] p-5 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}
                                        onClick={() => {
                                            action.fun()
                                        }}>
                                        <action.Icon size={50}/>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    )
}
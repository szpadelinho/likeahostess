import Image from "next/image";
import {
    BottleWine,
    ChefHat, ChevronDown,
    ChevronUp,
    JapaneseYen,
    UtensilsCrossed,
    Wine
} from "lucide-react";
import React, {Dispatch, useEffect, useState} from "react";
import {BuffetType} from "@prisma/client";

const SERVICE_TYPES = [
    "ashtray",
    "lady_glass",
    "guest_glass",
    "towel",
    "menu",
    "ice"
] as const

interface Hostess {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    attractiveness: number
    bio: string
}

interface Buffet{
    id: string
    name: string
    price: number
    description: string
    type: BuffetType
}

type ServiceType = typeof SERVICE_TYPES[number]

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
    hostesses: (Hostess | null)[]
}

export const Inquiry = ({
                            buffet,
                            onCloseModal,
                            setDinedTables,
                            inquiryTableId,
                            inquiryType,
                            dinedTables,
                            setVisit,
                            setInquiryWindow,
                            setInquiryType,
                            setInquiry,
                            serviceType,
                            setServiceType,
                            hostesses
                        }: Props) => {
    const [beverageIndex, setBeverageIndex] = useState(0)
    const [mealIndex, setMealIndex] = useState(0)

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

    const [selectedBeverage, setSelectedBeverage] = useState<Buffet | null>(null)
    const [selectedMeal, setSelectedMeal] = useState<Buffet | null>(null)

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

    const next = (setFn: Dispatch<React.SetStateAction<number>>, length: number) => {
        setFn((prev) => (prev + 1) % length)
    }

    const prev = (setFn: Dispatch<React.SetStateAction<number>>, length: number) => {
        setFn(
            (prev) => (prev - 1 + length) % length
        )
    }

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
        if (inquiryTableId !== null) {
            setVisit(prev => {
                const updated = [...prev]
                updated[inquiryTableId] = false
                return updated
            })
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
            onCloseModal()
            setInquiryWindow(false)
        }
    }

    const InquiryServiceHandler = (type: ServiceType)=> {
        if(inquiryTableId !== null && type === serviceType[inquiryTableId]){
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
            setInquiryType(prev => {
                const updated = [...prev]
                updated[inquiryTableId] = null
                return updated
            })
            onCloseModal()
            setInquiryWindow(false)
        }
        else{
            setWiggle(type)
            setTimeout(() => {
                setWiggle(null)
            }, 200);
        }
    }

    const dealButtonText =
        !randomBeverage && !randomMeal
            ? "Walk off awkwardly"
            : "Seal the deal"

    return (
        <div
            className={"relative w-[1400px] h-[800px] gap-5 bg-pink-700 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
            style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
            {inquiryTableId !== null && inquiryType[inquiryTableId] === "Buffet" && (
                <>
                    <div
                        className={"absolute top-20 left-30 flex w-120 h-15 justify-center items-center flex-row bg-pink-800 rounded-[15] p-2 text-[16px]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        {orderSentence}
                    </div>
                    <div className={"flex justify-center items-center relative"}>
                        <button
                            className={`absolute bottom-40 left-75 border-2 p-5 rounded-[15] z-50 text-pink-300 hover:text-pink-500 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500 ${wiggle === "Beverage" ? "scale-120 bg-red-600 hover:bg-red-600" : "scale-100 hover:bg-red-950"} ${orderedBeverage ? "bg-pink-600" : "bg-pink-950"}`}
                            onClick={() => {
                                if (selectedBeverage && selectedBeverage.id === randomBeverage?.id) {
                                    setOrderedBeverage(selectedBeverage);
                                    setSelectedBeverage(null);
                                } else {
                                    setWiggle("Beverage");
                                    setTimeout(() => {
                                        setWiggle(null);
                                    }, 200);
                                }
                            }}>
                            <BottleWine size={50}/>
                        </button>
                        <button
                            className={`absolute bottom-40 left-102 border-2 p-5 rounded-[15] z-50 text-pink-300 hover:text-pink-500 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500 ${wiggle === "Meal" ? "scale-120 bg-red-600 hover:bg-red-600" : "scale-100 hover:bg-red-950"} ${orderedMeal ? "bg-pink-600" : "bg-pink-950"}`}
                            onClick={() => {
                                if (selectedMeal && selectedMeal.id === randomMeal?.id) {
                                    setOrderedMeal(selectedMeal);
                                    setSelectedMeal(null);
                                } else {
                                    setWiggle("Meal");
                                    setTimeout(() => {
                                        setWiggle(null);
                                    }, 200);
                                }
                            }}>
                            <UtensilsCrossed size={50}/>
                        </button>
                        <Image
                            src={"/images/hostess_buffet.png"}
                            alt={"Hostess is ordering"}
                            height={200}
                            width={700}/>
                    </div>
                    <div
                        className={"gap-5 bg-pink-800 w-150 h-150 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        <div className={"flex flex-col h-full"}>
                            <div className={"flex flex-col h-[50%] justify-center items-center gap-10"}>
                                {beverages.length > 0 && (
                                    <>
                                        <div className={"flex flex-row items-center justify-center gap-5"}>
                                            <button
                                                className={`flex flex-row justify-center items-center rounded-[10] border-white border-2 p-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-pink-200 transition-all duration-200 ease-in-out active:scale-105 ${selectedBeverage ? "bg-red-950" : "bg-pink-900"}`}
                                                onClick={() => {
                                                    if (!selectedBeverage) {
                                                        setSelectedBeverage(beverages[beverageIndex]);
                                                        setSelectedMeal(null);
                                                    } else {
                                                        setSelectedBeverage(null);
                                                    }
                                                }}>
                                                <Wine size={30}/>
                                            </button>
                                            <div
                                                className={"flex w-80 justify-center items-center flex-row border-white border-2 rounded-[15] p-2 bg-pink-900"}>
                                                <p className={"w-60 flex flex-row justify-center items-center gap-2"}>{beverages[beverageIndex].name}</p>
                                                <p className={"w-20 flex flex-row justify-center items-center"}>
                                                    <JapaneseYen size={15}/>
                                                    {beverages[beverageIndex].price}
                                                </p>
                                            </div>
                                            <div className={"flex flex-col items-center justify-center"}>
                                                <button onClick={() => {
                                                    prev(setBeverageIndex, beverages.length);
                                                    setSelectedBeverage(null);
                                                }}
                                                        className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-y-3 scale-100 hover:scale-110"}>
                                                    <ChevronUp size={40}/>
                                                </button>
                                                <button onClick={() => {
                                                    next(setBeverageIndex, beverages.length);
                                                    setSelectedBeverage(null);
                                                }}
                                                        className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-y-3 scale-100 hover:scale-110"}>
                                                    <ChevronDown size={40}/>
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className={"flex w-120 h-15 justify-center items-center flex-row bg-pink-900 rounded-[15] p-2 text-[16px]"}>
                                            {beverages[beverageIndex].description}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={"flex flex-col h-[50%] justify-center items-center gap-10"}>
                                {meals.length > 0 && (
                                    <>
                                        <div className={"flex flex-row items-center justify-center gap-5"}>
                                            <button
                                                className={`flex flex-row justify-center items-center rounded-[10] border-white border-2 p-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-pink-200 transition-all duration-200 ease-in-out active:scale-105 ${selectedMeal ? "bg-red-950" : "bg-pink-900"}`}
                                                onClick={() => {
                                                    if (!selectedMeal) {
                                                        setSelectedMeal(meals[mealIndex]);
                                                        setSelectedBeverage(null);
                                                    } else {
                                                        setSelectedMeal(null);
                                                    }
                                                }}>
                                                <ChefHat size={30}/>
                                            </button>
                                            <div
                                                className={"flex w-80 justify-center items-center flex-row border-white border-2 rounded-[15] p-2 bg-pink-900"}>
                                                <p className={"w-60 flex flex-row justify-center items-center gap-2"}>{meals[mealIndex].name}</p>
                                                <p className={"w-20 flex flex-row justify-center items-center"}>
                                                    <JapaneseYen size={15}/>
                                                    {meals[mealIndex].price}
                                                </p>
                                            </div>
                                            <div className={"flex flex-col items-center justify-center"}>
                                                <button onClick={() => {
                                                    prev(setMealIndex, meals.length);
                                                    setSelectedMeal(null);
                                                }}
                                                        className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-y-3 scale-100 hover:scale-110"}>
                                                    <ChevronUp size={40}/>
                                                </button>
                                                <button onClick={() => {
                                                    next(setMealIndex, meals.length);
                                                    setSelectedMeal(null);
                                                }}
                                                        className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-y-3 scale-100 hover:scale-110"}>
                                                    <ChevronDown size={40}/>
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className={"flex w-120 h-15 justify-center items-center flex-row bg-pink-900 rounded-[15] p-2 text-[16px]"}>
                                            {meals[mealIndex].description}
                                        </div>
                                    </>
                                )}
                            </div>
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
                                onCloseModal()
                            }}>
                            {dealButtonText}
                        </button>
                    )}
                </>
            )}
            {inquiryTableId !== null && inquiryType[inquiryTableId] === "Service" && (
                <>
                    <div
                        className={"absolute top-20 left-30 flex w-120 h-15 justify-center items-center flex-row bg-pink-800 rounded-[15] p-2 text-[16px]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        {`${hostesses[inquiryTableId]?.name} ${hostesses[inquiryTableId]?.surname} is calling you for a service assistance`}
                    </div>
                    <Image
                        src={`/images/hostess_service_${serviceType[inquiryTableId]}.png`}
                        alt={"Hostess is calling for a service"}
                        height={200}
                        width={700}
                        className={"mt-25"}/>
                    <div
                        className={"bg-pink-800 w-150 h-175 text-center content-center items-center justify-center flex flex-col text-[20px] rounded-[20] text-white font-[600] gap-10"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        <button
                            className={`border-white border-2 rounded-[20] p-5 w-125 transition-all duration-200 ease-in-out transform active:scale-110 ${wiggle === "towel" ? "bg-red-600" : "bg-pink-900 hover:bg-white hover:text-black"}`}
                            onClick={() => {
                                InquiryServiceHandler("towel")
                            }}>
                            Give her a towel
                        </button>
                        <button
                            className={`border-white border-2 rounded-[20] p-5 w-125 transition-all duration-200 ease-in-out transform active:scale-110 ${wiggle === "ice" ? "bg-red-600" : "bg-pink-900 hover:bg-white hover:text-black"}`}
                            onClick={() => {
                                InquiryServiceHandler("ice")
                            }}>
                            Refill ice
                        </button>
                        <button
                            className={`border-white border-2 rounded-[20] p-5 w-125 transition-all duration-200 ease-in-out transform active:scale-110 ${wiggle === "lady_glass" ? "bg-red-600" : "bg-pink-900 hover:bg-white hover:text-black"}`}
                            onClick={() => {
                                InquiryServiceHandler("lady_glass")
                            }}>
                            Give a lady's glass
                        </button>
                        <button
                            className={`border-white border-2 rounded-[20] p-5 w-125 transition-all duration-200 ease-in-out transform active:scale-110 ${wiggle === "guest_glass" ? "bg-red-600" : "bg-pink-900 hover:bg-white hover:text-black"}`}
                            onClick={() => {
                                InquiryServiceHandler("guest_glass")
                            }}>
                            Give a guests glass
                        </button>
                        <button
                            className={`border-white border-2 rounded-[20] p-5 w-125 transition-all duration-200 ease-in-out transform active:scale-110 ${wiggle === "menu" ? "bg-red-600" : "bg-pink-900 hover:bg-white hover:text-black"}`}
                            onClick={() => {
                                InquiryServiceHandler("menu")
                            }}>
                            Hand over the menu
                        </button>
                        <button
                            className={`border-white border-2 rounded-[20] p-5 w-125 transition-all duration-200 ease-in-out transform active:scale-110 ${wiggle === "ashtray" ? "bg-red-600" : "bg-pink-900 hover:bg-white hover:text-black"}`}
                            onClick={() => {
                                InquiryServiceHandler("ashtray")
                            }}>
                            Clean the ashtray
                        </button>
                    </div>
                </>
            )}
            {inquiryTableId !== null && inquiryType[inquiryTableId] === "End" && (
                <>
                    <div
                        className={"absolute top-20 left-30 flex w-120 h-15 justify-center items-center flex-row bg-pink-800 rounded-[15] p-2 text-[16px]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        The visit is over. Please choose an option:
                    </div>
                    <Image
                        src={dinedTables[inquiryTableId] ? "/images/hostess_end.png" : "/images/hostess_end_dined.png"}
                        alt={"Hostess is ordering"}
                        height={200}
                        width={700}
                        className={"mt-25"}/>
                    <div
                        className={"bg-pink-800 w-150 h-150 text-center content-center items-center justify-center flex flex-col text-[20px] rounded-[20] text-white font-[600] gap-10"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        <button
                            className={"border-white bg-pink-900 border-2 rounded-[20] p-5 w-125 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}
                            onClick={() => {
                                InquiryEndHandler("End", false, true)
                            }}>
                            Thank the client and let him leave
                        </button>
                        <button
                            className={"border-white bg-pink-900 border-2 rounded-[20] p-5 w-125 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}
                            onClick={() => {
                                InquiryEndHandler("End", false, false)
                            }}>
                            Pay his tab
                        </button>
                        <button
                            className={"border-white bg-pink-900 border-2 rounded-[20] p-5 w-125 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}
                            onClick={() => {
                                InquiryEndHandler("End", true, true)
                            }}>
                            Give him a present
                        </button>
                        <button
                            className={"border-white bg-pink-900 border-2 rounded-[20] p-5 w-125 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}
                            onClick={() => {
                                InquiryEndHandler("Extend", false, true)
                            }}>
                            Offer another session
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
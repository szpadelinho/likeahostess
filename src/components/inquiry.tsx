import Image from "next/image";
import {
    BottleWine,
    ChefHat, ChevronDown,
    ChevronUp,
    JapaneseYen,
    UtensilsCrossed,
    Wine
} from "lucide-react";
import {BuffetType} from "@prisma/client";
import React, {Dispatch, useState} from "react";

interface Buffet {
    id: string
    name: string
    price: number
    description: string
    type: BuffetType
}

interface Props {
    buffet: Buffet[],
}

export const Inquiry = ({buffet}: Props) => {
    const [beverageIndex, setBeverageIndex] = useState(0)
    const [mealIndex, setMealIndex] = useState(0)

    const beverages = buffet.filter(b => b.type === "Beverage")
    const meals = buffet.filter(b => b.type === "Meal")

    const [randomBeverageIndex] = useState(
        () => (beverages.length > 0 ? Math.floor(Math.random() * (beverages.length + 1)) - 1 : -1)
    )

    const [randomMealIndex] = useState(
        () => (meals.length > 0 ? Math.floor(Math.random() * (meals.length + 1)) - 1 : -1)
    )

    const randomBeverage = randomBeverageIndex >= 0 ? beverages[randomBeverageIndex] : null
    const randomMeal = randomMealIndex >= 0 ? meals[randomMealIndex] : null

    const [selectedBeverage, setSelectedBeverage] = useState<Buffet | null>(null)
    const [selectedMeal, setSelectedMeal] = useState<Buffet | null>(null)

    const [orderedBeverage, setOrderedBeverage] = useState<Buffet | null>(null)
    const [orderedMeal, setOrderedMeal] = useState<Buffet | null>(null)

    let orderSentence = "We will have "
    if(randomBeverage && randomMeal){
        orderSentence += `some ${randomBeverage.name} and delicious ${randomMeal.name}, please.`
    }
    else if(randomBeverage){
        orderSentence += `only ${randomBeverage.name}, please.`
    }
    else if(randomMeal){
        orderSentence += `just ${randomMeal.name}, please.`
    }
    else{
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

    return (
        <div
            className={"relative w-[1400px] h-[800px] gap-5 bg-pink-700 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
            style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
            <div className={"absolute top-20 left-30 flex w-120 h-15 justify-center items-center flex-row bg-pink-800 rounded-[15] p-2 text-[16px]"}
                 style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                {orderSentence}
            </div>
            <div className={"flex justify-center items-center relative"}>
                <button
                    className={`absolute bottom-40 left-75 border-2 p-5 rounded-[15] z-50 text-pink-300 hover:text-pink-500 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500 ${orderedBeverage ? "bg-pink-600" : "bg-pink-950"}`}
                onClick={() => {
                    if(selectedBeverage && selectedBeverage.id === randomBeverage?.id){
                        setOrderedBeverage(selectedBeverage)
                        setSelectedBeverage(null)
                    }
                }}>
                    {orderedBeverage ? (
                        <div className={"flex relative"}>
                            <BottleWine size={50}/>
                        </div>
                    ) : (
                        <BottleWine size={50}/>
                    )}
                </button>
                <button
                    className={`absolute bottom-40 left-102 border-2 p-5 rounded-[15] z-50 text-pink-300 hover:text-pink-500 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500 ${orderedMeal ? "bg-pink-600" : "bg-pink-950"}`}
                onClick={() => {
                    if(selectedMeal && selectedMeal.id === randomMeal?.id){
                        setOrderedMeal(selectedMeal)
                        setSelectedMeal(null)
                    }
                }}>
                    {orderedMeal ? (
                        <div className={"flex relative"}>
                            <UtensilsCrossed size={50}/>
                        </div>
                    ) : (
                        <UtensilsCrossed size={50}/>
                    )}
                </button>
                <Image
                    src={"/images/hostess_buffet.png"}
                    alt={"Hostess is ordering"}
                    height={200}
                    width={700}
                />
            </div>
            <div
                className={"gap-5 bg-pink-800 w-150 h-150 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                <div className={"flex flex-col h-full"}>
                    <div className={"flex flex-col h-[50%] justify-center items-center gap-10"}>
                        {beverages.length > 0 && (
                            <>
                                <div className={"flex flex-row items-center justify-center gap-5"}>
                                    <button className={`flex flex-row justify-center items-center rounded-[10] border-white border-2 p-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-pink-200 transition-all duration-200 ease-in-out active:scale-105 ${selectedBeverage ? "bg-red-950" : "bg-pink-900"}`}
                                    onClick={() => {
                                        if(!selectedBeverage){
                                            setSelectedBeverage(beverages[beverageIndex])
                                        }
                                        else{
                                            setSelectedBeverage(null)
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
                                            prev(setBeverageIndex, beverages.length)
                                            setSelectedBeverage(null)
                                        }}
                                                className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-y-3 scale-100 hover:scale-110"}>
                                            <ChevronUp size={40}/>
                                        </button>
                                        <button onClick={() => {
                                            next(setBeverageIndex, beverages.length)
                                            setSelectedBeverage(null)
                                        }}
                                                className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-y-3 scale-100 hover:scale-110"}>
                                            <ChevronDown size={40}/>
                                        </button>
                                    </div>
                                </div>
                                <div className={"flex w-120 h-15 justify-center items-center flex-row bg-pink-900 rounded-[15] p-2 text-[16px]"}>
                                    {beverages[beverageIndex].description}
                                </div>
                            </>
                        )}
                    </div>
                    <div className={"flex flex-col h-[50%] justify-center items-center gap-10"}>
                        {meals.length > 0 && (
                            <>
                                <div className={"flex flex-row items-center justify-center gap-5"}>
                                    <button className={`flex flex-row justify-center items-center rounded-[10] border-white border-2 p-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-pink-200 transition-all duration-200 ease-in-out active:scale-105 ${selectedMeal ? "bg-red-950" : "bg-pink-900"}`}
                                    onClick={() => {
                                        if(!selectedMeal){
                                            setSelectedMeal(meals[mealIndex])
                                        }
                                        else {
                                            setSelectedMeal(null)
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
                                            prev(setMealIndex, meals.length)
                                            setSelectedMeal(null)
                                        }}
                                                className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-y-3 scale-100 hover:scale-110"}>
                                            <ChevronUp size={40}/>
                                        </button>
                                        <button onClick={() => {
                                            next(setMealIndex, meals.length)
                                            setSelectedMeal(null)
                                        }}
                                                className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-y-3 scale-100 hover:scale-110"}>
                                            <ChevronDown size={40}/>
                                        </button>
                                    </div>
                                </div>
                                <div className={"flex w-120 h-15 justify-center items-center flex-row bg-pink-900 rounded-[15] p-2 text-[16px]"}>
                                    {meals[mealIndex].description}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
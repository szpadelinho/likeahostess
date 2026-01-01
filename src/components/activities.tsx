import Image from "next/image";
import {HandHeart, JapaneseYen, PiggyBank, SkipBack, SkipForward} from "lucide-react";
import {useEffect, useState} from "react";
import {Activity, Club, coustard, Performer} from "@/app/types";
import {handleMoneyTransaction, handlePopularityTransaction} from "@/lib/transactions";
import {Session} from "next-auth";

interface Props {
    onCloseModal: () => void,
    performers: Performer[],
    selectedPerformer: Performer | null,
    setSelectedPerformer: (performer: Performer | null) => void,
    activities: Activity[],
    setSelectedActivity: (activity: Activity | null) => void,
    club: Club | null,
    isJamPlaying: boolean,
    setIsJamPlaying: (isJamPlaying: boolean) => void,
    setJamToggle: (jamToggle: boolean) => void,
    session: Session | null,
    clubData: Club | null,
    setPopularity: (value: (((prevState: number) => number) | number)) => void,
    setMoney: (value: (((prevState: number) => number) | number)) => void,
    setClub: (value: (((prevState: (Club | null)) => (Club | null)) | Club | null)) => void
}

const Activities = ({
                        onCloseModal,
                        performers,
                        selectedPerformer,
                        setSelectedPerformer,
                        activities,
                        setSelectedActivity,
                        club,
                        isJamPlaying,
                        setIsJamPlaying,
                        setJamToggle,
                        session,
                        clubData,
                        setPopularity,
                        setMoney,
                        setClub
                    }: Props) => {
    const [activityIndex, setActivityIndex] = useState(0)
    const isOnSale = club?.host?.surname === selectedPerformer?.surname
    const saleValue = isOnSale ? "text-pink-300 font-[700] text-shadow text-shadow-sm text-shadow-pink-600" : ""

    const performerActivities = selectedPerformer
        ? activities.filter((a) => a.performerId === selectedPerformer.id)
        : []

    const nextActivity = () => {
        setActivityIndex((prev) => (prev + 1) % performerActivities.length)
    }

    const prevActivity = () => {
        setActivityIndex(
            (prev) => (prev - 1 + performerActivities.length) % performerActivities.length
        )
    }

    const checkOwnership = (hostSurname?: string, performerSurname?: string, activityCost?: number) => {
        if (!hostSurname || !performerSurname || activityCost === undefined) return activityCost ?? 0
        return hostSurname === performerSurname ? activityCost * 0.5 : activityCost
    }

    useEffect(() => {
        setActivityIndex(0)
    }, [selectedPerformer])

    return (
        <div
            className={`w-screen h-180 text-center content-center justify-center items-start flex flex-row text-pink-200 z-51 gap-20`}>
            <div
                className={"gap-5 bg-[radial-gradient(ellipse_at_center,_rgba(150,20,70,1)_50%,_rgba(134,16,67,1)_75%,_rgba(150,50,100,1)_100%)] w-100 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-pink-200 font-[600]"}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                <div className={"w-full grid m-5 grid-cols-3 gap-5"}>
                    {performers.map((performer) => {
                        const isSelected = selectedPerformer?.id === performer.id

                        return (
                            <div
                                key={performer.id}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectedPerformer(null)
                                    } else {
                                        setSelectedPerformer(performer)
                                    }
                                }}
                                className={`flex justify-center items-center rounded-[20] border-pink-400 border-2 hover:bg-pink-950 hover:border-pink-600 hover:scale-105 active:scale-110 hover:text-black transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-rose-950 scale-105" : "bg-pink-950/50"}`}>
                                <Image src={performer.image} alt={`${performer.name} ${performer.surname} head shot`}
                                       height={100}
                                       width={100}
                                       className={"rounded-[20]"}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            {selectedPerformer ? (
                <div
                    className={"gap-5 bg-[radial-gradient(ellipse_at_center,_rgba(140,0,70,1)_50%,_rgba(134,16,67,1)_75%,_rgba(110,0,60,1)_100%)] w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-pink-200 font-[600] mr-35 transition-all duration-200 ease-in-out"}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <div className={"text-center content-center items-center justify-center flex flex-row gap-25"}>
                        <div className={"flex justify-center items-center flex-col"}>
                            <div className={"flex justify-center items-center flex-col max-w-175 gap-5"}>
                                <h1 className={`text-[75px] ${coustard.className}`}>{selectedPerformer.name} {selectedPerformer.surname}</h1>
                                <h1 className={"flex flex-row gap-2 text-rose-200 font-[400]"}>
                                    {performerActivities.map((a, index) => (
                                        <p key={index} className={"text-[10px]"}>
                                            {a.name}
                                        </p>
                                    ))}
                                </h1>
                                <h1>{selectedPerformer.bio}</h1>
                                <div className={"flex flex-row gap-20 text-[35px] text-pink-300"}>
                                    <p className={`flex flex-row justify-center items-center gap-3 ${saleValue}`}>
                                        <JapaneseYen size={35}/>
                                        {checkOwnership(club?.host?.surname, selectedPerformer?.surname, performerActivities[activityIndex]?.cost)}
                                        {isOnSale ? <PiggyBank size={35} className={"ml-1 "}/> : ""}
                                    </p>
                                    <p className={"flex flex-row justify-center items-center gap-3"}>
                                        <HandHeart size={35}/>
                                        {performerActivities[activityIndex].popularityGain}
                                    </p>
                                </div>
                            </div>
                            <div
                                className={"flex justify-center items-center flex-row absolute -bottom-15 left-190 text-[15px] bg-pink-950 p-3 rounded-[20] gap-3"}
                                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                                {performerActivities.length > 0 && activityIndex >= 0 && activityIndex < performerActivities.length && (
                                    <>
                                        <button onClick={prevActivity}
                                                className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-x-3 scale-100 hover:scale-110"}>
                                            <SkipBack/>
                                        </button>
                                        <div onClick={() => {
                                            onCloseModal()
                                            setJamToggle(isJamPlaying)
                                            setIsJamPlaying(false)
                                            setSelectedActivity(performerActivities[activityIndex])
                                            handlePopularityTransaction({
                                                session,
                                                clubData,
                                                setPopularity,
                                                setClub,
                                                change: performerActivities[activityIndex].popularityGain
                                            }).then()
                                            handleMoneyTransaction({
                                                session,
                                                clubData,
                                                setMoney,
                                                setClub,
                                                change: performerActivities[activityIndex].cost
                                            }).then()
                                        }}
                                             className={"flex justify-center items-center flex-row border-pink-200 border-2 rounded-[15] p-2 hover:bg-pink-950 hover:scale-102 active:scale-95 hover:text-pink-200 transition-all duration-200 ease-in-out"}>
                                            <p className={"w-100 flex flex-row justify-center items-center gap-2"}>{performerActivities[activityIndex].name}</p>
                                        </div>
                                        <button onClick={nextActivity}
                                                className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-x-3 scale-100 hover:scale-110"}>
                                            <SkipForward/>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={"flex justify-center items-center"}>
                            <Image src={selectedPerformer.cover}
                                   alt={`${selectedPerformer.name} ${selectedPerformer.surname} full body shot`}
                                   height={300} width={300}/>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={"gap-5 bg-transparent w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-pink-200 font-[600] mr-35 transition-all duration-200 ease-in-out transform active:scale-110"}>
                    <button
                        className={"flex justify-center items-center w-full h-full rounded-[20] transition-all duration-200 ease-in-out transform active:scale-110"}
                        onClick={() => {
                            onCloseModal()
                        }}>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Activities;
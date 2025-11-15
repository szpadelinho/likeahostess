import Image from "next/image";
import {HandHeart, JapaneseYen, PiggyBank, SkipBack, SkipForward} from "lucide-react";
import {useState} from "react";
import {Activity, Club, Performer} from "@/app/types";

interface Props {
    onCloseModal: () => void
    performers: Performer[]
    selectedPerformer: Performer | null;
    setSelectedPerformer: (performer: Performer | null) => void;
    activities: Activity[]
    setSelectedActivity: (activity: Activity | null) => void;
    club: Club | null
    isJamPlaying: boolean
    setIsJamPlaying: (isJamPlaying: boolean) => void;
    setJamToggle: (jamToggle: boolean) => void;
}

const Activities = ({onCloseModal, performers, selectedPerformer, setSelectedPerformer, activities, setSelectedActivity, club, isJamPlaying, setIsJamPlaying, setJamToggle}: Props) => {
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

    return (
        <div
            className={`w-screen h-180 text-center content-center justify-center items-start flex flex-row text-pink-200 z-51 gap-20`}>
            <div
                className={"gap-5 bg-[radial-gradient(ellipse_at_center,_rgba(150,20,70,1)_50%,_rgba(134,16,67,1)_75%,_rgba(150,50,100,1)_100%)] w-100 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-pink-200 font-[600]"}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                <div className={"w-full grid m-5 grid-cols-[repeat(3,auto)] gap-5"}>
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
                    <div className={"text-center content-center items-center justify-center flex flex-row gap-50"}>
                        <div className={"flex justify-center items-center flex-col"}>
                            <div className={"flex justify-center items-center flex-col max-w-150 gap-5"}>
                                <h1 className={"text-[50px]"}>{selectedPerformer.name} {selectedPerformer.surname}</h1>
                                <h1>{selectedPerformer.bio}</h1>
                            </div>
                            <div className={"flex justify-center items-center flex-row absolute -bottom-15 left-190 text-[15px] bg-pink-900 p-5 rounded-[20] gap-5"} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                                {performerActivities.length > 0 && activityIndex >= 0 && activityIndex < performerActivities.length && (
                                    <>
                                        <button onClick={prevActivity} className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-x-3 scale-100 hover:scale-110"}>
                                            <SkipBack/>
                                        </button>
                                        <div onClick={() => {
                                            onCloseModal()
                                            setJamToggle(isJamPlaying)
                                            setIsJamPlaying(false)
                                            setSelectedActivity(performerActivities[activityIndex])
                                        }}
                                             className={"flex justify-center items-center flex-row border-pink-200 border-2 rounded-[15] p-2 hover:bg-pink-950 hover:scale-105 active:scale-110 hover:text-pink-200 transition-all duration-200 ease-in-out active:scale-105"}>
                                            <p className={"w-100 flex flex-row justify-center items-center gap-2"}>{performerActivities[activityIndex].name}</p>
                                            <p className={`w-20 flex flex-row justify-center items-center ${saleValue}`}>
                                                <JapaneseYen size={15}/>
                                                {checkOwnership(club?.host?.surname, selectedPerformer?.surname, performerActivities[activityIndex]?.cost)}
                                                {isOnSale ? <PiggyBank size={15} className={"ml-1"}/> : ""}
                                            </p>
                                            <p className={"w-20 flex flex-row justify-center items-center gap-1"}><HandHeart size={15}/>{performerActivities[activityIndex].popularityGain}</p>
                                        </div>
                                        <button onClick={nextActivity} className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-x-3 scale-100 hover:scale-110"}>
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
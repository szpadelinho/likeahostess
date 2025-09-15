import Image from "next/image";
import {HandHeart, JapaneseYen, SkipBack, SkipForward, X} from "lucide-react";
import {Dispatch, SetStateAction, useState} from "react";

interface Props {
    onCloseModal: () => void
    performers: Performer[]
    selectedPerformer: Performer | null;
    setSelectedPerformer: (performer: Performer | null) => void;
    activities: Activity[]
    setSelectedActivity: (activity: Activity | null) => void;
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

const Activities = ({onCloseModal, performers, selectedPerformer, setSelectedPerformer, activities, setSelectedActivity}: Props) => {
    const [hover, setHover] = useState(false)
    const [activityIndex, setActivityIndex] = useState(0)

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

    return (
        <div
            className={`w-screen h-180 text-center content-center justify-center items-start flex flex-row text-white z-51 gap-20`}>
            <button onClick={() => {
                setSelectedPerformer(null)
                onCloseModal()
            }}
                    className={"absolute top-[-75] left-5 hover:cursor-pointer border-white border-2 rounded-[10] p-1 text-white hover:bg-white hover:text-black transition duration-200 ease-in-out"}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
            >
                <X size={35} color={hover ? "black" : "white"} strokeWidth={3}/>
            </button>
            <div
                className={"gap-5 bg-pink-700 w-100 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
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
                                className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-black transition duration-200 ease-in-out ${isSelected ? "bg-pink-900 shadow-white shadow-sm" : "bg-transparent"}`}>
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
                    className={"gap-5 bg-pink-700 w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600] mr-35 transition-all duration-200 ease-in-out"}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <div className={"text-center content-center items-center justify-center flex flex-row gap-50"}>
                        <div className={"flex justify-center items-center flex-col"}>
                            <div className={"flex justify-center items-center flex-col max-w-150 gap-5"}>
                                <h1 className={"text-[50px]"}>{selectedPerformer.name} {selectedPerformer.surname}</h1>
                                <h1>{selectedPerformer.bio}</h1>
                            </div>
                            <div className={"flex justify-center items-center flex-row absolute -bottom-15 left-190 text-[15px] bg-pink-900 p-5 rounded-[20] gap-5"} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                                {performerActivities.length > 0 && (
                                    <>
                                        <button onClick={prevActivity} className={"hover:text-pink-200 transition duration-200 ease-in-out scale-100 hover:scale-110"}>
                                            <SkipBack/>
                                        </button>
                                        <div onClick={() => {
                                            onCloseModal()
                                            setSelectedActivity(performerActivities[activityIndex])
                                        }}
                                             className={"flex justify-center items-center flex-row border-white border-2 rounded-[15] p-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-pink-200 transition duration-200 ease-in-out"}>
                                            <p className={"w-100 flex flex-row justify-center items-center gap-2"}>{performerActivities[activityIndex].name}</p>
                                            <p className={"w-15 flex flex-row justify-center items-center"}><JapaneseYen size={15}/>{performerActivities[activityIndex].cost}</p>
                                            <p className={"w-15 flex flex-row justify-center items-center gap-1"}><HandHeart size={15}/>{performerActivities[activityIndex].popularityGain}</p>
                                        </div>
                                        <button onClick={nextActivity} className={"hover:text-pink-200 transition duration-200 ease-in-out scale-100 hover:scale-110"}>
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
                    className={"gap-5 bg-transparent w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600] mr-35 transition-all duration-200 ease-in-out"}>
                    <button
                        className={"flex justify-center items-center w-full h-full rounded-[20]"}
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
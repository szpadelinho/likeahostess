import {
    BottleWine,
    CarTaxiFront,
    ClubIcon,
    Flower,
    HeartHandshake,
    IdCard,
    JapaneseYen,
    LogOut,
    MicVocal
} from "lucide-react";
import Image from "next/image";
import {Dispatch, SetStateAction} from "react";

type Club = {
    name: string,
    host: {
        name: string,
        surname: string,
        image: string
    },
    money: number,
    popularity: number
}

interface Hud {
    logOff: boolean
    setLogOff: Dispatch<SetStateAction<boolean>>
    selectionPrompt: boolean
    setSelectionPrompt: Dispatch<SetStateAction<boolean>>
    profile: boolean
    casino: boolean
    setCasino: Dispatch<SetStateAction<boolean>>
    setProfile: Dispatch<SetStateAction<boolean>>
    setManagement: Dispatch<SetStateAction<boolean>>
    setActivities: Dispatch<SetStateAction<boolean>>
    club: Club
}


const Hud = ({club, logOff, setLogOff, selectionPrompt, setSelectionPrompt, profile, setProfile, setManagement, setActivities, casino, setCasino}: Hud) => {
    return (
        <div
            className={"flex flex-row max-w-screen justify-between mb-10 ml-5 mr-5 items-end z-10"}>
            <div
                className={`bg-pink-500 w-130 h-40 text-center content-center items-center flex flex-row text-[20px] rounded-[20] text-white`}>
                <div className={"bg-[radial-gradient(circle_at_center,_#be185d_50%,_#9d174d_75%,_#831843_100%)] h-[130%] w-[40%] rounded-[20] flex justify-center relative"}>
                    <Image
                        className={"flex absolute bottom-[-80%]"}
                        src={club.host.image}
                        alt={"Host"}
                        height={500}
                        width={150}
                    />
                </div>
                <div className={"flex flex-row text-center justify-center content-center w-[60%] h-[100%] p-5"}>
                    <div className={"flex flex-col justify-center w-[60%]"}>
                        <h1 className={"text-[22px] font-[700]"}>{club.host.name} {club.host.surname}</h1>
                        <h2 className={"text-[18px] font-[600]"}>{club.name}</h2>
                    </div>
                    <div className={"flex flex-col justify-center w-[40%]"}>
                        <h2 className={"text-[20px] font-[400] flex flex-row justify-center items-center"}>
                            <JapaneseYen/>
                            <p>{club.money}</p>
                        </h2>
                        <h2 className={"flex flex-row text-[20px] font-[400] justify-center gap-1 content-center text-center items-center w-full"}>
                            <HeartHandshake/>
                            <p>{club.popularity}</p>
                        </h2>
                    </div>
                </div>
            </div>
            <div
                className={"gap-5 bg-pink-500 p-3 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[15] text-white font-[600]"}>
                <div className={"flex content-center justify-center items-center flex-row gap-2"}>
                    <button
                        className={"border-white border-2 rounded-[12] p-2 cursor-zoom-in text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}
                        onClick={() => {
                            setManagement(true)
                        }}
                    >
                        <Flower/>
                    </button>
                    <button
                        className={"border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}
                        onClick={() => {
                            setActivities(true)
                        }}
                    >
                        <MicVocal/>
                    </button>
                </div>
                <div className={"flex content-center justify-center items-center flex-row gap-2"}>
                    <button
                        className={"border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}
                        onClick={() => {
                            if(casino){
                                setCasino(false)
                            }
                            else{
                                setCasino(true)
                            }
                        }}
                    >
                        <ClubIcon/>
                    </button>
                    <button
                        className={"border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}
                        onClick={() => {
                            if(profile){
                                setProfile(false)
                            }
                            else{
                                setProfile(true)
                            }
                        }}
                    >
                        <IdCard/>
                    </button>
                    <button
                        className={"border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}
                        onClick={() => {
                            if(profile){
                                setProfile(false)
                            }
                            else{
                                setProfile(true)
                            }
                        }}
                    >
                        <BottleWine/>
                    </button>
                </div>
                <div className={"flex content-center justify-center gap-2"}>
                    <button
                        onClick={() => {
                            if (logOff) {
                                setLogOff(false)
                            }
                            if (selectionPrompt) {
                                setSelectionPrompt(false)
                            } else {
                                setSelectionPrompt(true)
                            }
                        }}
                        className={"border-white border-2 rounded-[12] p-2 cursor-wait hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                        <CarTaxiFront/></button>
                    <button onClick={() => {
                        if (selectionPrompt) {
                            setSelectionPrompt(false)
                        }
                        if (logOff) {
                            setLogOff(false)
                        } else {
                            setLogOff(true)
                        }
                    }}
                            className={"border-white border-2 rounded-[12] p-2 cursor-alias hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                        <LogOut/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hud
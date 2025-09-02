import {CarTaxiFront, HeartHandshake, LogOut} from "lucide-react";
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
    setManagement: Dispatch<SetStateAction<boolean>>
    club: Club
}


const Hud = ({club, logOff, setLogOff, selectionPrompt, setSelectionPrompt, setManagement}: Hud) => {
    return (
        <div
            className={"flex flex-row max-w-screen justify-between mb-10 ml-5 mr-5 items-end z-10"}>
            <div
                className={`bg-pink-500 w-130 h-40 text-center content-center items-center flex flex-row text-[20px] rounded-[20] text-white`}>
                <div className={"bg-pink-700 h-[130%] w-[40%] rounded-[20] flex justify-center relative"}>
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
                        <h2 className={"text-[20px] font-[400]"}>¥{club.money}</h2>
                        <h2 className={"flex flex-row text-[20px] font-[400] justify-center gap-1 content-center text-center items-center w-full"}>
                            <HeartHandshake/>
                            <p>{club.popularity}</p>
                        </h2>
                    </div>
                </div>
            </div>
            <div
                className={"gap-5 bg-pink-500 w-60 h-30 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}>
                <div className={"flex content-center justify-center flex-col gap-2"}>
                    <button
                        className={"border-white border-2 rounded-[10] p-2 cursor-zoom-in text-[15px] w-30 hover:bg-white hover:text-black transition duration-200 ease-in-out"}
                        onClick={() => {
                            setManagement(true)
                        }}
                    >Management
                    </button>
                    <button
                        className={"border-white border-2 rounded-[10] p-2 cursor-copy text-[15px] w-30 hover:bg-white hover:text-black transition duration-200 ease-in-out"}>Activities
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
                        className={"border-white border-2 rounded-[10] p-1 cursor-wait hover:bg-white hover:text-black transition duration-200 ease-in-out"}>
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
                            className={"border-white border-2 rounded-[10] p-1 cursor-alias hover:bg-white hover:text-black transition duration-200 ease-in-out"}>
                        <LogOut/></button>
                </div>
            </div>
        </div>
    )
}

export default Hud
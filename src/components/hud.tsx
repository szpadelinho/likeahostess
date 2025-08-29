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
    setLogOff: Dispatch<SetStateAction<boolean>>
    setSelectionPrompt: Dispatch<SetStateAction<boolean>>
    club: Club
}


const Hud = ({club, setLogOff, setSelectionPrompt}: Hud) => {
    return (
        <div className={"flex flex-row max-w-screen justify-between m-5"}>
            <div
                className={`bg-pink-500 w-130 h-40 text-center content-center items-center flex flex-row text-[20px] rounded-[10] text-white`}>
                <div className={"bg-pink-700 h-[130%] w-[40%] rounded-[10%]"}>
                    <Image
                        className={"flex transform translate-y-[-30%] justify-center content-center"}
                        src={club.host.image}
                        alt={"Host"}
                        height={200}
                        width={125}
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
                className={"gap-5 bg-pink-500 w-60 h-30 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[10] text-white font-[600]"}>
                <div className={"flex content-center justify-center flex-col gap-2"}>
                    <button
                        className={"border-white border-2 rounded-[5] p-2 cursor-zoom-in text-[15px] w-30"}>Management
                    </button>
                    <button className={"border-white border-2 rounded-[5] p-2 cursor-copy text-[15px] w-30"}>Activities
                    </button>
                </div>
                <div className={"flex content-center justify-center gap-2"}>
                    <button
                        onClick={() => {
                            setSelectionPrompt(true)
                        }}
                        className={"border-white border-2 rounded-[5] p-1 cursor-wait"}><CarTaxiFront/></button>
                    <button onClick={() => {
                        setLogOff(true)
                    }} className={"border-white border-2 rounded-[5] p-1 cursor-alias"}><LogOut/></button>
                </div>
            </div>
        </div>
    )
}

export default Hud
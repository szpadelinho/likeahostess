import {
    HeartHandshake,
    JapaneseYen,
    Menu,
} from "lucide-react";
import Image from "next/image";
import {Dispatch, SetStateAction, useState} from "react";
import {MenuModal} from "@/components/menuModal";

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
    const [menu, setMenu] = useState<boolean>(false)
    const [closing, setClosing] = useState<boolean>(false)

    const handleClick = () => {
        setClosing(true)
        setTimeout(() => {
            setMenu(!menu)
            setClosing(false)
        }, 300)
    }

    return (
        <>
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
                    className={"bg-pink-500 p-2 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[17] text-white font-[600]"}>
                    <button
                        className={"bg-pink-600 border-white border-2 p-3 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[15] text-white font-[600] duration-300 ease-in-out hover:bg-white hover:text-black"}
                        onClick={() => {
                            setClosing(true)
                            setTimeout(() => {
                                setMenu(!menu)
                                setClosing(false)
                            }, 0)
                        }}>
                        <Menu size={50}/>
                    </button>
                </div>
            </div>
            {(menu || closing) && (
                <MenuModal handleClick={handleClick} menu={menu} closing={closing} logOff={logOff} setLogOff={setLogOff} selectionPrompt={selectionPrompt} setSelectionPrompt={setSelectionPrompt} profile={profile} setProfile={setProfile} setManagement={setManagement} setActivities={setActivities} casino={casino} setCasino={setCasino}/>
            )}
        </>
    )
}

export default Hud
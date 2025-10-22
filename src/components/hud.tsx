import {
    HeartHandshake,
    JapaneseYen,
    Menu,
} from "lucide-react";
import Image from "next/image";
import {Dispatch, SetStateAction, useState} from "react";
import {MenuModal} from "@/components/menuModal";
import {Yesteryear} from "next/font/google";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

type Club = {
    name: string
    host: {
        name: string
        surname: string
        image: string
    },
    money: number
    popularity: number
    logo: string
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
    setActivities: Dispatch<SetStateAction<boolean>>
    club: Club
    setManagement: Dispatch<SetStateAction<boolean>>
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
                className={`flex flex-row justify-between items-end z-10 p-5 w-screen h-70 relative`}>
                <button
                    className={`-translate-y-210 h-[68px] w-[68px] bg-pink-800 border-pink-200 border-2 p-3 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[15] text-pink-200 duration-300 ease-in-out hover:bg-pink-200 hover:text-pink-950`}
                    onClick={() => {
                        setClosing(true)
                        setTimeout(() => {
                            setMenu(!menu)
                            setClosing(false)
                        }, 0)
                    }}>
                    <Menu size={30}/>
                </button>
                <div
                    className={`text-center items-center flex flex-row text-[20px] rounded-[20] text-pink-200 absolute bottom-5 right-15`}>
                    <div className={"flex flex-col text-center justify-center"}>
                        <h1 className={`absolute left-60 -top-35 text-nowrap rotate-90 text-[50px] opacity-50 ${yesteryear.className}`}>
                            {club.host.name} {club.host.surname}
                        </h1>
                        <div className={`flex flex-row justify-center items-center gap-3 opacity-50 relative ${yesteryear.className}`}>
                            <Image
                                className={"object-contain absolute left-1/2 -translate-x-[50%] bottom-7.5 z-9"}
                                src={club.logo}
                                alt={"Logo"}
                                height={100}
                                width={150}
                            />
                            <h2 className={"text-[20px] font-[400] flex flex-row justify-center items-center z-10"}>
                                <JapaneseYen/>
                                <p>{club.money}</p>
                            </h2>
                            <h2 className={"flex flex-row text-[20px] font-[400] justify-center gap-1 items-center z-10"}>
                                <HeartHandshake/>
                                <p>{club.popularity}</p>
                            </h2>
                        </div>
                    </div>
                    <div className={"rounded-[20] flex justify-center w-40"}>
                        <Image
                            className={"flex absolute -bottom-50"}
                            src={club.host.image}
                            alt={"Host"}
                            height={500}
                            width={150}
                        />
                    </div>
                </div>
            </div>
            {(menu || closing) && (
                <MenuModal handleClick={handleClick} menu={menu} closing={closing} logOff={logOff} setLogOff={setLogOff} selectionPrompt={selectionPrompt} setSelectionPrompt={setSelectionPrompt} profile={profile} setProfile={setProfile} setManagement={setManagement} setActivities={setActivities} casino={casino} setCasino={setCasino}/>
            )}
        </>
    )
}

export default Hud
import {PanelBottomClose, PanelBottomOpen} from "lucide-react";
import {useState} from "react";
import {DroppableHostessSlot} from "@/scripts/DNDItems";

interface Hostess {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    attractiveness: number
    bio: string
}

interface Props {
    hostesses: (Hostess | null)[],
    setHostesses: (newState: (Hostess | null)[]) => void,
    selectedHostess: Hostess | null,
    setSelectedHostess: (hostess: Hostess | null) => void,
    setHostessesManagement: (fn: (prev: Hostess[]) => Hostess[]) => void,
    window: "Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null,
    setWindow: (value: (((prevState: ("Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null)) => ("Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null)) | "Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null)) => void
}

const HostessPanel = ({
                          hostesses,
                          setHostesses,
                          setHostessesManagement,
                          selectedHostess,
                          setSelectedHostess,
                          window,
                          setWindow
                      }: Props) => {
    const visibilityIndexSetter = window === "Management" ? "z-[999]" : "z-11"
    const [hidden, setHidden] = useState<boolean>(false)

    return (
        <div
            className={`${visibilityIndexSetter} ${hidden && "translate-y-35"} duration-500 ease-in-out bg-pink-700 text-center items-center justify-center flex flex-row text-[20px] rounded-[25] text-white font-[600] absolute bottom-5 left-1/2 -translate-x-[50%]`}>
            <div className={"flex justify-center items-center m-2 gap-5"}>
                {hostesses?.map((_, index) => (
                    <DroppableHostessSlot
                        key={index}
                        index={index}
                        hostesses={hostesses}
                        setHostesses={setHostesses}
                        setHostessesManagement={setHostessesManagement}
                        selectedHostess={selectedHostess}
                        setSelectedHostess={setSelectedHostess}
                        setWindow={setWindow}
                    />
                ))}
                <button
                    className={`absolute ${hidden ? "-translate-y-18" : "translate-y-16"} flex justify-center items-center bg-pink-900 hover:bg-pink-700 transition duration-200 ease-in-out rounded-[7] h-[25px] w-[50px] transform active:scale-110`}
                    onClick={() => setHidden(!hidden)}>
                    {hidden ? <PanelBottomOpen size={20}/> : <PanelBottomClose size={20}/>}
                </button>
            </div>
        </div>
    )
}

export default HostessPanel
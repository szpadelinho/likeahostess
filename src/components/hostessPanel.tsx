import Image from "next/image"
import {EyeClosed, HeartPlus} from "lucide-react";
import {Dispatch, SetStateAction} from "react";

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
    management: boolean,
    hostesses: (Hostess | null)[],
    setHostesses: (newState: (Hostess | null)[]) => void,
    selectedHostess: Hostess | null
    setSelectedHostess: (hostess: Hostess | null) => void
    setHostessesManagement: (fn: (prev: Hostess[]) => Hostess[]) => void
    setManagement: Dispatch<SetStateAction<boolean>>
}

const HostessPanel = ({
                          management,
                          hostesses,
                          setHostesses,
                          setHostessesManagement,
                          selectedHostess,
                          setSelectedHostess,
                          setManagement
                      }: Props) => {
    const visibilityIndexSetter = management ? "z-[100]" : "z-10"

    return (
        <div className={"flex relative w-screen"}>
            <div
                className={`${visibilityIndexSetter} bg-pink-700 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600] absolute left-150 bottom-10 max-w-[1012px]`}>
                <div className={"flex justify-center items-center m-2 gap-5"}>
                    {hostesses?.map((hostess, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    if (!selectedHostess && hostess) {
                                        setSelectedHostess(hostess)
                                    }
                                    else if (selectedHostess) {
                                        const updated = [...hostesses]
                                        const fromIndex = hostesses.findIndex(h => h?.id === selectedHostess.id)
                                        const targetHostess = updated[index]
                                        if (fromIndex !== -1) {
                                            if (fromIndex !== index) {
                                                if (targetHostess) {
                                                    updated[fromIndex] = targetHostess
                                                } else {
                                                    updated[fromIndex] = null
                                                }
                                            }
                                        }
                                        updated[index] = selectedHostess
                                        setHostesses(updated)
                                        setSelectedHostess(null)
                                        setHostessesManagement(prev =>
                                            prev.filter(h => h.id !== selectedHostess.id)
                                        )
                                    }
                                }}
                                className={"flex justify-center items-center rounded-[20] border-white border-2 transition duration-200 ease-in-out transform active:scale-105"}>
                                {hostess ? (
                                    <div
                                        className={"flex justify-center items-center flex-col"}>
                                        <div className={"absolute bottom-[-20]"}>
                                            <button
                                                onClick={(e) => {
                                                    if (hostess) {
                                                        e.stopPropagation()
                                                        const updatedHostessPanel = [...hostesses]
                                                        updatedHostessPanel[index] = null
                                                        setHostesses(updatedHostessPanel)
                                                        setHostessesManagement(prev => [...prev, hostess].sort((a, b) => Number(a.id) - Number(b.id)))
                                                    }
                                                }}
                                                className={"flex justify-center items-center bg-pink-900 hover:bg-pink-700 transition duration-200 ease-in-out rounded-[7] h-[25px] w-[50px] transform active:scale-110"}>
                                                <EyeClosed size={20}/>
                                            </button>
                                        </div>
                                        <Image src={hostess.image} alt={""} height={100} width={100}
                                               className={`rounded-[20]  hover:bg-pink-950 hover:text-black transition duration-200 ease-in-out hover:shadow-sm hover:shadow-white ${selectedHostess?.id === hostess.id ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}/>
                                    </div>
                                ) : (
                                    <div
                                        className={`w-[100px] h-[100px] flex justify-center items-center text-white ${selectedHostess ? "hover:bg-white hover:text-black" : "hover:bg-pink-800 hover:text-pink-300"} transition duration-200 ease-in-out rounded-[18]`}>
                                        <button
                                            className={"flex justify-center items-center w-full h-full rounded-[20] transform active:scale-110"}
                                            onClick={() => {
                                                if(!selectedHostess) {
                                                    setManagement(true)
                                                }
                                            }}>
                                            <HeartPlus/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default HostessPanel
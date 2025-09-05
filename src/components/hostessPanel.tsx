import Image from "next/image"
import {HeartPlus} from "lucide-react";

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
    setSelectedHostess: (hostess: null) => void
}

const HostessPanel = ({management, hostesses, setHostesses, selectedHostess, setSelectedHostess}: Props) => {
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
                                    if (selectedHostess) {
                                        const updated = [...hostesses]
                                        updated[index] = selectedHostess
                                        setHostesses(updated)
                                        setSelectedHostess(null)
                                    }
                                }}
                                className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                                {hostess ? (
                                    <Image src={hostess.image} alt={""} height={100} width={100}
                                           className={"rounded-[20] bg-pink-900 hover:bg-pink-950 hover:text-black transition duration-200 ease-in-out hover:shadow-sm hover:shadow-white"}/>
                                ) : (
                                    <div
                                        className="w-[100px] h-[100px] flex justify-center items-center text-white hover:bg-white hover:text-black transition duration-200 ease-in-out rounded-[15]">
                                        <HeartPlus/>
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
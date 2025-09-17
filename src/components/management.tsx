import Image from "next/image";
import {Candy, X} from "lucide-react";
import {useState} from "react";

interface Props {
    onCloseModal: () => void
    hostesses: Hostess[]
    selectedHostess: Hostess | null
    setSelectedHostess: (hostess: Hostess | null) => void
}

interface Hostess {
    id: string
    name: string
    surname?: string
    image: string
    cover: string
    attractiveness: number
    bio: string
}

const Management = ({onCloseModal, hostesses, selectedHostess, setSelectedHostess}: Props) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            className={`w-screen h-180 text-center content-center justify-center items-start flex flex-row text-white z-51 gap-20`}>
            <button onClick={() => {
                setSelectedHostess(null)
                onCloseModal()
            }}
                    className={"absolute top-[-75] left-5 hover:cursor-pointer border-white border-2 rounded-[10] p-1 text-white hover:bg-white hover:text-black transition duration-200 ease-in-out hover:"}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
            >
                <X size={35} color={hover ? "black" : "white"} strokeWidth={3}/>
            </button>
            <div
                className={"gap-5 bg-pink-700 w-100 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                <div className={"w-full grid m-5 grid-cols-[repeat(3,auto)] gap-5"}>
                    {hostesses.map((hostess) => {
                        const isSelected = selectedHostess?.id === hostess.id

                        return (
                            <div
                                key={hostess.id}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectedHostess(null)
                                    } else {
                                        setSelectedHostess(hostess)
                                    }
                                }}
                                className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-black transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                                <Image src={hostess.image} alt={`${hostess.name} ${hostess.surname} head shot`}
                                       height={100}
                                       width={100}
                                       className={"rounded-[20]"}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            {selectedHostess ? (
                <div
                    className={"gap-5 bg-pink-700 w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600] mr-35 transition-all duration-200 ease-in-out"}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <div className={"text-center content-center items-center justify-center flex flex-row gap-50"}>
                        <div className={"flex justify-center items-center flex-col max-w-150 gap-5"}>
                            <h1 className={"text-[50px]"}>{selectedHostess.name} {selectedHostess.surname}</h1>
                            <h1 className={"flex flex-row justify-center items-center gap-2"}>
                                <Candy/>{selectedHostess.attractiveness}/5
                            </h1>
                            <h1>{selectedHostess.bio}</h1>
                        </div>
                        <div className={"flex justify-center items-center"}>
                            <Image src={selectedHostess.cover}
                                   alt={`${selectedHostess.name} ${selectedHostess.surname} full body shot`}
                                   height={300} width={300}/>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className={"gap-5 bg-transparent w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600] mr-35 transition-all duration-200 ease-in-out transform active:scale-110"}>
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

export default Management;
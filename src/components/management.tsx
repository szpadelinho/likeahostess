import Image from "next/image";
import {
    Candy,
    Zap,
    Flame,
    Droplet, Snowflake, PlugZap
} from "lucide-react";
import {DraggableHostess} from "@/scripts/DNDItems";
import {Hostess, marckScript} from "@/app/types";

interface Props {
    onCloseModal: () => void
    hostesses: Hostess[]
    selectedHostess: Hostess | null
    setSelectedHostess: (hostess: Hostess | null) => void
}

const Management = ({onCloseModal, hostesses, selectedHostess, setSelectedHostess}: Props) => {
    return (
        <div
            onClick={onCloseModal}
            className={`text-center content-center justify-center items-start flex flex-row text-pink-200 z-51 gap-20`}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={"gap-5 bg-[radial-gradient(ellipse_at_center,_rgba(150,20,70,1)_50%,_rgba(134,16,67,1)_75%,_rgba(150,50,100,1)_100%)] w-100 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-pink-200 font-[600]"}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                <div className={"w-full m-5 grid grid-cols-3 gap-5 max-h-[465px] overflow-y-auto p-2"}>
                    {hostesses.map((hostess) => (
                        <DraggableHostess key={hostess.id} hostess={hostess} source={"management"} selectedHostess={selectedHostess} setSelectedHostess={setSelectedHostess}/>
                    ))}
                </div>
            </div>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`${selectedHostess ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} gap-5 bg-[radial-gradient(ellipse_at_center,_rgba(140,0,70,1)_50%,_rgba(134,16,67,1)_75%,_rgba(110,0,60,1)_100%)] w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-pink-200 font-[600] mr-35 transition-all duration-200 ease-in-out`}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                {selectedHostess && (
                    <div className={"text-center content-center items-center justify-center flex flex-row gap-25"}>
                        <div className={"flex justify-center items-center flex-col max-w-175 gap-5"}>
                            <h1 className={`text-[100px] ${marckScript.className}`}>{selectedHostess.name} {selectedHostess.surname}</h1>
                            <div className={"flex justify-center items-center flex-row gap-10"}>
                                <h1 className={"flex flex-col justify-center items-center gap-2"}>
                                    <p>
                                        Attractiveness
                                    </p>
                                    <p className={"flex flex-row justify-center items-center gap-2"}>
                                        <Candy/>{selectedHostess.attractiveness}/5
                                    </p>
                                </h1>
                                <h1 className={"flex flex-col justify-center items-center gap-2"}>
                                    <p>
                                        Fatigue
                                    </p>
                                    <p className={`${selectedHostess.fatigue >= 100 && "text-pink-400 font-[700]"} flex flex-row justify-center items-center gap-2`}>
                                        {selectedHostess.fatigue < 10 ? <Zap/>
                                            : selectedHostess.fatigue >= 11 && selectedHostess.fatigue < 25 ? <Flame/>
                                                : selectedHostess.fatigue >= 26 && selectedHostess.fatigue < 50 ? <Droplet/>
                                                    : selectedHostess.fatigue >= 50 && selectedHostess.fatigue < 75 ? <Snowflake/>
                                                        : selectedHostess.fatigue && <PlugZap/>}
                                        {selectedHostess.fatigue}/100
                                    </p>
                                </h1>
                            </div>
                            <h1>{selectedHostess.bio}</h1>
                        </div>
                        <div className={`flex justify-center items-center ${selectedHostess.fatigue >= 100 && "mix-blend-color-burn"}`}>
                            <div className="relative w-[180px] h-[520px]">
                                <Image
                                    src={selectedHostess.cover}
                                    alt={`${selectedHostess.name} ${selectedHostess.surname}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Management;
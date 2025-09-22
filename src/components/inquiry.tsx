import Image from "next/image";
import {BottleWine, UtensilsCrossed} from "lucide-react";

export const Inquiry = () => {
    const isSelected = false
    return (
        <div
            className={"w-[1400px] h-[800px] gap-5 bg-pink-700 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
            style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
            <div className={"flex justify-center items-center relative"}>
                <div className={`absolute bottom-40 left-75 border-2 p-5 rounded-[15] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                    <BottleWine size={50}/>
                </div>
                <div className={`absolute bottom-40 left-102 border-2 p-5 rounded-[15] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                    <UtensilsCrossed size={50}/>
                </div>
                <Image
                    src={"/images/hostess_buffet.png"}
                    alt={"Hostess is ordering"}
                    height={200}
                    width={700}
                />
            </div>
            <div
                className={"gap-5 bg-pink-800 w-100 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}
                style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <div className={"w-full grid m-5 grid-cols-[repeat(3,auto)] gap-5"}>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>
                        <div className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-pink-300 transition duration-200 ease-in-out transform active:scale-105 ${isSelected ? "bg-red-950 shadow-white shadow-sm" : "bg-pink-900"}`}>
                            balls
                        </div>

                    </div>
            </div>
        </div>
    )
}
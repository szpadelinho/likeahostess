'use client'

import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Emilys_Candy} from "next/font/google";
import Navbar from "@/components/navbar";
import {flowerLotus, flowerRose, flowerTulip, flowerStem} from "@lucide/lab";
import {createLucideIcon} from "lucide-react";

const FlowerLotus = createLucideIcon("FlowerLotus", flowerLotus)
const FlowerRose = createLucideIcon("FlowerRose", flowerRose)
const FlowerTulip = createLucideIcon("FlowerTulip", flowerTulip)
const FlowerStem = createLucideIcon("FlowerStem", flowerStem)

const emilysCandy = Emilys_Candy({
    weight: "400",
    subsets: ['latin'],
})

export const LoveInHeartClient = () => {
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const [massage, setMassage] = useState<"Standard" | "Deluxe" | "VIP" | "Super VIP" | null>(null)

    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    const massageItems = [
        {
            title: "Normal service",
            Icon: FlowerLotus,
            description: "The most basic massage, mainly to refresh yourself.",
            onClick: () => setMassage("Standard"),
        },
        {
            title: "Deluxe service",
            Icon: FlowerRose,
            description: "A more premium option for those, who look for a more professional and softer service.",
            onClick: () => setMassage("Deluxe"),
        },
        {
            title: "VIP service",
            Icon: FlowerTulip,
            description: "For the lone souls seeking for a more intimate meeting.",
            onClick: () => setMassage("VIP"),
        },
        {
            title: "Super VIP service",
            Icon: FlowerStem,
            description: "Only for the real massage lovers. All cosmetics included.",
            onClick: () => setMassage("Super VIP"),
        },
    ]

    return(
        <>
            <Image src={"/images/love_in_heart.png"} alt={"Love In Heart massage parlor"} fill={true} className={"object-cover z-1"}/>
            <Image src={"/images/saejima_massage.png"} alt={"Taiga Saejima"} height={300} width={250} className={"absolute left-20 bottom-10 z-1"}/>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"LoveInHeart"}/>
            <div className={`gap-10 h-screen w-screen flex flex-col items-center justify-center text-rose-100 ${emilysCandy.className}`}>
                <h1 className={"z-10 text-[50px]"}>What will be the service for today?</h1>
                <div className={"flex flex-col items-center justify-center gap-10"}>
                    {massageItems.map((item, i) => (
                        <button
                            key={i}
                            style={{
                                borderWidth: "8px",
                                borderStyle: "solid",
                                borderImageSource: "url('/images/wood_texture2.png')",
                                borderImageSlice: 30,
                                borderImageRepeat: "round"
                            }}
                            className={"relative bg-[url(/images/wood_texture.png)] hover:text-rose-500 flex items-center justify-center flex-col z-1 h-40 w-200 rounded-[5] duration-300 ease-in-out hover:scale-105 active:scale-110"}>
                            <h1 className={"text-[30px]"}>
                                {item.title}
                            </h1>
                            <item.Icon size={40} className={"absolute top-3 right-3"}/>
                            <p className={"text-[25px]"}>
                                {item.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
            <ReactPlayer
                src={"https://youtube.com/embed/zm6Z9qBzcz0?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                loop={true}
                className={"flex absolute top-0 left-0 z-[-1]"}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
        </>
    )
}
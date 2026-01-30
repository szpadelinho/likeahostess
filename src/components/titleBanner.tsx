import Image from "next/image";
import {backgroundRenders, yesteryear} from "@/app/types";
import {useEffect, useState} from "react";

interface Props {
    bannerVisible: boolean
}

const TitleBanner = ({bannerVisible}: Props) => {
    const [fade, setFade] = useState<boolean>(true)
    const [index] = useState<number>(() => {
        const random = Math.floor(Math.random() * backgroundRenders.length)
        console.log(random)
        return random
    })

    useEffect(() => {
        setTimeout(() => {
            setFade(false)
        }, 100)
    }, [])

    return (
        <>
            <div
                className={`absolute inset-0 ease-in-out duration-1000 z-[1000] ${fade ? "opacity-100" : "opacity-0"}`}/>
            <div className={`absolute inset-0 z-10 ease-in-out duration-1000 transform transition-all ${bannerVisible ? "opacity-100" : "opacity-0"}`}>
                {backgroundRenders[index]}
            </div>
            <div
                className={`z-[999] flex h-screen w-screen items-center justify-center absolute transition duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}>
                <Image src={"/images/logo.png"} alt={"Gamepad"} height={1200} width={1200} className={"flex"}/>
                <h1 className={`absolute bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,1)_-100%,_rgba(0,0,0,0)_75%)] ease-in-out animate-[pulseText_1.5s_ease-in-out_infinite] bottom-20 text-[75px] text-white ${yesteryear.className}`}>Press any button to
                    continue...</h1>
            </div>
        </>
    )
}

export default TitleBanner
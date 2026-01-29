import Image from "next/image";
import {yesteryear} from "@/app/types";
import {useEffect, useState} from "react";

interface Props {
    bannerVisible: boolean
}

const TitleBanner = ({bannerVisible}: Props) => {
    const [fade, setFade] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {
            setFade(false)
        }, 100)
    }, [])

    return (
        <>
            <div
                className={`absolute inset-0 ease-in-out duration-1000 z-[1000] ${fade ? "opacity-100" : "opacity-0"}`}/>
            <Image src={"/images/title.png"} alt={"Title screen background"} fill={true} className={`z-[999] object-cover transition absolute h-screen w-screen duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}/>
            <div
                className={`z-[999] flex h-screen w-screen items-center justify-center absolute transition duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}>
                <Image src={"/images/logo.png"} alt={"Gamepad"} height={1200} width={1200} className={"flex"}/>
                <h1 className={`absolute bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,1)_-100%,_rgba(0,0,0,0)_75%)] duration-200 ease-in-out animate-[pulseText_1.5s_ease-in-out_infinite] bottom-50 text-[50px] text-white ${yesteryear.className}`}>Press any button to
                    continue...</h1>
            </div>
        </>
    )
}

export default TitleBanner
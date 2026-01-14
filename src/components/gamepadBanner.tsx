import Image from "next/image";
import {yesteryear} from "@/app/types";
import {useEffect, useState} from "react";

interface Props {
    bannerVisible: boolean
}

const GamepadBanner = ({bannerVisible}: Props) => {
    const [fade, setFade] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {
            setFade(false)
        }, 100)
    }, [])

    return (
        <>
            <div className={`absolute inset-0 bg-black ease-in-out duration-1000 z-[1000] ${fade ? "opacity-100" : "opacity-0"}`}/>
            <Image src={"/images/intro_background.png"} alt={"Gamepad background"} fill={true} className={`z-[999] object-cover transition absolute h-screen w-screen duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}/>
            <div
                className={`z-[999] flex h-screen w-screen items-center justify-center absolute transition duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}>
                <div className={"flex flex-col h-175 justify-between items-center"}>
                    <Image src={"/images/gamepad.png"} alt={"Gamepad"} height={424} width={700} className={"flex"}/>
                    <h1 className={`${yesteryear.className} text-[80px] text-white`}>Real hosts use a gamepad</h1>
                </div>
            </div>
        </>
    )
}

export default GamepadBanner
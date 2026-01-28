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
            <Image src={"/images/title.png"} alt={"Title screen background"} fill={true}
                   className={`z-[999] object-fit transition absolute h-screen w-screen duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}/>
            <div
                className={`z-[999] backdrop-blur-[2px] flex h-screen w-screen items-center justify-center absolute transition duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}>
                <div className={"flex flex-row gap-20 h-175 justify-between items-center"}>
                    <Image src={"/images/icon-full.png"} alt={"Gamepad"} height={300} width={300} className={"flex"}/>
                    <h1 className={`${yesteryear.className} text-[150px] text-white`}>Like a Hostess</h1>
                </div>
                <h1 className={`absolute bottom-50 text-[50px] text-white ${yesteryear.className}`}>Press any button to
                    continue...</h1>
            </div>
        </>
    )
}

export default TitleBanner
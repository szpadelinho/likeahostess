'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import {yesteryear} from "@/app/types";
import {useVolume} from "@/app/context/volumeContext";

interface Props {
    show: boolean
}

const LoadingBanner = ({show}: Props) => {
    const [visible, setVisible] = useState(show)
    const { fadeTo, restore } = useVolume()

    useEffect(() => {
        if(show) {
            fadeTo(0)
            setVisible(true)
        }
        else{
            const timeout = setTimeout(() => setVisible(false), 1000)
            restore()
            return (() => clearTimeout(timeout))
        }
    }, [show, fadeTo, restore])

    return (
        <div className={`absolute inset-0 pointer-events-none flex justify-center items-center z-[999] transition-opacity duration-1000 text-white ${
            visible ? "opacity-100" : "opacity-0"}`}>
            <Image src={`/images/loading.png`} alt={"Loading banner"} fill={true}
                   priority={true}
                   className={"flex absolute z-49 justify-center items-center object-cover"}/>
            <h1 className={`text-[150px] z-50 ${yesteryear.className}`}>Loading...</h1>
        </div>
    )
}

export default LoadingBanner
'use client'

import Image from "next/image";
import {useEffect, useState} from "react";
import {yesteryear} from "@/app/types";

interface Props {
    show: boolean
}

const LoadingBanner = ({show}: Props) => {
    const [visible, setVisible] = useState(show)

    useEffect(() => {
        if(show) setVisible(true)
        else{
            const timeout = setTimeout(() => setVisible(false), 1000)
            return (() => clearTimeout(timeout))
        }
    }, [show])

    return (
        <div className={`absolute inset-0 pointer-events-none flex justify-center items-center z-[999] transition-opacity duration-1000 text-white ${
            visible ? "opacity-100" : "opacity-0"}`}>
            <Image src={"/images/Loading3.png"} alt={"Loading banner object-content"} fill={true}
                   className={"flex absolute z-49 justify-center items-center"}/>
            <div className={"flex h-screen w-screen absolute z-50 justify-center items-center"}>
                <h1 className={`text-[75px] ${yesteryear.className}`}>Loading...</h1>
            </div>
        </div>
    )
}

export default LoadingBanner
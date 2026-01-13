'use client'

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {loadingImages, yesteryear} from "@/app/types";

interface Props {
    show: boolean
}

const LoadingBanner = ({show}: Props) => {
    const [visible, setVisible] = useState(show)
    const image = useRef("loading")

    useEffect(() => {
        image.current = loadingImages[Math.floor(Math.random() * loadingImages.length)]
    }, [])

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
            <Image src={`/images/${image.current}.png`} alt={"Loading banner"} fill={true}
                   className={"flex absolute z-49 justify-center items-center object-content"}/>
            <h1 className={`text-[150px] z-50 ${yesteryear.className}`}>Loading...</h1>
        </div>
    )
}

export default LoadingBanner
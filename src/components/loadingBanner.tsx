import Image from "next/image";
import {Yesteryear} from "next/font/google";
import {useEffect, useState} from "react";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

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

    if(!visible) return null

    return (
        <div className={`absolute inset-0 flex justify-center items-center z-50 transition-opacity duration-1000 ${
            show ? "opacity-100" : "opacity-0"}`}>
            <Image src={"/images/Loading.png"} alt={"Loading banner"} fill={true}
                   className={"flex absolute z-49 justify-center items-center"}/>
            <div className={"flex h-screen w-screen absolute z-50 justify-center items-center"}>
                <h1 className={`text-[50px] ${yesteryear.className}`}>Loading...</h1>
            </div>
        </div>
    )
}

export default LoadingBanner
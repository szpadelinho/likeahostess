import {LucideIcon} from "lucide-react";
import {Yesteryear} from "next/font/google";
import Image from "next/image";
import React from "react";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

interface MenuButton {
    title: string
    imageSrc: string
    imageAlt: string
    Icon: LucideIcon
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const MenuButton = ({title, imageSrc, imageAlt, Icon, onClick}: MenuButton) => {
    return(
        <button className={"relative flex flex-col items-center justify-center gap-5 rounded-[20] p-2 cursor-zoom-in hover:bg-pink-200 bg-pink-700 hover:text-pink-950 transition duration-200 ease-in-out transform active:scale-110 w-115 h-65"}
                onClick={onClick}>
            <Image className={"absolute right-5 opacity-50"} src={imageSrc} alt={imageAlt} height={260} width={260}/>
            <Icon size={100} className={"absolute left-2 top-2"}/>
            <h1 className={`${yesteryear.className} text-[75px] z-50`}>{title}</h1>
        </button>
    )
}
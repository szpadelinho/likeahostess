import Image from "next/image";
import {Club, fascinateInline} from "@/app/types";

interface Props {
    show: boolean,
    club: Club | null
}

const InteriorBanner = ({show, club}: Props) => {
    return (
        <div
            className={`flex flex-col gap-10 justify-center items-center h-screen w-screen absolute z-[999] bg-black/75 transition duration-500 transform ease-in-out ${show ? "opacity-100" : "opacity-0"}`}>
            <div className={"bg-[radial-gradient(ellipse_at_center,_rgba(200,20,80,1)_-100%,_rgba(0,0,0,0)_60%)]"}>
                <Image src={"/images/intro_interior.png"} alt={"Club banner"} height={400} width={800}/>
            </div>
            <h1 className={`${fascinateInline.className} text-[50px] text-pink-200`}>Welcome to {club?.name}, dear {club?.host.name} {club?.host.name === "Kazuki" && "and"} {club?.host.surname}</h1>
        </div>
    )
}

export default InteriorBanner
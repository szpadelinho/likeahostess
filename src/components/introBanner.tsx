import Image from "next/image";
import {Yesteryear} from "next/font/google";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

interface Props {
    bannerVisible: boolean
}

const IntroBanner = ({bannerVisible}: Props) => {
    return (
        <>
            <Image src={"/images/intro_background.png"} alt={"Gamepad background"} fill={true} className={`z-[999] object-cover transition absolute h-screen w-screen duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}/>
            <div
                className={`z-[999] flex h-screen w-screen items-center justify-center absolute transition duration-1000 transform ease-in-out ${bannerVisible ? "opacity-100" : "opacity-0"}`}>
                <div className={"flex flex-col h-175 justify-between items-center"}>
                    <Image src={"/images/gamepad.png"} alt={"Gamepad"} height={424} width={676} className={"flex"}/>
                    <h1 className={`${yesteryear.className} text-[80px] text-white`}>Real hosts use a gamepad</h1>
                </div>
            </div>
        </>
    )
}

export default IntroBanner
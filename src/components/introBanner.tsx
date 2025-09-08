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
            <Image src={"/images/gamepad_background_v2.png"} alt={"Gamepad background"} height={1920} width={1080} className={`z-40 transition absolute h-screen w-screen duration-500 transform ease-in-out ${bannerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}/>
            <div
                className={`flex h-screen w-screen items-center justify-center absolute z-50 transition duration-500 transform ease-in-out ${bannerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                <div className={"flex flex-col h-175 justify-between items-center"}>
                    <Image src={"/images/gamepad.png"} alt={"Gamepad"} height={424} width={676} className={"flex"}/>
                    <h1 className={`${yesteryear.className} text-[80px] text-white`}>Real hosts use a gamepad</h1>
                </div>
            </div>
        </>
    )
}

export default IntroBanner
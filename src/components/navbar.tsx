import {Yesteryear} from "next/font/google"
import Image from "next/image";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

const Navbar = () => {
    return (
        <div
            className={`max-w-screen z-10 h-25 text-center content-center justify-center items-center flex flex-row text-[40px] text-white`}>
            <div className={"flex content-center justify-center items-center"}>
                <Image src={"/images/dragon2.png"} alt={"Dragon navbar icon"} height={50} width={250} />
            </div>
        </div>
    )
}

export default Navbar
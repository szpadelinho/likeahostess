import {Yesteryear} from "next/font/google"
import {CarTaxiFront, LogOut} from "lucide-react";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

const Navbar = () => {
    return (
        <div
            className={`bg-pink-500 max-w-screen h-25 text-center content-center items-center justify-between flex flex-row text-[40px] rounded-[10] text-white m-4`}>
            <div className={"basis-1/4 flex content-center gap-5 ml-5"}>
                <button className={"border-white border-2 rounded-[5] p-2 cursor-zoom-in text-[20px] w-40"}>Management
                </button>
                <button className={"border-white border-2 rounded-[5] p-2 cursor-copy text-[20px] w-40"}>Activities
                </button>
            </div>
            <div className={"basis-2/4 flex content-center justify-center"}>
                <h1 className={yesteryear.className}>Like a Hostess</h1>
            </div>
            <div className={"basis-1/4 flex content-center justify-end gap-5 mr-5"}>
                <button className={"border-white border-2 rounded-[5] p-1 cursor-wait"}><CarTaxiFront/></button>
                <button className={"border-white border-2 rounded-[5] p-1 cursor-alias"}><LogOut/></button>
            </div>
        </div>
    )
}

export default Navbar
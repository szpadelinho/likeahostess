import Image from "next/image";
import {X} from "lucide-react";
import {useState} from "react";

interface Props {
    onCloseModal: () => void
}

const Activities = ({onCloseModal}: Props) => {
    const [hover, setHover] = useState(false)
    return (
        <div
            className={`w-screen h-180 text-center content-center justify-center items-start flex flex-row text-white z-51 gap-20`}>
            <button onClick={onCloseModal}
                    className={"absolute top-[-75] left-5 hover:cursor-pointer border-white border-2 rounded-[10] p-1 text-white hover:bg-white hover:text-black transition duration-200 ease-in-out hover:"}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
            >
                <X size={35} color={hover ? "black" : "white"} strokeWidth={3}/>
            </button>
            <div
                className={"gap-5 bg-pink-700 w-100 h-180 text-center content-center items-start justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600]"}>
                <div className={"w-full grid m-5 grid-cols-[repeat(3,auto)] gap-5"}>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/koyuki.png"} alt={""} height={100} width={100}
                               className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/yuki.png"} alt={""} height={100} width={100} className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/rina_rukawa.png"} alt={""} height={100} width={100}
                               className={"rounded-[20]"}/>
                    </div>
                </div>
            </div>
            <div
                className={"gap-5 bg-pink-700 w-300 h-160 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600] mr-35"}>
                <div>
                    <h1>Activity name</h1>
                    <h1>Activity performer</h1>
                    <h1>Activity bio</h1>
                </div>
            </div>
        </div>
    )
}

export default Activities;
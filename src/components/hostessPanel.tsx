import Image from "next/image"

const HostessPanel = ({management}: { management: boolean }) => {
    const visibilityIndexSetter = management ? "z-[100]" : "z-10"
    return (
        <div className={"flex relative w-screen"}>
            <div
                className={`${visibilityIndexSetter} bg-pink-700 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[20] text-white font-[600] absolute left-150 bottom-10 max-w-[1012px]`}>
                <div className={"flex justify-center items-center m-2 gap-5"}>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/mika_tsuchiya.png"} alt={""} height={100} width={100}
                               className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/koyuki.png"} alt={""} height={100} width={100} className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/yuki.png"} alt={""} height={100} width={100} className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/rio.png"} alt={""} height={100} width={100} className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/riku.png"} alt={""} height={100} width={100}
                               className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/saya_unten.png"} alt={""} height={100} width={100}
                               className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/maya_mori.png"} alt={""} height={100} width={100}
                               className={"rounded-[20]"}/>
                    </div>
                    <div className={"flex justify-center items-center rounded-[20] border-white border-2"}>
                        <Image src={"/images/hinata_osaki.png"} alt={""} height={100} width={100}
                               className={"rounded-[20]"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HostessPanel
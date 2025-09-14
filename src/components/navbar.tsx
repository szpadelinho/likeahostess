import Image from "next/image";

interface Props {
    logo: string
}

const Navbar = ({logo}: Props) => {
    return (
        <div
            className={`max-w-screen z-10 h-25 text-center content-center justify-center items-center flex flex-row text-[40px] text-white`}>
            <div className={"flex content-center justify-center items-center"}>
                <Image src={logo} alt={"Club logo"} height={50} width={200} className={"absolute top-1"}/>
            </div>
        </div>
    )
}

export default Navbar
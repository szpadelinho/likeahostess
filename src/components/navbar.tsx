import Image from "next/image";

interface Props {
    logo: string
}

const Navbar = ({logo}: Props) => {
    return (
        <div
            className={`max-w-screen z-10 h-25 text-center content-center justify-center items-center flex flex-row text-[40px] text-white`}>
            <Image src={logo} alt={"Club logo"} height={50} width={150} className={"absolute top-5 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,.5)_-60%,_rgba(0,0,0,0)_75%)]"}/>
        </div>
    )
}

export default Navbar
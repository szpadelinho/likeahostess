import {Yesteryear} from "next/font/google"

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

const Navbar = () => {
    return (
        <div
            className={`max-w-screen h-25 text-center content-center justify-center items-center flex flex-row text-[40px] text-white m-4`}>
            <div className={"flex content-center justify-center items-center"}>
                <h1 className={yesteryear.className}>Like a Hostess</h1>
            </div>
        </div>
    )
}

export default Navbar
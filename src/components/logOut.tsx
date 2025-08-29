import Image from "next/image";
import {Dispatch, SetStateAction} from "react";
import {useRouter} from "next/navigation";
import {signOut} from "next-auth/react";

interface LogOut {
    setLogOff: Dispatch<SetStateAction<boolean>>
}

const LogOut = ({setLogOff}: LogOut) => {
    const router = useRouter();

    return (
        <div
            className={`max-w-screen h-25 text-center content-center justify-center items-center flex flex-row text-white`}>
            <div
                className={"w-200 flex content-center justify-center items-center flex-row"}>
                <div
                    className={"h-flex content-center justify-center items-center flex-row bg-pink-700 rounded-[10]"}>
                    <Image
                        className={"rounded-[10]"}
                        src={"/images/shinada.png"}
                        alt={"Taxi driver"}
                        width={250}
                        height={250}
                    />
                </div>
                <div
                    className={"h-50 p-10 flex content-center justify-center items-center flex-col gap-5 bg-pink-500 rounded-br-[10] rounded-tr-[10]"}>
                    <h1 className={"text-[30px]"}>Are you sure you want to log off?</h1>
                    <div className={"flex content-center justify-center items-center flex-row text-[25px] gap-10"}>
                        <button onClick={() => {
                            signOut({redirectTo: "/auth"})
                        }} className={"border-white border-2 rounded-[5] p-1 cursor-zoom-in w-50"}>Log me off
                        </button>
                        <button onClick={() => {
                            setLogOff(false)
                        }} className={"border-white border-2 rounded-[5] p-1 cursor-zoom-out w-50"}>I will stay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogOut
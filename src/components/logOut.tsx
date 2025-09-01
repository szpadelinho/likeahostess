import Image from "next/image";
import {signOut} from "next-auth/react";

interface Props {
    onCloseModal: () => void
}

const LogOut = ({onCloseModal}: Props) => {
    return (
        <div
            className={`max-w-screen h-100 text-center content-center justify-center items-center flex flex-row text-white z-51`}>
            <div
                className={"w-200 flex content-center justify-center items-center flex-row"}>
                <div
                    className={"w-[250px] h-[250px] flex content-center justify-center items-center flex-row bg-pink-700 rounded-[20]"}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <Image
                        className={"rounded-[20] w-[250px] h-[250px]"}
                        src={"/images/shinada.png"}
                        alt={"Tatsuo Shinada"}
                        width={250}
                        height={250}
                    />
                </div>
                <div
                    className={"h-50 p-10 flex content-center justify-center items-center flex-col gap-5 bg-pink-500 rounded-br-[20] rounded-tr-[20]"}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <h1 className={"text-[30px]"}>Are you sure you want to log off?</h1>
                    <div className={"flex content-center justify-center items-center flex-row text-[25px] gap-10"}>
                        <button onClick={() => {
                            signOut({redirectTo: "/auth"})
                        }}
                                className={"border-white border-2 rounded-[10] p-1 cursor-zoom-in w-50 hover:bg-white hover:text-black transition duration-200 ease-in-out"}>Log
                            me off
                        </button>
                        <button onClick={onCloseModal}
                                className={"border-white border-2 rounded-[10] p-1 cursor-zoom-out w-50 hover:bg-white hover:text-black transition duration-200 ease-in-out"}>I
                            will stay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogOut
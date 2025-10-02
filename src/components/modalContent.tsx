import Image from "next/image";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";

interface ModalContentProps {
    onCloseModal: () => void,
    selectionPrompt: boolean,
    logOff: boolean,
    profile: boolean
}

export const ModalContent = ({onCloseModal, selectionPrompt, logOff, profile}: ModalContentProps) => {
    const router = useRouter()
    return (
        <div
            className={`max-w-screen h-100 text-center content-center justify-center items-center flex flex-row text-white z-51`}>
            {logOff && (
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
                                    className={"border-white bg-pink-600 border-2 rounded-[12] p-1 cursor-zoom-in w-50 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}>
                                Log me off
                            </button>
                            <button onClick={onCloseModal}
                                    className={"border-white bg-pink-600 border-2 rounded-[12] p-1 cursor-zoom-out w-50 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}>
                                I
                                will stay
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectionPrompt && (
                <div
                    className={"w-200 flex content-center justify-center items-center flex-row bg-transparent"}>
                    <div
                        className={"w-[250px] h-[250px] flex content-center justify-center items-center flex-row bg-pink-700 rounded-[20]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        <Image
                            className={"rounded-[20] w-[250px] h-[250px]"}
                            src={"/images/suzuki.png"}
                            alt={"Taxi driver"}
                            width={250}
                            height={250}
                        />
                    </div>
                    <div
                        className={"h-50 p-10 flex content-center justify-center items-center flex-col gap-5 bg-pink-500 rounded-br-[20] rounded-tr-[20]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        <h1 className={"text-[30px]"}>Switch clubs?</h1>
                        <div className={"flex content-center justify-center items-center flex-row text-[25px] gap-10"}>
                            <button onClick={() => {
                                router.push("/selection");
                            }}
                                    className={"border-white bg-pink-600 border-2 rounded-[12] p-1 cursor-zoom-in w-50 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}>
                                Get
                                in the cab
                            </button>
                            <button onClick={onCloseModal}
                                    className={"border-white bg-pink-600 border-2 rounded-[12] p-1 cursor-zoom-out w-50 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}>
                                I
                                will stay
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {profile && (
                <div
                    className={"w-200 flex content-center justify-center items-center flex-row bg-transparent"}>
                    <div
                        className={"w-[250px] h-[250px] flex content-center justify-center items-center flex-row bg-pink-700 rounded-[20]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        <Image
                            className={"rounded-[20] w-[250px] h-[250px]"}
                            src={"/images/daigo.png"}
                            alt={"Daigo Dojima"}
                            width={250}
                            height={250}
                        />
                    </div>
                    <div
                        className={"h-50 p-10 flex content-center justify-center items-center flex-col gap-5 bg-pink-500 rounded-br-[20] rounded-tr-[20]"}
                        style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                        <h1 className={"text-[30px]"}>
                            Check your profile card?
                        </h1>
                        <div className={"flex content-center justify-center items-center flex-row text-[25px] gap-10"}>
                            <button onClick={() => {
                                router.push("/profile");
                            }}
                                    className={"border-white bg-pink-600 border-2 rounded-[12] p-1 cursor-zoom-in w-50 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}>
                                Go for it
                            </button>
                            <button onClick={onCloseModal}
                                    className={"border-white bg-pink-600 border-2 rounded-[12] p-1 cursor-zoom-out w-50 hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110"}>
                                I will stay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
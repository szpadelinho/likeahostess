import Image from "next/image";
import {Dispatch, SetStateAction} from "react";
import {useRouter} from "next/navigation";

interface SelectPrompt {
    setSelectionPrompt: Dispatch<SetStateAction<boolean>>
}

const SelectionPrompt = ({setSelectionPrompt}: SelectPrompt) => {
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
                        src={"/images/suzuki.png"}
                        alt={"Taxi driver"}
                        width={250}
                        height={250}
                    />
                </div>
                <div
                    className={"h-50 p-10 flex content-center justify-center items-center flex-col gap-5 bg-pink-500 rounded-br-[10] rounded-tr-[10]"}>
                    <h1 className={"text-[30px]"}>Are you sure you want to switch clubs?</h1>
                    <div className={"flex content-center justify-center items-center flex-row text-[25px] gap-10"}>
                        <button onClick={() => {
                            router.push("/selection");
                        }} className={"border-white border-2 rounded-[5] p-1 cursor-zoom-in w-50"}>Get in the cab
                        </button>
                        <button onClick={() => {
                            setSelectionPrompt(false)
                        }} className={"border-white border-2 rounded-[5] p-1 cursor-zoom-out w-50"}>I will stay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectionPrompt
import Image from "next/image";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";
import {yesteryear} from "@/app/types";

interface ModalContentProps {
    onCloseModal: () => void,
    window: "Management" | "Activities" | "Profile" | "Casino" | "NewSerena" | "Moneylender" | "Selection" | "LogOff" | "LoveInHeart" | null,
    setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export const ModalContent = ({
                                 onCloseModal,
                                 window,
                                 setLoading
                             }: ModalContentProps) => {
    const router = useRouter()

    const modalConfigs = [
        {
            key: "logOff",
            active: window === "LogOff",
            image: "/images/shinada.png",
            alt: "Tatsuo Shinada",
            title: "Are you sure you want to log off?",
            buttons: [
                {
                    label: "Log me off",
                    onClick: () => signOut({redirectTo: "/auth"}),
                    style: "cursor-zoom-in",
                },
                {
                    label: "I will stay",
                    onClick: onCloseModal,
                    style: "cursor-zoom-out",
                },
            ],
        },
        {
            key: "selectionPrompt",
            active: window === "Selection",
            image: "/images/suzuki.png",
            alt: "Taxi driver",
            title: "Switch clubs?",
            buttons: [
                {
                    label: "Get in the cab",
                    onClick: () => router.push("/selection"),
                    style: "cursor-zoom-in",
                },
                {
                    label: "I will stay",
                    onClick: onCloseModal,
                    style: "cursor-zoom-out",
                },
            ],
        },
        {
            key: "profile",
            active: window === "Profile",
            image: "/images/daigo.png",
            alt: "Daigo Dojima",
            title: "Check your profile card?",
            buttons: [
                {
                    label: "Go for it",
                    onClick: () => router.push("/profile"),
                    style: "cursor-zoom-in",
                },
                {
                    label: "I will stay",
                    onClick: onCloseModal,
                    style: "cursor-zoom-out",
                },
            ],
        },
        {
            key: "casino",
            active: window === "Casino",
            image: "/images/tanimura.png",
            alt: "Masayoshi Tanimura",
            title: "Visit casino?",
            buttons: [
                {
                    label: "Let's go gamble!",
                    onClick: () => router.push("/casino"),
                    style: "cursor-zoom-in",
                },
                {
                    label: "I will stay",
                    onClick: onCloseModal,
                    style: "cursor-zoom-out",
                },
            ],
        },
        {
            key: "newSerena",
            active: window === "NewSerena",
            image: "/images/date_menu.png",
            alt: "Makoto Date",
            title: "Visit your local bar?",
            buttons: [
                {
                    label: "Go for a drink",
                    onClick: () => router.push("/newSerena"),
                    style: "cursor-zoom-in",
                },
                {
                    label: "I will stay",
                    onClick: onCloseModal,
                    style: "cursor-zoom-out",
                },
            ],
        },
        {
            key: "moneylender",
            active: window === "Moneylender",
            image: "/images/mine_menu.png",
            alt: "Mine Yoshitaka",
            title: "Ask for a loan?",
            buttons: [
                {
                    label: "Take the risk",
                    onClick: () => router.push("/moneylender"),
                    style: "cursor-zoom-in",
                },
                {
                    label: "I will stay",
                    onClick: onCloseModal,
                    style: "cursor-zoom-out",
                },
            ],
        },
        {
            key: "loveInHeart",
            active: window === "LoveInHeart",
            image: "/images/saejima_menu.png",
            alt: "Taiga Saejima",
            title: "Go for a massage?",
            buttons: [
                {
                    label: "Take no time",
                    onClick: () => router.push("/loveInHeart"),
                    style: "cursor-zoom-in",
                },
                {
                    label: "I will stay",
                    onClick: onCloseModal,
                    style: "cursor-zoom-out",
                },
            ],
        },
    ]

    const activeModal = modalConfigs.find((modal) => modal.active)

    if (!activeModal) return null

    return (
        <div
            className={`max-w-screen h-100 text-center content-center justify-center items-center flex flex-row text-pink-200 z-51`}>
            <div
                className={"w-200 flex content-center justify-center items-center flex-row"}>
                <div
                    className={"w-[250px] h-[250px] flex content-center justify-center items-center flex-row bg-pink-700 rounded-[20]"}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <Image
                        className={"rounded-[20] w-[250px] h-[250px]"}
                        src={activeModal.image}
                        alt={activeModal.alt}
                        width={250}
                        height={250}
                    />
                </div>
                <div
                    className={"h-50 p-10 flex content-center justify-center items-center flex-col gap-5 bg-pink-600 rounded-br-[20] rounded-tr-[20]"}
                    style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                    <h1 className={`text-[40px] ${yesteryear.className} text-nowrap`}>
                        {activeModal.title}
                    </h1>
                    <div className={"flex content-center justify-center items-center flex-row text-[25px] gap-10"}>
                        {activeModal.buttons.map((button, i) => (
                            <button
                                key={i}
                                onClick={async () => {
                                    if (button.onClick === onCloseModal) {
                                        button.onClick()
                                    } else {
                                        setLoading(true)
                                        setTimeout(() => button.onClick(), 1000)
                                    }
                                }}
                                className={"bg-pink-800 rounded-[12] p-1 cursor-zoom-out w-50 hover:bg-pink-200 hover:text-pink-950 transition-all duration-200 ease-in-out transform active:scale-110"}>
                                {button.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
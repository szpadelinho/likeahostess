import {
    BottleWine,
    CarTaxiFront,
    ClubIcon,
    createLucideIcon,
    Flower,
    IdCard,
    LogOut,
    MicVocal,
    PiggyBank
} from "lucide-react";
import {candlestickBigLit} from "@lucide/lab";
import {MenuButton} from "@/components/menuButton";
import {WindowType} from "@/app/types";

interface MenuModal {
    menu: boolean,
    closing: boolean,
    handleClick: () => void,
    setWindow: (value: (((prevState: (WindowType | null)) => (WindowType | null)) | WindowType | null)) => void}

export const MenuModal = ({
                              menu,
                              closing,
                              handleClick,
                              setWindow
                          }: MenuModal) => {
    const CandleStickBigLit = createLucideIcon("CandleStickBigLit", candlestickBigLit)

    const menuItems = [
        {
            title: "Management",
            imageSrc: "/images/akiyama_menu.png",
            imageAlt: "Shun Akiyama photo",
            Icon: Flower,
            cursor: "cursor-zoom-in",
            onClick: () => setWindow("Management"),
        },
        {
            title: "Activities",
            imageSrc: "/images/haruka_menu.png",
            imageAlt: "Haruka Sawamura photo",
            Icon: MicVocal,
            cursor: "cursor-copy",
            onClick: () => setWindow("Activities"),
        },
        {
            title: "Casino",
            imageSrc: "/images/tanimura_menu.png",
            imageAlt: "Masayoshi Tanimura photo",
            Icon: ClubIcon,
            cursor: "cursor-copy",
            onClick: () => setWindow("Casino"),
        },
        {
            title: "Love in Heart",
            imageSrc: "/images/saejima_menu.png",
            imageAlt: "Taiga Saejima photo",
            Icon: CandleStickBigLit,
            cursor: "cursor-copy",
            onClick: () => setWindow("LoveInHeart"),
        },
        {
            title: "New Serena",
            imageSrc: "/images/date_menu.png",
            imageAlt: "Makoto Date photo",
            Icon: BottleWine,
            cursor: "cursor-copy",
            onClick: () => setWindow("NewSerena"),
        },
        {
            title: "Moneylender",
            imageSrc: "/images/mine_menu.png",
            imageAlt: "Mine Yoshitaka photo",
            Icon: PiggyBank,
            cursor: "cursor-copy",
            onClick: () => setWindow("Moneylender"),
        },
        {
            title: "Profile",
            imageSrc: "/images/daigo_menu.png",
            imageAlt: "Daigo Dojima photo",
            Icon: IdCard,
            cursor: "cursor-copy",
            onClick: () => setWindow("Profile"),
        },
        {
            title: "Change clubs",
            imageSrc: "/images/suzuki_menu.png",
            imageAlt: "Taichi Suzuki photo",
            Icon: CarTaxiFront,
            cursor: "cursor-wait",
            onClick: () => setWindow("Selection")
        },
        {
            title: "Log out",
            imageSrc: "/images/shinada_menu.png",
            imageAlt: "Tatsuo Shinada photo",
            Icon: LogOut,
            cursor: "cursor-alias",
            onClick: () => setWindow("LogOff")
        },
    ]

    if (!menu && !closing) return null

    return (
        <div
            className={`absolute inset-0 flex justify-center items-center z-50 backdrop-blur-sm transition duration-300 ease-in-out ${menu && !closing ? "opacity-100" : "opacity-0"}`}
            onClick={handleClick}>
            <div
                className={`grid grid-cols-3 grid-rows-3 gap-10 text-center justify-items-center text-pink-200 transition duration-300 ease-in-out ${menu && !closing ? "scale-100" : "scale-50"}`}>
                {menuItems.map((item) => (
                    <MenuButton key={item.title}
                                {...item}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    item.onClick()
                                    handleClick()
                                }}/>
                ))}
            </div>
        </div>
    )
}
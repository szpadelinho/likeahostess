import {BottleWine, CarTaxiFront, ClubIcon, Flower, IdCard, LogOut, MicVocal, PiggyBank} from "lucide-react";
import {Dispatch, SetStateAction} from "react";
import {MenuButton} from "@/components/menuButton";

interface MenuModal {
    logOff: boolean,
    setLogOff: Dispatch<SetStateAction<boolean>>,
    selectionPrompt: boolean,
    setSelectionPrompt: Dispatch<SetStateAction<boolean>>,
    profile: boolean,
    casino: boolean,
    setCasino: Dispatch<SetStateAction<boolean>>,
    setProfile: Dispatch<SetStateAction<boolean>>,
    setManagement: Dispatch<SetStateAction<boolean>>,
    setActivities: Dispatch<SetStateAction<boolean>>,
    menu: boolean,
    closing: boolean,
    handleClick: () => void
}

export const MenuModal = ({
                              logOff,
                              setLogOff,
                              selectionPrompt,
                              setSelectionPrompt,
                              profile,
                              casino,
                              setCasino,
                              setProfile,
                              setManagement,
                              setActivities,
                              menu,
                              closing,
                              handleClick
                          }: MenuModal) => {
    const menuItems = [
        {
            title: "Management",
            imageSrc: "/images/akiyama_menu.png",
            imageAlt: "Shun Akiyama photo",
            Icon: Flower,
            cursor: "cursor-zoom-in",
            onClick: () => setManagement(true),
        },
        {
            title: "Activities",
            imageSrc: "/images/haruka_menu.png",
            imageAlt: "Haruka Sawamura photo",
            Icon: MicVocal,
            cursor: "cursor-copy",
            onClick: () => setActivities(true),
        },
        {
            title: "Casino",
            imageSrc: "/images/tanimura_menu.png",
            imageAlt: "Masayoshi Tanimura photo",
            Icon: ClubIcon,
            cursor: "cursor-copy",
            onClick: () => setCasino(!casino),
        },
        {
            title: "Profile",
            imageSrc: "/images/daigo_menu.png",
            imageAlt: "Daigo Dojima photo",
            Icon: IdCard,
            cursor: "cursor-copy",
            onClick: () => setProfile(!profile),
        },
        {
            title: "New Serena",
            imageSrc: "/images/date_menu.png",
            imageAlt: "Makoto Date photo",
            Icon: BottleWine,
            cursor: "cursor-copy",
            onClick: () => console.log("Open New Serena"),
        },
        {
            title: "Moneylender",
            imageSrc: "/images/mine_menu.png",
            imageAlt: "Mine Yoshitaka photo",
            Icon: PiggyBank,
            cursor: "cursor-copy",
            onClick: () => console.log("Open Moneylander"),
        },
        {
            title: "Change clubs",
            imageSrc: "/images/suzuki_menu.png",
            imageAlt: "Taichi Suzuki photo",
            Icon: CarTaxiFront,
            cursor: "cursor-wait",
            onClick: () => {
                if (logOff) setLogOff(false)
                setSelectionPrompt(!selectionPrompt)
            },
        },
        {
            title: "Log out",
            imageSrc: "/images/shinada_menu.png",
            imageAlt: "Tatsuo Shinada photo",
            Icon: LogOut,
            cursor: "cursor-alias",
            onClick: () => {
                if (selectionPrompt) setSelectionPrompt(false)
                setLogOff(!logOff)
            }
        }
    ]

    if (!menu && !closing) return null

    return (
        <div
            className={`absolute inset-0 flex justify-center items-center z-50 backdrop-blur-sm transition duration-300 ease-in-out ${menu && !closing ? "opacity-100" : "opacity-0"}`}
            onClick={handleClick}>
            <div className={`grid grid-cols-3 grid-rows-3 gap-10 text-center justify-items-center text-pink-200 transition duration-300 ease-in-out ${menu && !closing ? "scale-100" : "scale-50"}`}>
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
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {
    AudioWaveform,
    BookHeart,
    BookUser, BottleWine,
    CarTaxiFront, DatabaseBackup, Disc3,
    DoorOpen,
    Flower,
    Github, HandHeart,
    HeartHandshake, HeartPlus,
    IdCard,
    JapaneseYen,
    LogOut, Martini,
    MicVocal, Pause, SkipBack, SkipForward, StepBack, StepForward,
    Trash2, UtensilsCrossed, VenetianMask,
    Volume2
} from "lucide-react";
import {Yesteryear} from "next/font/google";
import clsx from "clsx";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

interface TutorialItemProps {
    label: string,
    setActive: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void
}

const TutorialItem = ({label, setActive}: TutorialItemProps) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    function handleClose() {
        setVisible(false)
        setTimeout(() => setActive(null), 500)
    }

    return (
        <div
            className={`absolute inset-0 z-50 bg-black/20 backdrop-blur-xs transition-opacity duration-500 flex items-center justify-center ${visible ? "opacity-100" : "opacity-0"}`}
            onClick={handleClose}>
            <div>
                <Image src={"/images/book.png"} alt={"Tutorial book"} height={800} width={1100}/>
                {label === "Authentication" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Authentication help</h1>
                            <p>The most important page - your authentication. Since you NEED to authenticate, here is a little tutorial on what to do, in case you are lost.<br/><br/>You have two options to log in:</p>
                            <div className={"flex flex-row gap-2 items-center"}>
                                <button
                                    className={"border-black border-2 rounded-sm w-[105px] opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}>
                                    <Github/><p>Github</p>
                                </button>
                                <button
                                    className={"border-black border-2 rounded-sm w-[105px] opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24"
                                         viewBox="0 0 50 50">
                                        <path
                                            d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z"></path>
                                    </svg>
                                    <p>Discord</p>
                                </button>
                            </div>
                            <p>When you are on the authentication page, click one of these two buttons to select your service, which you will use to log into the system.<br/><br/>Later, you will be redirected.</p>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>What to do when I am redirected?</h1>
                            <p>Depending on the service provider, you will be asked to log into the service. After logging in, the service will ask you for your permission the share your account information for the sake of logging into the Like a Hostess system.</p>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>What data is being used?</h1>
                            <p>The only data we collect is your username, email address and profile picture. We do not share your data nor use it for other purposes than game data collection.</p>
                        </div>
                    </div>
                )}
                {label === "Club selection" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Club selection</h1>
                            <p>After you successfully log in, you need to choose a club from the list.</p>
                            <div
                                className={`relative flex flex-col items-center justify-center`}>
                                <div
                                    className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_40%,_rgba(0,0,0,0)_0%,_rgba(255,255,255,1)_70%)] scale-101"/>
                                <Image
                                    src={"/images/stardust.png"}
                                    alt="Club exterior"
                                    width={600}
                                    height={300}
                                    className="rounded-md object-cover"
                                />

                                <div
                                    className={`absolute left-5 bottom-[-20px] z-10`}>
                                    <Image
                                        src={"/images/kazuki.png"}
                                        alt="Host"
                                        height={200}
                                        width={60}
                                        className="rounded-md"
                                    />
                                </div>
                                <div className={`absolute right-5 h-20 w-50 flex justify-center items-center bottom-[-20px] z-10 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,1)_-60%,_rgba(0,0,0,0)_65%)]`}>
                                    <Image src={"/images/stardust_logo.png"} alt="Club logo" height={100} width={150}/>
                                </div>
                            </div>
                            <div
                                className={`flex flex-col text-center justify-center rounded-[20] h-1/8 w-90 text-white bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,.5)_0%,_rgba(0,0,0,0)_70%)] ${clsx(
                                    "transition-opacity duration-400")}`}>
                                <h2 className={"m-5"}>Some tutorial data for you.</h2>
                            </div>
                            <p>The list is a carousel. Click the left or right one on the screen to select previous or next club. Select the club on the center, to enter with this set.</p>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>What happens next?</h1>
                            <p>After selecting the club you will play with, you are being redirected straight into the club's main hall. From now on, you are being a manager.</p>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>How can I change the club?</h1>
                            <p>With HUD, you can use a taxi to switch to a different club.</p>
                        </div>
                    </div>
                )}
                {label === "HUD" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>User interface</h1>
                            <div
                                className={`bg-pink-500 w-130 h-40 text-center content-center items-center flex flex-row text-[20px] rounded-[20] text-white scale-60`}>
                                <div className={"bg-[radial-gradient(circle_at_center,_#be185d_50%,_#9d174d_75%,_#831843_100%)] h-[130%] w-[40%] rounded-[20] flex justify-center relative"}>
                                    <Image
                                        className={"flex absolute -bottom-[25%]"}
                                        src={"/images/kazuki.png"}
                                        alt={"Host"}
                                        height={500}
                                        width={100}
                                    />
                                </div>
                                <div className={"flex flex-row text-center justify-center content-center w-[60%] h-[100%] p-5"}>
                                    <div className={"flex flex-col justify-center w-[60%]"}>
                                        <h1 className={"text-[22px] font-[700]"}>Kazuki</h1>
                                        <h2 className={"text-[18px] font-[600]"}>Stardust</h2>
                                    </div>
                                    <div className={"flex flex-col justify-center w-[40%]"}>
                                        <h2 className={"text-[20px] font-[400] flex flex-row justify-center items-center"}>
                                            <JapaneseYen/>
                                            <p>1000000</p>
                                        </h2>
                                        <h2 className={"flex flex-row text-[20px] font-[400] justify-center gap-1 content-center text-center items-center w-full"}>
                                            <HeartHandshake/>
                                            <p>10000</p>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <p>Here is an information about your character and the club you are currently managing. You can see the name of the main host, name of the club, your wealth and popularity.</p>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[25px] ${yesteryear.className}`}>Your panel:</h1>
                            <div
                                className={"gap-5 bg-pink-500 p-3 text-center content-center items-center justify-center flex flex-row text-[20px] rounded-[15] text-white font-[600]"}>
                                <div className={"flex content-center justify-center items-center flex-row gap-2"}>
                                    <button
                                        className={"border-white border-2 rounded-[12] p-2 cursor-zoom-in text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                        <Flower/>
                                    </button>
                                    <button
                                        className={"border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}                                    >
                                        <MicVocal/>
                                    </button>
                                </div>
                                <button
                                    className={"border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                    <IdCard/>
                                </button>
                                <div className={"flex content-center justify-center gap-2"}>
                                    <button
                                        className={"border-white border-2 rounded-[12] p-2 cursor-wait hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                        <CarTaxiFront/>
                                    </button>
                                    <button
                                        className={"border-white border-2 rounded-[12] p-2 cursor-alias hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                        <LogOut/>
                                    </button>
                                </div>
                            </div>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <button
                                    className={"text-white border-white border-2 rounded-[12] p-2 cursor-zoom-in text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                    <Flower/>
                                </button>
                                <p>Management - here you can select the hostesses who will work for you.</p>
                            </div>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <button
                                    className={"text-white border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}                                    >
                                    <MicVocal/>
                                </button>
                                <p>Activities - a little booster for the clubs popularity.</p>
                            </div>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <button
                                    className={"text-white border-white border-2 rounded-[12] p-2 cursor-copy text-[15px] hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                    <IdCard/>
                                </button>
                                <p>Profile card - statistics and your profile options.</p>
                            </div>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <button
                                    className={"text-white border-white border-2 rounded-[12] p-2 cursor-wait hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                    <CarTaxiFront/>
                                </button>
                                <p>Taxi - use it to leave the club and select a different one from the carousel.</p>
                            </div>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <button
                                    className={"text-white border-white border-2 rounded-[12] p-2 cursor-alias hover:bg-white bg-pink-600 hover:text-black transition duration-200 ease-in-out transform active:scale-110"}>
                                    <LogOut/>
                                </button>
                                <p>Log out - use it to log out and quit the game.</p>
                            </div>
                        </div>
                    </div>
                )}
                {label === "Game logic" && (
                    <div className={"absolute top-35 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>How to play</h1>
                            <p>There we are - basics of how to be a good club manager. The main goal of this job is to serve the clients walking into the club:</p>
                            <div
                                className={`text-white flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-white border-2 opacity-70 hover:opacity-100 hover:bg-pink-950 transition-all duration-200 ease-in-out transform active:scale-90 hover:shadow-sm hover:shadow-white z-49 bg-red-950`}>
                                <DoorOpen size={50}/>
                            </div>
                            <p>Click on the icon to welcome the client. Later, click on a free table to assign him somewhere.</p>
                            <div className={`flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-white border-2 opacity-70 hover:opacity-100 bg-pink-600 hover:bg-pink-950 transition-all duration-200 ease-in-out transform active:scale-90 hover:shadow-sm hover:shadow-white bg-pink-700`}>
                                <BookUser size={50}/>
                            </div>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <p>Click on the management panel. There, select one of the hostesses from the list:</p>
                            <div
                                className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950  hover:shadow-white hover:shadow-sm hover:text-black transition duration-200 ease-in-out transform active:scale-105 bg-pink-900`}>
                                <Image src={"/images/saya_unten.png"} alt={`hostess head shot`}
                                       height={100}
                                       width={100}
                                       className={"rounded-[20]"}/>
                            </div>
                            <p>Add her to the hostesses panel:</p>
                            <div
                                className={`w-[100px] h-[100px] flex justify-center items-center text-white bg-pink-700 hover:bg-pink-900 hover:text-pink-300 transition duration-200 ease-in-out rounded-[17]`}>
                                <button
                                    className={"flex justify-center items-center w-full h-full rounded-[20] transform active:scale-110"}>
                                    <HeartPlus/>
                                </button>
                            </div>
                            <p>And then, add her to the table with the client.</p>
                            <div
                                className={"flex h-[104px] w-[104px] justify-center items-center rounded-[20] border-white border-2 opacity-70 hover:opacity-100 bg-pink-700 hover:bg-pink-950 transition-all duration-200 ease-in-out transform active:scale-90 hover:shadow-sm hover:shadow-white"}>
                                <VenetianMask size={50}/>
                            </div>
                            <p>The order of how you will add the clients or hostesses does not matter.</p>
                        </div>
                    </div>
                )}
                {label === "Inquiries" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Inquiries</h1>
                            <p>Sometimes, the hostess will call you for an urgent service. There are three types of service:</p>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <div
                                    className={`border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                                    <HandHeart scale={25}/>
                                </div>
                                <p>Service - the hostess is calling you to execute a service.</p>
                            </div>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <div
                                    className={`border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                                    <BookHeart scale={25}/>
                                </div>
                                <p>End - the visit has ended and you have to make a decision.</p>
                            </div>
                            <div className={"w-[100%] flex flex-row items-center justify-between gap-5"}>
                                <div
                                    className={`border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                                    <Martini scale={25}/>
                                </div>
                                <p>Buffet - the client wants to eat or drink something.</p>
                            </div>
                            <p>After clicking on the icon, a window will show up. There, you need to make a decision on what is going on.</p>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-10 max-w-[337px]"}>
                            <div className={"flex justify-center items-center relative"}>
                                <div
                                    className={`absolute -left-33 border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                                    <Martini scale={25}/>
                                </div>
                                <button
                                    className={`absolute bottom-3 left-21 border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500 scale-80 hover:bg-red-950 bg-pink-950`}>
                                    <BottleWine size={20}/>
                                </button>
                                <button
                                    className={`absolute bottom-3 left-31 border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500 scale-80 hover:bg-red-950 bg-pink-950`}>
                                    <UtensilsCrossed size={20}/>
                                </button>
                                <Image
                                    src={"/images/hostess_buffet.png"}
                                    alt={"Hostess is ordering"}
                                    height={200}
                                    width={150}/>
                            </div>
                            <div className={"flex justify-center items-center relative"}>
                                <div
                                    className={`absolute -left-10 border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                                    <HandHeart scale={25}/>
                                </div>
                                <div className="grid grid-cols-3 grid-rows-2 gap-2">
                                    <p className={"absolute -top-5 left-5 text-pink-900 text-[20px]"}>Ice refill</p>
                                    <Image
                                        src={`/images/hostess_service_ice.png`}
                                        alt={"Hostess is calling for a service"}
                                        height={200}
                                        width={150}
                                    />
                                    <p className={"absolute -top-5 left-35 text-pink-900 text-[20px]"}>Towel</p>
                                    <Image
                                        src={`/images/hostess_service_towel.png`}
                                        alt={"Hostess is calling for a service"}
                                        height={200}
                                        width={150}
                                    />
                                    <p className={"absolute -top-5 left-60 text-pink-900 text-[20px]"}>Lady glass</p>
                                    <Image
                                        src={`/images/hostess_service_lady_glass.png`}
                                        alt={"Hostess is calling for a service"}
                                        height={200}
                                        width={250}
                                    />
                                    <p className={"absolute -bottom-5 text-pink-900 text-[20px]"}>Guest's glass</p>
                                    <Image
                                        src={`/images/hostess_service_guest_glass.png`}
                                        alt={"Hostess is calling for a service"}
                                        height={200}
                                        width={250}
                                    />
                                    <p className={"absolute -bottom-5 left-34 text-pink-900 text-[20px]"}>Ashtray</p>
                                    <Image
                                        src={`/images/hostess_service_ashtray.png`}
                                        alt={"Hostess is calling for a service"}
                                        height={200}
                                        width={250}
                                    />
                                    <p className={"absolute -bottom-5 left-65 text-pink-900 text-[20px]"}>Menu</p>
                                    <Image
                                        src={`/images/hostess_service_menu.png`}
                                        alt={"Hostess is calling for a service"}
                                        height={200}
                                        width={250}
                                    />
                                </div>
                            </div>
                            <div className={"flex justify-center items-center relative"}>
                                <div
                                    className={`absolute -left-33 border-2 p-2 rounded-[10] z-50 text-pink-300 hover:text-pink-500 bg-pink-950 hover:bg-red-950 duration-200 ease-in-out scale-100 active:scale-105 shadow-sm shadow-pink-300 hover:shadow-pink-500`}>
                                    <BookHeart scale={25}/>
                                </div>
                                <Image
                                    src={`/images/hostess_end_dined.png`}
                                    alt={"Visit has ended"}
                                    height={200}
                                    width={150}
                                />
                            </div>
                            <p className={"absolute -bottom-13"}>Appreciate the visit, pay the tab, give a present or ask him to stay.</p>
                        </div>
                    </div>
                )}
                {label === "Activities" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Activities</h1>
                            <p>You can use activities to boost your club's popularity. Select a performer:</p>
                            <div
                                className={`flex justify-center items-center rounded-[20] border-white border-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-black transition duration-200 ease-in-out transform active:scale-105 bg-pink-900`}>
                                <Image src={"/images/haruka.png"} alt={`Performer head shot`}
                                       height={100}
                                       width={100}
                                       className={"rounded-[20]"}/>
                            </div>
                            <p>And then choose one of the performers activities:</p>
                            <div className={"flex justify-center items-center flex-row text-[15px] bg-pink-900 p-5 rounded-[20] gap-5 text-white scale-55"} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                                <>
                                    <button className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-x-3 scale-100 hover:scale-110"}>
                                        <SkipBack/>
                                    </button>
                                    <div
                                        className={"flex justify-center items-center flex-row border-white border-2 rounded-[15] p-2 hover:bg-pink-950 hover:shadow-white hover:shadow-sm hover:text-pink-200 transition-all duration-200 ease-in-out active:scale-105"}>
                                        <p className={"w-100 flex flex-row justify-center items-center gap-2"}>I wanna change myself!!!</p>
                                        <p className={`w-20 flex flex-row justify-center items-center`}>
                                            <JapaneseYen size={15}/>
                                            <p>100000</p>
                                        </p>
                                        <p className={"w-20 flex flex-row justify-center items-center gap-1"}><HandHeart size={15}/>10000</p>
                                    </div>
                                    <button className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-x-3 scale-100 hover:scale-110"}>
                                        <SkipForward/>
                                    </button>
                                </>
                            </div>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>What is the purpose of this mechanic?</h1>
                            <p>Players can quickly boost their club's popularity with a single action. They can see a video of activities done by hostesses, hosts or other personas.</p>
                        </div>
                    </div>
                )}
                {label === "Jams" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Jams</h1>
                            <p>The whole website offers a music player! With this, there is always some melody in the background of every single page. The main Jam Player looks like this:</p>
                            <div className={"scale-60 text-white z-49 flex justify-center items-center flex-row text-[15px] bg-pink-950 p-3 rounded-[20] gap-5 transition duration-200 ease-in-out"} style={{boxShadow: '0 0 25px rgba(0, 0, 0, .4)'}}>
                                <div
                                    className={"flex bg-red-950 justify-center items-center flex-row border-white border-2 rounded-[15] p-2 transition duration-200 ease-in-out"}>
                                    <div className={"w-100 flex flex-row justify-center items-center gap-3 font-[600]"}>
                                        <Disc3 className={`transition-transform spin`}/>
                                        A pretty good jam
                                        <div className={"flex justify-center items-center gap-1 text-[12px] text-pink-300 ml-5"}>
                                            <p>0:23</p>
                                            <p><AudioWaveform size={15}/></p>
                                            <p>5:55</p>
                                        </div>
                                    </div>
                                </div>
                                <button className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:-translate-x-3 hover:scale-110"}>
                                    <StepBack/>
                                </button>
                                <button className="hover:text-pink-200 transition duration-200 ease-in-out hover:scale-110 transform active:scale-130">
                                    <Pause/>
                                </button>
                                <button className={"hover:text-pink-200 transition duration-200 ease-in-out transform active:translate-x-3 hover:scale-110"}>
                                    <StepForward/>
                                </button>
                            </div>
                            <p>Pausing the player will make the music stop. You can either skip or select the previous song.</p>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Some pages have only one song</h1>
                            <p>Jam Player mainly works in the club's management game. Some of the pages only have a button to either mute or unmute the player:</p>
                            <button
                                    className={"z-50 border-2 rounded-[10] p-2 cursor-alias hover:bg-pink-300 bg-pink-500 text-pink-300 border-pink-300 hover:border-pink-500 hover:text-pink-500 transition-all duration-200 ease-in-out transform active:scale-110 text-white"}>
                                <Volume2/>
                            </button>
                        </div>
                    </div>
                )}
                {label === "Profile card" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Profile card</h1>
                            <p>Here you can check all your statistics and also manage some assets.</p>
                            <div className={"flex items-center justify-center z-50 flex-row gap-10"}>
                                <Image src={"/images/dragon.png"} alt={"Profile picture"} height={50} width={50} className={"rounded-full"}/>
                                <h1 className={`z-50 text-[25px] ${yesteryear.className}`}>
                                    User's card
                                </h1>
                                <Image src={"/images/dragon.png"} alt={"Dragon icon"} height={50} width={50}/>
                            </div>
                            <h2 className={`z-50 text-[25px] ${yesteryear.className}`}>
                                Summed money: 100000000
                            </h2>
                            <h2 className={`z-50 text-[25px] ${yesteryear.className}`}>
                                Summed up popularity: 250000
                            </h2>
                            <div className={"size-60 relative flex justify-center items-center z-50"}>
                                <Image src={"/images/stardust_logo.png"} alt={"Club logo"} width={200} height={100} className={"z-50"}/>
                                <Image src={"/images/kazuki.png"} alt={"Host render"} width={40} height={100}
                                       className={"absolute z-50 ml-55 mt-15"}/>
                                <div
                                    className={"absolute flex h-full w-full scale-200 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,.5)_-50%,_rgba(0,0,0,0)_50%)] z-49"}/>
                            </div>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-20 max-w-[337px]"}>
                            <div className={"w-[100%] flex flex-col items-center justify-between gap-5"}>
                                <button
                                    className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}>
                                    <p>Reset account</p><DatabaseBackup/>
                                </button>
                                <p>Use it to reset your account game data. Helpful when you want a clean save game.</p>
                            </div>
                            <div className={"w-[100%] flex flex-col items-center justify-between gap-5"}>
                                <button
                                    className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}>
                                    <p>Delete account</p><Trash2/>
                                </button>
                                <p>If you want to delete your account for some reason, this button is your friend.</p>
                            </div>
                        </div>
                    </div>
                )}
                {label === "Additional tips" && (
                    <div className={"absolute top-40 left-145 flex flex-row w-[780px] justify-between"}>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <h1 className={`text-[40px] ${yesteryear.className}`}>Nothing to really see here.</h1>
                        </div>
                        <div className={"flex flex-col items-center justify-center gap-5 max-w-[337px]"}>
                            <Image src={"/images/shun_cover.png"} alt={"Akiyamer gives you a thumbs up"} height={200} width={250}/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TutorialItem
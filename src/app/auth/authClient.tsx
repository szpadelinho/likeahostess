'use client'

import {useSession, signIn} from "next-auth/react"
import {Github, MailQuestionMark, Scale} from "lucide-react";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {redirect, useRouter} from "next/navigation"
import {Yesteryear} from "next/font/google"
import IntroBanner from "@/components/introBanner";
import Image from "next/image";
import ReactPlayer from "react-player";
import Navbar from "@/components/navbar";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

export default function AuthClient() {
    const {data: session} = useSession()
    const router = useRouter()

    const [showBanner, setShowBanner] = useState(true)
    const [bannerVisible, setBannerVisible] = useState(true)

    const [isPlaying, setIsPlaying] = useState(false)
    const [muted, setMuted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPlaying(true)
        }, 4500)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (session) {
            router.push("/")
        }
    })

    useEffect(() => {
        const timeout = setTimeout(() => {
            setBannerVisible(false)
            setTimeout(() => setShowBanner(false), 1000)
        }, 5000)
        return () => clearTimeout(timeout)
    }, [])

    if (!session) {
        return (
            <>
                <Image src={"/icon.png"} alt={"App icon"} height={200} width={100} className={"absolute top-5 left-5 z-2"}/>
                <Navbar isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Auth"}/>
                <Image src={"/images/business_card_hands.png"} alt={"Hands handing over a business card"} fill={true} className={"absolute inset-0 z-1"}/>
                {showBanner && (
                    <IntroBanner bannerVisible={bannerVisible} />
                )}
                <div className={"absolute w-screen h-screen flex content-center items-center justify-center mask-center z-2 perspective-dramatic"}>
                    <h1 className={`flex absolute bottom-3 right-3 text-white text-[15px] ${yesteryear.className}`}>{new Date().getFullYear()}</h1>
                    <h4 className={"absolute bottom-4 left-4"}><Link
                        className={"text-white font-bold text-shadow-xl text-[13px] transition duration-200 ease-in-out hover:text-teal-500 hover:shadow-xl hover:text-shadow-teal-700"}
                        target={"_blank"}
                        href={"https://github.com/szpadelinho"}>Check out my other projects!</Link></h4>
                    <div
                        className="relative flex items-center justify-center flex-col h-80 w-160 shadow-lg shadow-gray-500 rotate-x-[1.4deg] mb-10 bg-[url(/images/paper_texture.png)]">
                        <div className={"absolute bottom-4 left-4 flex items-center justify-center flex-row gap-2"}>
                            <button
                                className={`border-black border-2 rounded-sm w-[105px] gap-2 opacity-70 p-2 flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 flex items-center justify-center ${yesteryear.className}`}
                                onClick={() => redirect("/rules")}>
                                <Scale/>
                                <p>Rules</p>
                            </button>
                            <button
                                className={`border-black border-2 rounded-sm w-[105px] gap-2 opacity-70 p-2 flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 flex items-center justify-center ${yesteryear.className}`}
                                onClick={() => redirect("/tutorial")}>
                                <MailQuestionMark/>
                                <p>Tutorial</p>
                            </button>
                        </div>
                        <h2 className={`text-5xl border-t-2 pt-6 border-b-2 pb-6 w-80 text-center opacity-70 ${yesteryear.className}`}>
                            Like a Hostess
                        </h2>
                        <Image src={"/images/dragon2.png"} alt={"Dragon2 icon"} height={200} width={128} className={"absolute top-5 right-5 mix-blend-color-burn invert"}/>
                        <div className={"absolute bottom-4 right-4 flex flex-row gap-2 items-center"}>
                            <button
                                className={"border-black border-2 rounded-sm w-[105px] opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}
                                onClick={() => signIn('github', {redirectTo: "/selection"})}>
                                <Github/><p>Github</p>
                            </button>
                            <button
                                className={"border-black border-2 rounded-sm w-[105px] opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}
                                onClick={() => signIn('discord', {redirectTo: "/selection"})}>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24"
                                     viewBox="0 0 50 50">
                                    <path
                                        d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z"></path>
                                </svg>
                                <p>Discord</p>
                            </button>
                        </div>
                    </div>
                </div>
                <ReactPlayer
                    src={"https://youtube.com/embed/CHE5PWK_ZOE?autoplay=1"}
                    playing={isPlaying}
                    controls={false}
                    autoPlay={true}
                    muted={muted}
                    style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
                />
            </>
        )
    }
}
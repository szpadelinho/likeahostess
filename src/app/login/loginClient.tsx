'use client'

import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {courierPrime} from "@/app/types";
import Navbar from "@/components/navbar";
import ReactPlayer from "react-player";
import {signIn} from "next-auth/react";

const LoginClient = () => {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [identifier, setIdentifier] = useState("")
    const [error, setError] = useState("")

    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)

    const [volume, setVolume] = useState<number>(100)

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    const handleLogin = async () => {
        const res = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Invalid credentials")
            return
        }

        router.push("/")
    }

    return(
        <>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Login"} volume={volume} setVolume={setVolume}/>
            <Image src={"/images/paper_card.png"} alt={"A person holding paper card"} fill={true} className={"object-cover"}/>
            <div className={`${courierPrime.className} absolute inset-0 flex flex-col justify-center items-center text-center gap-5 opacity-70`}>
                <h1 className={"text-[20px] absolute top-30"}>Log to the club management program</h1>
                <input className={"border-1 border-black p-1 w-75 ease-in-out duration-300 hover:bg-black/20"} type={"text"} placeholder={"Your username or email address"} onChange={(e) => setIdentifier(e.target.value)}/>
                <input className={"border-1 border-black p-1 w-75 ease-in-out duration-300 hover:bg-black/20"} type={"password"} placeholder={"Your sincerely secret password"} onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={handleLogin} className={"border-1 border-black p-1 ease-in-out duration-300 hover:bg-black/20"}>
                    Log into the system
                </button>
                {error && <p className={"absolute bottom-50 text-[25px] text-red-500"}>{error}</p>}
            </div>
            <ReactPlayer
                src={`https://youtube.com/embed/Ugdbf0RCrpY?autoplay=1`}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                loop={true}
                muted={muted}
                volume={volume / 100}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
        </>
    )
}

export default LoginClient
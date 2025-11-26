'use client'

import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {courierPrime} from "@/app/types";
import Navbar from "@/components/navbar";
import ReactPlayer from "react-player";
import LoadingBanner from "@/components/loadingBanner";

const RegisterClient = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const [volume, setVolume] = useState<number>(100)
    const [loading, setLoading] = useState<boolean>(true)
    const [quit, setQuit] = useState<boolean>(false)

    useEffect(() => {
        setLoading(false)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])
    
    const handleRegister = async () => {
        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({email, username, password})
        })
        
        const data = await res.json()
        
        if(!res.ok){
            setError(data.error)
            return
        }
        
        router.push("/auth/login")
    }
    
    return(
        <>
            <div className={`z-[1000] fixed h-screen w-screen bg-black duration-500 ease-in-out pointer-events-none ${quit ? "opacity-100" : "opacity-0"}`}/>
            <LoadingBanner show={loading}/>
            <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Register"} volume={volume} setVolume={setVolume} setQuit={setQuit}/>
            <Image src={"/images/paper_card.png"} alt={"A person holding paper card"} fill={true} className={"object-cover"}/>
            <div className={`${courierPrime.className} absolute inset-0 flex flex-col justify-center items-center text-center gap-5 opacity-70`}>
                <h1 className={"text-[20px] absolute top-30"}>Register for the club management program</h1>
                <input className={"border-1 border-black p-1 w-75 ease-in-out duration-300 hover:opacity-100 opacity-70"} type={"email"} placeholder={"Your Email address"} onChange={(e) => setEmail(e.target.value)}/>
                <input className={"border-1 border-black p-1 w-75 ease-in-out duration-300 hover:opacity-100 opacity-70"} type={"text"} placeholder={"Your username"} onChange={(e) => setUsername(e.target.value)}/>
                <input className={"border-1 border-black p-1 w-75 ease-in-out duration-300 hover:opacity-100 opacity-70"} type={"password"} placeholder={"Your sincerely secret password"} onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={handleRegister} className={"border-1 border-black p-1 ease-in-out duration-300 hover:opacity-100 opacity-70"}>
                    Register
                </button>
                {error && <p className={"absolute bottom-50 text-[25px] text-red-500"}>{error}</p>}
            </div>
            <ReactPlayer
                src={`https://youtube.com/embed/k-HDl2SoRBc?autoplay=1`}
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

export default RegisterClient
'use client'

import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import {useRouter} from "next/navigation";
import Navbar from "@/components/navbar";
import {Club, Moneylender, moneylenderType, StoredClub, yesteryear} from "@/app/types";
import LoadingBanner from "@/components/loadingBanner";
import {useVolume} from "@/app/context/volumeContext";
import { Loan } from "@/app/types"
import {handleLoanTransaction, handleMoneyTransaction} from "@/lib/transactions";
import { useSession } from "next-auth/react";

export const MoneylenderClient = () => {
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const {volume, setVolume} = useVolume()
    const [value, setValue] = useState(100000)
    const [loading, setLoading] = useState<boolean>(true)
    const [show, setShow] = useState(false)
    const [fade, setFade] = useState(false)
    const [loan, setLoan] = useState<Loan | null>(null)
    const [clubData, setClubData] = useState<StoredClub | null>(null)
    const [money, setMoney] = useState<number>(0)
    const [club, setClub] = useState<Club | null>(null)
    const [moneylender, setMoneylender] = useState<Moneylender | null>(null)

    const router = useRouter()
    const { data: session } = useSession()

    useEffect(() => {
        if (Math.random() > 0.1){
            setMoneylender(moneylenderType[0])
        }
        else
        {
            setMoneylender(moneylenderType[1])
        }
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if(!stored) return console.error("No such element as localStorage on moneylenderClient")
        const parsedClub: StoredClub = JSON.parse(stored)
        setClubData(parsedClub)

        fetch(`/api/user-club?clubId=${parsedClub.id}`, {method: "POST"})
            .then(async (res) => {
                const data = await res.text()
                if (!res.ok) {
                    console.error("API error:", res.status, data)
                    throw new Error("Failed to fetch club data")
                }
                return JSON.parse(data)
            })
            .then((userData) => {
                const mergedClub: Club = {
                    name: parsedClub.name,
                    host: parsedClub.host,
                    logo: parsedClub.logo,
                    money: userData.money,
                    popularity: userData.popularity,
                    supplies: userData.supplies
                }
                setMoney(userData.money)
                setClub(mergedClub)
            })
        setLoading(false)
    }, [])

    useEffect(() => {
        if(clubData){
            const fetchLoan = async () => {
                try{
                    const res = await fetch(`/api/loans?clubId=${clubData.id}`, {method: "GET"})
                    const data = await res.json()
                    if(data === null) return
                    setLoan(data)
                }
                catch(err){
                    console.log("Failed to fetch loans", err)
                }
            }
            fetchLoan()
        }
    }, [clubData])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    const setContract = (show: boolean) => {
        if (show) {
            setShow(true)
            setFade(true)
            setTimeout(() => {
                setFade(false)
            }, 50)
        } else {
            setFade(true)
            setTimeout(() => {
                setShow(false)
                setFade(false)
            }, 300)
        }
    }

    return(
        <>
            <LoadingBanner show={loading}/>
            {moneylender && (
                <>
                    <Image src={`/images/${moneylender.photo}.png`} alt={"Mine's office"} fill={true} className={"object-cover"}/>
                    <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Moneylender"} setContract={setContract} paper={show}/>
                    {club !== null && (
                        <div
                            className={`${yesteryear.className} bg-cover transform perspective-[1000px] translate-all bg-[url(/images/paper_texture.png)] gap-10 absolute rounded-[5] bottom-5 right-5 h-40 p-2 text-center content-center items-center flex flex-row text-[20px] text-black z-1`}>
                            <Image
                                className={"flex"}
                                src={club.host.image}
                                alt={"Host"}
                                height={500}
                                width={100}
                            />
                            <div className={"flex flex-col justify-center items-center mr-5"}>
                                <h1 className={"text-[30px] text-nowrap text-stone-950"}>
                                    {club.host.name} {club.host.surname}
                                </h1>
                                <h2 className={"text-[25px] text-stone-700"}>
                                    {club.name}
                                </h2>
                                <h2 className={"text-[30px] text-stone-500 font-[600] flex flex-row justify-center items-center"}>
                                    ¥{money}
                                </h2>
                            </div>
                        </div>
                    )}
                    <div className={"absolute flex justify-center items-center w-screen h-screen"}>
                        <button
                            onClick={() => {setContract(!show)}}
                            className={`absolute h-25 w-25 ${moneylender.name === "Hana" ? "top-80 left-200" : "top-120"} flex text-white flex-col items-center justify-center hover:backdrop-blur-sm duration-300 ease-in-out rounded-full p-2`}/>
                        {show && (
                            <div className={`${yesteryear.className} ${fade ? "opacity-0 scale-0" : "opacity-100 scale-100"} transform perspective-[1000px] translate-all origin-center z-1 text-[25px] flex flex-col justify-center items-center bg-cover bg-[url(/images/paper_texture.png)] h-160 w-120 duration-300 ease-in-out`}>
                                {loan ? (
                                    <>
                                        <h1 className={"text-[75px]"}>Pay off a loan</h1>
                                        <p>You are willing to pay off an amount of:</p>
                                        <h1 className={"text-[75px]"}>¥{loan.amount}</h1>
                                        <p className={"w-95"}>I fully understand and I am fully obliged to return all of the important money in paper as of the moment of signing this deal.</p>
                                        <button
                                            onClick={() => {
                                                if(clubData){
                                                    handleMoneyTransaction({session, clubData, setMoney, setClub, change: -loan.amount}).then()
                                                    handleLoanTransaction({session, clubData, amount: loan.amount, type: "Payment"}).then()
                                                    setLoan(null)
                                                }
                                            }}
                                            className={"border-b-2 border-black w-75 opacity-50 hover:opacity-100 duration-300 ease-in-out"}>
                                            Your sign here...
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h1 className={"text-[75px]"}>Take out a loan</h1>
                                        <p>You are willing to loan out an amount of:</p>
                                        <p className={"text-[15px] absolute top-75"}>The loan must be in range of ¥100000 and ¥999999999</p>
                                        <div className={"relative flex flex-row justify-center items-center border-b-2 border-black m-10"}>
                                            <p className={"text-[40px]"}>
                                                ¥
                                            </p>
                                            <input required={true} type={"number"} value={value} min={0} max={999999999} className={"text-[40px] text-center flex justify-center items-center"} onChange={e => {
                                                if(e.target.value.trim() === "") return
                                                const num = parseInt(e.target.value)
                                                if(isNaN(num)) {
                                                    setValue(100000)
                                                    return
                                                }
                                                else {
                                                    setValue(num)
                                                }
                                            }}/>
                                        </div>
                                        <p className={"w-95"}>By agreeing to this deal, you understand the importance of fair play rules. You must pay off your debt in time, or else... </p>
                                        <p className={"w-95"}>You have a day to pay off your debt. The count starts by the moment this paper is signed by you.</p>
                                        <button
                                            onClick={() => {
                                                if(isNaN(value)) {
                                                    setValue(100000)
                                                    return
                                                }
                                                if(value < 100000) {
                                                    setValue(100000)
                                                }
                                                else if(value > 999999999){
                                                    setValue(999999999)
                                                }
                                                else {
                                                    if(clubData){
                                                        handleMoneyTransaction({session, clubData, setMoney, setClub, change: value}).then()
                                                        handleLoanTransaction({session, clubData, amount: value, type: "Takeout"}).then()
                                                        setLoading(true)
                                                        setTimeout(() => {
                                                            router.push("/")
                                                        }, 500)
                                                    }
                                                }
                                            }}
                                            className={"border-b-2 border-black w-75 opacity-50 hover:opacity-100 duration-300 ease-in-out"}>
                                            Your sign here...
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <ReactPlayer
                        src={`https://youtube.com/embed/${moneylender.song}?autoplay=1`}
                        playing={isPlaying}
                        controls={false}
                        autoPlay={true}
                        muted={muted}
                        volume={volume / 100}
                        loop={true}
                        className={"flex absolute top-0 left-0 z-[-1]"}
                        style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
                    />
                </>
            )}
        </>
    )
}
'use client'

import Image from "next/image";
import {DatabaseBackup, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import {Session} from "next-auth";
import Navbar from "@/components/navbar";
import {CLUB_RANKS, cookie, FavClub, getLevel, getRank, Rank, StoredClub} from "@/app/types";
import LoadingBanner from "@/components/loadingBanner";
import {useVolume} from "@/app/context/volumeContext";
import {signOut} from "next-auth/react";

interface ProfileClientProps {
    session?: Session | null,
    totals: {
        money: number,
        popularity: number
        supplies: number
    } | undefined,
    favClub: FavClub,
}

const ProfileClient = ({session, totals, favClub}: ProfileClientProps) => {
    const router = useRouter()
    const [clubId, setClubId] = useState<number | null>(null)
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const {volume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)
    const [experience, setExperience] = useState<number>(0)
    const [rank, setRank] = useState<Rank>({lvl: 0, rank: CLUB_RANKS[0]})
    const [edit, setEdit] = useState<boolean>(false)
    const [nick, setNick] = useState<string>("")
    const [avatar, setAvatar] = useState<string>("")

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const res = await fetch("/api/user", {method: "GET"})
                const data = await res.json()
                setExperience(data.experience)
            } catch (err) {
                console.log("Failed to fetch user experience", err)
            }
        }
        fetchExperience()
    }, [])

    useEffect(() => {
        if (session?.user) {
            setNick(session.user.name ?? "");
            setAvatar(session.user.image ?? "");
        }
    }, [session])

    useEffect(() => {
        const lvl = getLevel(experience)
        const rank = getRank(lvl)
        setRank({lvl, rank})
    }, [experience])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if(!stored) return console.error("No such element as localStorage on Main")
        const parsedClub: StoredClub = JSON.parse(stored)
        setClubId(Number(parsedClub.id))
    }, [])

    useEffect(() => {
        if(session){
            setLoading(false)
        }
    }, [])

    const handleReset = async () => {
        const resClub = await fetch(`/api/user-club/reset?clubId=${clubId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session?.user?.id }),
        })
        const resUser = await fetch(`/api/user/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
        if (resClub.ok && resUser.ok) {
            console.log("Successfully reset user data and stats")
            signOut({redirectTo: "/auth"}).then()
        }
    }

    const handleDelete = async () => {
        const res = await fetch('/api/deleteUser', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session?.user?.id }),
        })
        if (res.ok) {
            router.push('/auth')
            console.log("Successfully deleted user data and stats")
        }
    }

    return(
        <>
            <LoadingBanner show={loading}/>
            <div className={"grayscale-100"}>
                <ReactPlayer
                    src={"https://youtube.com/embed/hU7iW2-RtzI?autoplay=1"}
                    playing={isPlaying}
                    controls={false}
                    autoPlay={true}
                    muted={muted}
                    volume={volume / 100}
                    className={"flex absolute top-0 left-0 z-[-1]"}
                    loop={true}
                    style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
                />
                <Image src={"/images/paper_card.png"} alt={"Paper card being held"} fill={true}
                       className={"absolute inset-0"}/>
                {edit && (
                    <div className={"absolute inset-0 flex items-center justify-center z-[200] text-black backdrop-blur-sm"} onClick={() => setEdit(false)}>
                        <div className={"flex justify-center items-center z-[999]"}>
                            <Image src={"/images/paper_texture.png"} alt={"Paper card"} height={100} width={600} className={"z-1"}/>
                            <div className={`absolute flex justify-center items-center flex-col gap-2 z-50 ${cookie.className} text-[40px]`}>
                                <h1>Nickname:</h1>
                                <input required={true} type={"text"} value={nick} className={"w-100 border-black border-2 rounded-sm opacity-70 hover:opacity-100 text-[30px] text-center flex justify-center items-center"} onChange={e => {
                                    setNick(e.target.value)
                                }}/>
                                <h1>Profile picture:</h1>
                                <input required={true} type={"text"} value={avatar} className={"w-100 border-black border-2 rounded-sm opacity-70 hover:opacity-100 text-[30px] text-center flex justify-center items-center"} onChange={e => {
                                    setAvatar(e.target.value)
                                }}/>
                                <button className={"border-black border-2 rounded-sm opacity-70 text-[25px] p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}>
                                    Apply changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className={"h-screen w-screen flex items-center justify-center z-50 text-black"}>
                    <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Profile"} setEdit={setEdit}/>
                    <div className={"absolute top-35 flex items-center justify-center z-50 flex-row gap-10"}>
                        <Image src={session?.user?.image ?? "/images/dragon.png"} alt={"Profile picture"} height={50} width={50} className={"rounded-full border-2 border-black"}/>
                        <h1 className={`z-50 text-[50px] ${cookie.className}`}>
                            {session?.user?.name}'s card
                        </h1>
                        <Image src={"/images/dragon.png"} alt={"Dragon icon"} height={50} width={50}/>
                    </div>
                    {totals && (
                        <div className={`absolute top-55 flex flex-col text-center justify-center ${cookie.className} text-[25px] z-50`}>
                            <h2>
                                Currently at level {Math.floor(experience / 1000)}
                            </h2>
                            <h2>
                                Experience: {experience}/1000
                            </h2>
                            <h2>
                                Title: {rank.rank}
                            </h2>
                            <h2>
                                Summed money: ¥{totals?.money}
                            </h2>
                            <h2>
                                Summed up popularity: {totals?.popularity}
                            </h2>
                            <h2>
                                Average supply level: {Math.round(totals.supplies * 100) / 100}%
                            </h2>
                        </div>
                    )}
                    <div className={"absolute top-120 flex justify-center items-center gap-1 flex-col"}>
                        <h1 className={`z-50 text-[30px] ${cookie.className}`}>
                            Favourite club
                        </h1>
                        <div className={"relative flex justify-center items-center z-50"}>
                            <Image src={favClub.club.logo} alt={"Club logo"} width={200} height={100} className={"z-50"}/>
                            <Image src={favClub.club.host.image} alt={"Host render"} width={40} height={100}
                                   className={"absolute z-50 ml-55 mt-15"}/>
                            <div
                                className={"absolute flex h-full w-full scale-200 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,.5)_-50%,_rgba(0,0,0,0)_50%)] z-49"}/>
                        </div>
                    </div>
                    <div className={"flex justify-center items-center gap-5 flex-row absolute bottom-50 left-[42%]"}>
                        <button
                            className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}                        onClick={handleReset}>
                            <p>Reset account</p><DatabaseBackup/>
                        </button>
                        <button
                            className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}                        onClick={handleDelete}>
                            <p>Delete account</p><Trash2/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileClient
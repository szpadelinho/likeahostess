'use client'

import Image from "next/image";
import {DatabaseBackup, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import Navbar from "@/components/navbar";
import {CLUB_RANKS, cookie, FavClub, getLevel, getRank, ProfileUser, Rank, StoredClub} from "@/app/types";
import LoadingBanner from "@/components/loadingBanner";
import {useVolume} from "@/app/context/volumeContext";
import {signOut, useSession} from "next-auth/react";

interface ProfileClientProps {
    totals: {
        money: number,
        popularity: number
        supplies: number
    } | undefined,
    favClub: FavClub,
    user: ProfileUser,
    isMe: boolean
}

const ProfileClient = ({totals, favClub, user, isMe}: ProfileClientProps) => {
    const router = useRouter()
    const {data: session, update} = useSession()
    const [clubId, setClubId] = useState<number | null>(null)
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const {volume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)
    const [rank, setRank] = useState<Rank>({lvl: 0, rank: CLUB_RANKS[0]})
    const [edit, setEdit] = useState<boolean>(false)
    const [nick, setNick] = useState(user.name ?? "")
    const [avatar, setAvatar] = useState(user.image ?? "")
    const [error, setError] = useState<string>("")

    const avatarSrc = avatar
        ? `${avatar}?v=${user.image ? "1" : "0"}`
        : "/images/dragon.png"

    useEffect(() => {
        const lvl = getLevel(user.experience)
        const rank = getRank(lvl)
        setRank({lvl, rank})
    }, [user.experience])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const stored = localStorage.getItem("selectedClub")
        if (!stored) return console.error("No such element as localStorage on Main")
        const parsedClub: StoredClub = JSON.parse(stored)
        setClubId(Number(parsedClub.id))
    }, [])

    useEffect(() => {
        if (session && clubId) {
            setLoading(false)
        }
    }, [session, clubId])

    const handleReset = async () => {
        const resClub = await fetch(`/api/user-club/reset?clubId=${clubId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId: session?.user?.id}),
        })
        const resUser = await fetch(`/api/user/reset`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
        if (resClub.ok && resUser.ok) {
            console.log("Successfully reset user data and stats")
            signOut({redirectTo: "/auth"}).then()
        }
    }

    const handleDelete = async () => {
        const res = await fetch('/api/deleteUser', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId: session?.user?.id}),
        })
        if (res.ok) {
            router.push('/auth')
            console.log("Successfully deleted user data and stats")
        }
    }

    const handleUpdate = async () => {
        if (!nick || !avatar) return setError("Empty edit inputs!")
        const res = await fetch(`/api/user/profile`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: nick,
                image: avatar
            })
        })
        if (res.ok) {
            await update({
                name: nick,
                image: avatar,
            })
            setEdit(false)
        } else {
            setError("Something went wrong")
        }
    }

    return (
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
                <div
                    className={`absolute inset-0 flex items-center justify-center z-[200] text-black backdrop-blur-sm duration-500 ease-in-out transition ${edit ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onClick={() => setEdit(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={"flex justify-center items-center z-[999] bg-[url(/images/paper_texture.png)] w-150 h-100 shadow-md perspective-dramatic transform rotate-x-[1.4deg] shadow-black"}>
                        <div
                            className={`absolute flex justify-center items-center flex-col gap-2 z-50 ${cookie.className} text-[40px]`}>
                            <h1>Nickname:</h1>
                            <input required={true} type={"text"} value={nick}
                                   className={"w-125 border-black border-2 rounded-sm opacity-70 hover:opacity-100 text-[25px] text-center flex justify-center items-center"}
                                   onChange={e => {
                                       setNick(e.target.value)
                                   }}/>
                            <h1>Profile picture:</h1>
                            <input required={true} type={"text"} value={avatar}
                                   className={"w-125 border-black border-2 rounded-sm opacity-70 hover:opacity-100 text-[25px] text-center flex justify-center items-center"}
                                   onChange={e => {
                                       setAvatar(e.target.value)
                                   }}/>
                            <button
                                onClick={handleUpdate}
                                className={"border-black border-2 rounded-sm opacity-70 text-[25px] p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}>
                                Apply changes
                            </button>
                            <h1 className={"absolute text-[25px] -right-10 -bottom-10 text-red-500 border-b-2 border-black"}>{error}</h1>
                        </div>
                    </div>
                </div>
                <div className={"h-screen w-screen flex items-center justify-center z-50 text-black"}>
                    <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Profile"}
                            setEdit={setEdit} isMe={isMe}/>
                    <div className={"absolute top-35 flex items-center justify-center z-50 flex-row gap-10"}>
                        <img key={avatarSrc} src={avatarSrc || "/images/dragon.png"} alt={"Profile picture"} height={64}
                             width={64} className={"rounded-full border-2 border-black"}/>
                        <h1 className={`z-50 text-[50px] ${cookie.className}`}>
                            {user.name}'s card
                        </h1>
                        <Image src={"/images/dragon.png"} alt={"Dragon icon"} height={64} width={64}/>
                    </div>
                    {totals && (
                        <div
                            className={`absolute top-55 flex flex-col text-center justify-center ${cookie.className} text-[25px] z-50`}>
                            <h2>
                                Currently at level {Math.floor(user.experience / 1000)}
                            </h2>
                            <h2>
                                Experience: {user.experience}/1000
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
                            {favClub && (
                                <>
                                    <Image src={favClub.club.logo} alt={"Club logo"} width={200} height={100}
                                           className={"z-50"}/>
                                    <Image src={favClub.club.host.image} alt={"Host render"} width={40} height={100}
                                           className={"absolute z-50 ml-55 mt-15"}/>
                                </>
                            )}
                            <div
                                className={"absolute flex h-full w-full scale-200 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,.5)_-50%,_rgba(0,0,0,0)_50%)] z-49"}/>
                        </div>
                    </div>
                    {isMe && (
                        <div className={"flex justify-center items-center gap-5 flex-row absolute bottom-50 left-[42%]"}>
                            <button
                                className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}
                                onClick={handleReset}>
                                <p>Reset account</p><DatabaseBackup/>
                            </button>
                            <button
                                className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}
                                onClick={handleDelete}>
                                <p>Delete account</p><Trash2/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProfileClient
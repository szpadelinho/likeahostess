'use client'

import {useRouter} from "next/navigation";
import React, {useEffect, useMemo, useState} from "react";
import {useVolume} from "@/app/context/volumeContext";
import {useSession} from "next-auth/react";
import ReactPlayer from "react-player";
import Navbar from "@/components/navbar";
import Image from "next/image";
import LoadingBanner from "@/components/loadingBanner";
import {cookie, Ranking} from "@/app/types";
import {BanknoteArrowUp, Box, Laugh} from "lucide-react";

const RankingClient = () => {
    const router = useRouter()
    const {data: session} = useSession()
    const [isPlaying, setIsPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const {volume} = useVolume()
    const [loading, setLoading] = useState<boolean>(true)
    const [totals, setTotals] = useState<{money: Ranking[], popularity: Ranking[], supplies: Ranking[]} | null>(null)
    const [page, setPage] = useState<"Money" | "Popularity" | "Supplies">("Money")

    const ranking = useMemo(() => {
        if(!totals) return null

        switch(page){
            case "Money":
                return totals.money
            case "Popularity":
                return totals.popularity
            case "Supplies":
                return totals.supplies
            default:
                return []
        }
    }, [page, totals])

    useEffect(() => {
        const timer = setTimeout(() => {
            setMuted(false)
        }, 1)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const fetchRanking = async () => {
            try{
                const res = await fetch("/api/ranking")
                const data = await res.json()
                setTotals(data)
            }
            catch(err){
                console.error("Error on ranking fetch in rankingClient: ", err)
            }
        }

        fetchRanking()
    }, [])

    useEffect(() => {
        if(session && totals !== null){
            setLoading(false)
        }
    }, [session, totals])

    return(
        <>
            <LoadingBanner show={loading}/>
            <div className={"grayscale-100"}>
                <Image src={"/images/paper_card.png"} alt={"Paper card being held"} fill={true}
                       className={"absolute inset-0"}/>
                <div className={"h-screen w-screen flex flex-col items-center justify-center z-50 text-black"}>
                    <Navbar router={router} isPlaying={isPlaying} setIsPlaying={setIsPlaying} page={"Ranking"}/>
                    <h1 className={`z-50 text-[50px] ${cookie.className}`}>
                        Ranking
                    </h1>
                    <h1 className={`z-50 text-[25px] ${cookie.className}`}>
                        Top {page}
                    </h1>
                    <table className={"z-50 text-left table-auto border-collapse m-2"}>
                        <thead>
                            <tr>
                                <th className={"px-4 py-2 border-black border-1"}>
                                    #
                                </th>
                                <th className={"px-4 py-2 border-black border-1"}>
                                    Name
                                </th>
                                <th className={"px-4 py-2 border-black border-1"}>
                                    {page}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {totals && page && ranking && ranking.map((entry, i) => {
                                const isUser = entry.id === session?.user?.id
                                return(
                                    <tr key={entry.id} className={`z-2 ${isUser && "text-[800]"}`}>
                                        <td className={"px-4 py-2 border-black border-1"}>
                                            {i + 1}.
                                        </td>
                                        <td className={"px-4 py-2 border-black border-1"}>
                                            {entry.name ?? "Unknown guy"}
                                        </td>
                                        <td className={"px-4 py-2 border-black border-1"}>
                                            {page === "Money" ? entry.money.toLocaleString() :
                                                page === "Popularity" ? entry.popularity.toLocaleString() :
                                                    `${entry.supplies.toLocaleString()}%`
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className={"flex justify-center items-center gap-2 z-2"}>
                        <button
                            className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}
                            onClick={() => setPage("Money")}>
                            <p>Money</p><BanknoteArrowUp/>
                        </button>
                        <button
                            className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}
                            onClick={() => setPage("Popularity")}>
                            <p>Popularity</p><Laugh/>
                        </button>
                        <button
                            className={"border-black border-2 rounded-sm opacity-70 p-2 flex justify-between flex-row cursor-pointer hover:opacity-100 transition-all duration-200 ease-in-out transform active:scale-110 gap-2"}
                            onClick={() => setPage("Supplies")}>
                            <p>Supplies</p><Box/>
                        </button>
                    </div>
                </div>
            </div>
            <ReactPlayer
                src={"https://youtube.com/embed/R0z9WQQyMEw?autoplay=1"}
                playing={isPlaying}
                controls={false}
                autoPlay={true}
                muted={muted}
                volume={volume / 100}
                className={"flex absolute top-0 left-0 z-[-1]"}
                loop={true}
                style={{height: '0px', width: '0px', visibility: 'hidden', position: 'absolute'}}
            />
        </>
    )
}

export default RankingClient
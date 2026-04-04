import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react"
import Image from "next/image"
import {Coins, JapaneseYen} from "lucide-react"
import {Club, yesteryear} from "@/app/types";
import {cards, Player} from "@/lib/casino";
import MessageSplash from "@/components/messageSplash";

interface TexasHoldEmProps {
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void,
    stage: "PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null,
    setStage: (value: (((prevState: ("PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) => ("PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) | "PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) => void
    playerActionPending: boolean
    setPlayerActionPending: (value: (((prevState: boolean) => boolean) | boolean)) => void
    setShowCard: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void
    clubData: Club
    setDeck: (value: (((prevState: string[]) => string[]) | string[])) => void
}

interface TexasHoldEmRef {
    startGame: () => void,
    turn: (action: "Raise" | "Call" | "Fold") => void,
}

export const TexasHoldEm = forwardRef<TexasHoldEmRef, TexasHoldEmProps>(
    ({
         setScore,
         stage,
         setStage,
         playerActionPending,
         setPlayerActionPending,
         setShowCard,
         clubData,
         setDeck
     }, ref) => {
        const [communityCards, setCommunityCards] = useState<string[]>([])
        const [players, setPlayers] = useState<Player[]>([])
        const [pot, setPot] = useState<number>(0)
        const [gameId, setGameId] = useState<string | null>(null)

        const [message, setMessage] = useState<{ text: string; id: number } | null>(null)

        const showMessage = (text: string) => {
            setMessage({ text, id: Date.now() })
        }

        const startGame = async () => {
            showMessage("No more bets!")

            const res = await fetch("api/casino/texasholdem/start", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    clubData
                })
            })
            const data = await res.json()

            setPlayers(data.players)
            setCommunityCards(data.communityCards)
            setDeck(data.deck)
            setStage(data.stage)
            setScore(data.score)
            setPot(data.pot)
            setPlayerActionPending(true)
            setGameId(data.gameId)
        }

        const turn = async (action: "Raise" | "Call" | "Fold") => {
            if (!playerActionPending) return
            setPlayerActionPending(false)
            showMessage(`${action}!`)

            const res = await fetch("api/casino/texasholdem/action", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    clubData,
                    gameId,
                    action
                })
            })

            const data = await res.json()

            setPlayers(data.gameData.players)
            setCommunityCards(data.gameData.communityCards)
            setDeck(data.gameData.deck)
            setStage(data.gameData.stage)
            setPot(data.gameData.pot)
            setScore(data.gameData.score ?? null)

            if (data.gameData.stage !== "Showdown") {
                setPlayerActionPending(true)
            }
        }

        useImperativeHandle(ref, () => ({startGame, turn}))

        useEffect(() => {
            if (stage === "Showdown") {
                setPlayerActionPending(false)
            }
        }, [stage, setPlayerActionPending])

        return (
            <div className="flex flex-col justify-center items-center h-full w-full">
                <MessageSplash message={message}/>
                <div className="flex gap-5 absolute">
                    {communityCards.map((card, i) => (
                        <Image key={i} src={`/cards/${card}.png`} alt={card} height={200} width={125}
                               className={"rounded-[10] transition-transform duration-300 translate hover:scale-110 active:scale-125"}
                               onClick={() => setShowCard(card)}/>
                    ))}
                </div>

                {players.map((p, i) => (
                    <div key={i}
                         className={`${i === 1 ? "absolute left-5" : i === 0 ? "absolute bottom-5" : i === 2 ? "absolute right-5" : "absolute top-5"} flex flex-col items-center gap-2 justify-center ${p.folded ? "opacity-50" : "opacity-100"}`}>
                        <h2 className={`${i === 3 ? "-bottom-15" : "-top-15"} ${yesteryear.className} absolute text-[40px] text-nowrap`}>{p.name}</h2>
                        <div className="flex gap-2 relative justify-center items-center">
                            {p.hand.map((card, j) => (
                                <Image key={j}
                                       src={`/cards/${stage === "Showdown" || p.name === clubData.host.surname ? card : "default"}.png`}
                                       alt={card} height={180} width={110}
                                       className={"rounded-[10] transition-transform duration-300 translate hover:scale-110 active:scale-125"}
                                       onClick={() => {
                                           if (stage !== "Showdown" && p.name !== clubData.host.surname) {
                                               setShowCard(cards.default)
                                           } else {
                                               setShowCard(card)
                                           }
                                       }}/>
                            ))}
                            <div
                                className={`${(i === 1 || i === 2) ? "-bottom-25" : i === 0 ? "-left-40" : "-right-40"} absolute text-[30px] text-center ${yesteryear.className} flex flex-col items-center justify-center`}>
                                <p className={"flex flex-row justify-center items-center gap-2"}>{p.chips} <Coins/></p>
                                <p className={"flex flex-row justify-center items-center gap-2"}>
                                    <JapaneseYen/>{p.currentBet}</p>
                            </div>
                            <Image className={`${i === 0 ? "-right-50" : i === 3 ? "-left-50" : "-bottom-60"} absolute`}
                                   src={`/images/${p.image}.png`} alt={"Poker face :D"} height={150} width={150}/>
                            {p.folded &&
                                <p className={`${yesteryear.className} text-[70px] absolute z-50 text-pink-600`}>FOLDED</p>}
                        </div>
                    </div>
                ))}
                <p className={`${yesteryear.className} absolute top-10 right-10 text-[40px]`}>Pot: {pot}</p>
            </div>
        )
    })

TexasHoldEm.displayName = "TexasHoldEm"
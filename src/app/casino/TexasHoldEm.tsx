import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react"
import Image from "next/image"
import {Coins} from "lucide-react"
import {Club, Dealer, yesteryear} from "@/app/types";
import {cards, Player} from "@/lib/casino";
import MessageSplash from "@/components/messageSplash";
import {ChipContainer} from "@/app/casino/ChipContainer";

interface TexasHoldEmProps {
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void,
    stage: "PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null,
    setStage: (value: (((prevState: ("PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) => ("PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) | "PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) => void
    playerActionPending: boolean
    setPlayerActionPending: (value: (((prevState: boolean) => boolean) | boolean)) => void
    setShowCard: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void
    clubData: Club
    setDeck: (value: (((prevState: string[]) => string[]) | string[])) => void
    dealer: Dealer | null
    setMoney: (fn: (x: number) => number) => void
    bet: number
    setMaxBet: (value: (((prevState: number) => number) | number)) => void
    setPokerBet: (value: (((prevState: number) => number) | number)) => void
}

interface TexasHoldEmRef {
    startGame: () => void,
    turn: (action: "Raise" | "Call" | "Fold") => void,
    raiseAmount?: number
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
         setDeck,
         dealer,
         setMoney,
         bet,
         setMaxBet,
         setPokerBet
     }, ref) => {
        const [communityCards, setCommunityCards] = useState<string[]>([])
        const [players, setPlayers] = useState<Player[]>([])
        const [pot, setPot] = useState<number>(0)
        const [gameId, setGameId] = useState<string | null>(null)

        const [message, setMessage] = useState<{ text: string; id: number } | null>(null)

        const showMessage = (text: string) => {
            setMessage({text, id: Date.now()})
        }

        const startGame = async () => {
            showMessage("No more bets!")

            const res = await fetch("api/casino/texasholdem/start", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    clubData,
                    dealer,
                    bet
                })
            })
            const data = await res.json()

            setPlayers(data.players)
            setMaxBet(data.players[0].chips)
            setPokerBet(data.players[0].currentBet + 1000)
            setCommunityCards(data.communityCards)
            setDeck(data.deck)
            setStage(data.stage)
            setScore(data.score)
            setPot(data.pot)
            setPlayerActionPending(true)
            setGameId(data.gameId)
        }

        const turn = async (action: "Raise" | "Call" | "Fold", raiseAmount?: number) => {
            if (!playerActionPending) return
            setPlayerActionPending(false)
            const actionMessage = action === "Raise" && raiseAmount
                ? `Raise to ¥${raiseAmount}!`
                : `${action}!`
            showMessage(actionMessage)

            const res = await fetch("api/casino/texasholdem/action", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    clubData,
                    gameId,
                    action,
                    raiseAmount
                })
            })

            const data = await res.json()

            setPlayers(data.gameData.players)
            setMaxBet(data.gameData.players[0].chips)
            setPokerBet(Math.max(...data.gameData.players.map((player: Player) => player.currentBet)) + 1000)
            setCommunityCards(data.gameData.communityCards)
            setDeck(data.gameData.deck)
            setStage(data.gameData.stage)
            setPot(data.gameData.pot)
            setScore(data.gameData.score ?? null)

            if (data.gameData.stage === "Showdown" && data.gameData.score.includes(data.gameData.players[0].surname)) setMoney(prev => prev + data.gameData.pot)

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
            <div className="flex flex-col justify-center items-center h-full w-full relative">
                <MessageSplash message={message}/>
                <div className={"gap-2 flex absolute"}>
                    {communityCards.map((card, i) => (
                        <Image key={i} src={`/cards/${card}.png`} alt={card} height={200} width={125}
                               style={{zIndex: i}}
                               className={`rounded-[10] transition-transform duration-300 translate hover:scale-110 active:scale-125`}
                               onClick={() => setShowCard(card)}/>
                    ))}
                </div>
                {players.map((p, i) => (
                    <div key={i}
                         className={`${i === 1 ? "left-5" : i === 0 ? "bottom-5" : i === 2 ? "right-5" : "top-5"} absolute flex flex-col items-center justify-center ${p.folded ? "opacity-50" : "opacity-100"}`}>
                        <h2 className={`${i === 3 ? "-bottom-15" : "-top-15"} ${yesteryear.className} absolute text-[40px] text-nowrap`}>{p.name}</h2>
                        <div className="flex relative justify-center items-center">
                            <div className={"flex flex-row justify-center items-center"}>
                                {p.hand.map((card, j) => (
                                    <Image key={j}
                                           src={`/cards/${stage === "Showdown" || p.name === clubData.host.surname ? card : "default"}.png`}
                                           alt={card} height={180} width={110}
                                           className={`${j === 0 ? "-rotate-15" : "rotate-15 -ml-15"} rounded-[10] transition-transform duration-300 translate hover:scale-110 active:scale-125`}
                                           onClick={() => {
                                               if (stage !== "Showdown" && p.name !== clubData.host.surname) {
                                                   setShowCard(cards.default)
                                               } else {
                                                   setShowCard(card)
                                               }
                                           }}/>
                                ))}
                            </div>
                            <div
                                className={`${i === 1 ? "-bottom-30" : i === 2 ? "-bottom-30" : i === 3 ? "-right-40" : "-left-40"} absolute text-center ${yesteryear.className} flex flex-col items-center justify-center`}>
                                <p className={"text-[30px] flex flex-row justify-center items-center gap-2"}>
                                    {p.chips} <Coins/>
                                </p>
                                <ChipContainer amount={p.currentBet}/>
                                <p className={"text-[20px] flex text-stone-400 flex-row justify-center items-center gap-2"}>
                                    ¥{p.currentBet}
                                </p>
                            </div>
                            <Image className={`${i === 1 ? "left-45" : i === 2 ? "right-45" : i === 0 ? "-right-50" : "-left-50"} absolute`}
                                   src={`/images/${p.image}.png`} alt={`Poker face (${p.name}) :D`} height={150} width={150}/>
                            {p.folded &&
                                <p className={`${yesteryear.className} text-[70px] absolute z-50 text-pink-600`}>FOLDED</p>}
                        </div>
                    </div>
                ))}
                <p className={`${yesteryear.className} absolute top-10 right-10 text-[40px]`}>Pot: ¥{pot}</p>
            </div>
        )
    })

TexasHoldEm.displayName = "TexasHoldEm"
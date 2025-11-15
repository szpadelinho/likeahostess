import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react"
import Image from "next/image"
import {Coins, JapaneseYen} from "lucide-react"
import {Club, yesteryear} from "@/app/types";

const Hand: any = require("pokersolver").Hand

const rankMap: Record<string, string> = {
    ace: "A", two: "2", three: "3", four: "4", five: "5",
    six: "6", seven: "7", eight: "8", nine: "9",
    ten: "T", jack: "J", queen: "Q", king: "K",
}

const suitMap: Record<string, string> = {
    spades: "s", hearts: "h", diamonds: "d", clubs: "c",
}

const cardToPokerNotation = (card: string) => {
    const [suit, rank] = card.split("_")
    return `${rankMap[rank]}${suitMap[suit]}`
}

const buildDeck = () => {
    const suits = ["spades", "hearts", "diamonds", "clubs"]
    const ranks = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"]
    return suits.flatMap(s => ranks.map(r => `${s}_${r}`))
}

const shuffleDeck = (deck: string[]) => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
}

interface TexasHoldEmProps {
    setScore: (value: (((prevState: (boolean | string | number | null)) => (boolean | string | number | null)) | boolean | string | number | null)) => void,
    stage: "PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null,
    setStage: (value: (((prevState: ("PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) => ("PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) | "PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null)) => void
    playerActionPending: boolean
    setPlayerActionPending: (value: (((prevState: boolean) => boolean) | boolean)) => void
    setShowCard: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void
    cards: { spades: string[]; hearts: string[]; diamonds: string[]; clubs: string[]; default: string }
    club: Club
}

interface TexasHoldEmRef {
    startGame: () => void,
    playerAction: (action: "Raise" | "Call" | "Fold") => void,
}

interface Player {
    name: string
    hand: string[]
    chips: number
    currentBet: number
    folded: boolean
    image: string
    hasActed: boolean
}

export const TexasHoldEm = forwardRef<TexasHoldEmRef, TexasHoldEmProps>(
    ({setScore, stage, setStage, playerActionPending, setPlayerActionPending, setShowCard, cards, club}, ref) => {
        const [deck, setDeck] = useState<string[]>([])
        const [communityCards, setCommunityCards] = useState<string[]>([])
        const [players, setPlayers] = useState<Player[]>([])
        const [pot, setPot] = useState<number>(0)

        const startGame = () => {
            const freshDeck = shuffleDeck(buildDeck())
            setPlayers([
                {
                    name: club.host.surname,
                    hand: freshDeck.slice(0, 2),
                    chips: 5000,
                    currentBet: 0,
                    folded: false,
                    image: `${club.host.surname.toLowerCase()}_poker`,
                    hasActed: false
                },
                {
                    name: "Someya",
                    hand: freshDeck.slice(2, 4),
                    chips: 5000,
                    currentBet: 0,
                    folded: false,
                    image: "someya_poker",
                    hasActed: false
                },
                {
                    name: "Nagumo",
                    hand: freshDeck.slice(4, 6),
                    chips: 5000,
                    currentBet: 0,
                    folded: false,
                    image: "nagumo_poker",
                    hasActed: false
                },
                {
                    name: "Tanimura the Dealer",
                    hand: freshDeck.slice(6, 8),
                    chips: 5000,
                    currentBet: 0,
                    folded: false,
                    image: "tanimura_poker",
                    hasActed: false
                },
            ])
            setCommunityCards([])
            setDeck(freshDeck.slice(8))
            setStage("PreFlop")
            setScore(null)
            setPot(0)
            setPlayerActionPending(true)
        }

        const getMaxBet = (currentPlayers: Player[]) => Math.max(...currentPlayers.map(p => p.currentBet))

        const isBettingComplete = (currentPlayers: Player[]) => {
            const activePlayers = currentPlayers.filter(p => !p.folded)
            if (activePlayers.length < 2) return true
            const maxBet = getMaxBet(activePlayers)
            return activePlayers.every(p => p.hasActed && p.currentBet === maxBet)
        }

        const playerAction = (action: "Raise" | "Call" | "Fold") => {
            if (!playerActionPending) return
            setPlayerActionPending(false)

            let updatedPlayers = players.map((p, i) => {
                if (i === 0) {
                    let newBet = p.currentBet
                    let newChips = p.chips
                    let isFolded = p.folded
                    const maxBet = getMaxBet(players)

                    if (action === "Raise") {
                        const raiseAmount = maxBet + 1000
                        newChips -= (raiseAmount - p.currentBet)
                        newBet = raiseAmount
                    } else if (action === "Call") {
                        const toCall = maxBet - p.currentBet
                        newChips -= toCall
                        newBet += toCall
                    } else if (action === "Fold") {
                        isFolded = true
                    }
                    return {...p, currentBet: newBet, chips: newChips, folded: isFolded, hasActed: true}
                }
                return p
            })

            if (action === "Raise") {
                updatedPlayers = updatedPlayers.map((p, i) => i !== 0 ? {...p, hasActed: false} : p)
            }

            setPlayers(updatedPlayers)
            setTimeout(() => nextTurn(1, updatedPlayers), 200)
        }

        const nextTurn = (index: number, currentPlayers: Player[]) => {
            if (isBettingComplete(currentPlayers)) {
                const totalPot = currentPlayers.reduce((sum, p) => sum + p.currentBet, 0)
                setPot(prev => prev + totalPot)
                setPlayers(prev => prev.map(p => ({...p, currentBet: 0, hasActed: false})))
                nextStage()
                return
            }

            if (index >= currentPlayers.length) {
                setTimeout(() => nextTurn(0, currentPlayers), 200)
                return
            }

            const current = currentPlayers[index]

            if (index === 0) {
                if (!current.folded) {
                    setPlayerActionPending(true)
                } else {
                    setTimeout(() => nextTurn(index + 1, currentPlayers), 200)
                }
                return
            }

            if (current.folded || current.hasActed) {
                setTimeout(() => nextTurn(index + 1, currentPlayers), 200)
                return
            }

            const maxBet = getMaxBet(currentPlayers)
            let aiAction: "Call" | "Fold" | "Raise"

            if (current.currentBet < maxBet) {
                aiAction = Math.random() > 0.2 ? "Call" : "Fold"
            } else {
                aiAction = Math.random() > 0.7 ? "Raise" : "Call"
            }

            setTimeout(() => {
                let updatedPlayers = currentPlayers.map((p, i) => {
                    if (i === index) {
                        let newBet = p.currentBet
                        let newChips = p.chips
                        let isFolded = p.folded
                        if (aiAction === "Raise") {
                            const raiseAmount = maxBet + 1000
                            newChips -= (raiseAmount - p.currentBet)
                            newBet = raiseAmount
                        } else if (aiAction === "Call") {
                            const toCall = maxBet - p.currentBet
                            newChips -= toCall
                            newBet += toCall
                        } else if (aiAction === "Fold") {
                            isFolded = true
                        }
                        return {...p, currentBet: newBet, chips: newChips, folded: isFolded, hasActed: true}
                    }
                    return p
                })

                if (aiAction === "Raise") {
                    updatedPlayers = updatedPlayers.map((p, i) => i !== index ? {...p, hasActed: false} : p)
                }

                setPlayers(updatedPlayers)
                setTimeout(() => nextTurn(index + 1, updatedPlayers), 400)
            }, 400)
        }

        const nextStage = () => {
            if (stage === "Showdown") return

            const activePlayers = players.filter(p => !p.folded)
            if (activePlayers.length <= 1) {
                setStage("Showdown")
                return
            }

            setPlayerActionPending(true)

            if (stage === "PreFlop") {
                setCommunityCards(deck.slice(0, 3))
                setDeck(deck.slice(3))
                setStage("Flop")
            } else if (stage === "Flop") {
                setCommunityCards(prev => [...prev, deck[0]])
                setDeck(deck.slice(1))
                setStage("Turn")
            } else if (stage === "Turn") {
                setCommunityCards(prev => [...prev, deck[0]])
                setDeck(deck.slice(1))
                setStage("River")
            } else if (stage === "River") {
                setStage("Showdown")
            }
        }

        const evaluateHands = () => {
            const activePlayers = players.filter(p => !p.folded)
            if (activePlayers.length === 0) return setScore("No winner.")

            if (activePlayers.length === 1) {
                setScore(`${activePlayers[0].name} wins the pot!`)
                return
            }

            const hands = activePlayers.map(p => {
                const handObj = Hand.solve([...p.hand, ...communityCards].map(cardToPokerNotation))
                handObj.playerName = p.name
                return handObj
            })

            const winners = Hand.winners(hands)
            const winnerNames = [...new Set(winners.map((w: any) => w.playerName))]

            if (winnerNames.length === 1) {
                setScore(`${winnerNames[0]} wins with ${winners[0].name}`)
            } else {
                setScore(`It's a tie between ${winnerNames.join(", ")}!`)
            }
        }

        useImperativeHandle(ref, () => ({startGame, playerAction}))

        useEffect(() => {
            if (stage === "Showdown") {
                evaluateHands()
                setPlayerActionPending(false)
            }
        }, [stage])

        return (
            <div className="flex flex-col justify-center items-center h-full w-full">
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
                                       src={`/cards/${stage === "Showdown" || p.name === club.host.surname ? card : "default"}.png`}
                                       alt={card} height={180} width={110}
                                       className={"rounded-[10] transition-transform duration-300 translate hover:scale-110 active:scale-125"}
                                       onClick={() => {
                                           if (stage !== "Showdown" && p.name !== club.host.surname) {
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
                            <Image className={`${i === 0 ? "-right-50" : i === 3 ? "-left-50" : "-bottom-60"} absolute`} src={`/images/${p.image}.png`} alt={"Poker face :D"} height={150} width={150}/>
                            {p.folded && <p className={`${yesteryear.className} text-[70px] absolute z-50 text-pink-600`}>FOLDED</p>}
                        </div>
                    </div>
                ))}
                <p className={`${yesteryear.className} absolute top-10 right-10 text-[40px]`}>Pot: {pot}</p>
            </div>
        )
    })
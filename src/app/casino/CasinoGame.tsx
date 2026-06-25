import React, {useEffect, useRef, useState} from "react";
import {Yesteryear} from "next/font/google";
import Image from "next/image";
import RouletteBoard from "@/app/casino/RouletteBoard";
import Roulette from "@/app/casino/Roulette";
import {TexasHoldEm} from "@/app/casino/TexasHoldEm";
import {Pachinko} from "@/app/casino/Pachinko";
import {Dealer, personaMap, rankMap, StoredClub, suitMap} from "@/app/types";
import {randomPokerTableBackgroundColor, RouletteBet} from "@/lib/casino";
import {Chohan} from "@/app/casino/Chohan";
import {handleGameAction} from "@/lib/transactions";
import {Blackjack} from "@/app/casino/Blackjack";
import MessageSplash from "@/components/messageSplash";
import {JapaneseYen, Minus, Plus} from "lucide-react";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

interface CasinoGameProps {
    game: "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null,
    clubData: StoredClub,
    setMoney: (fn: (x: number) => number) => void,
    dealer: Dealer | null
}

const CasinoGame = ({game, clubData, setMoney, dealer}: CasinoGameProps) => {
    const rouletteRef = useRef<{ spin: () => void } | null>(null)
    const pokerRef = useRef<any>(null)

    const [stage, setStage] = useState<"PreFlop" | "Flop" | "Turn" | "River" | "Showdown" | null>(null)
    const [playerActionPending, setPlayerActionPending] = useState<boolean>(false)
    const [gameId, setGameId] = useState<string | null>(null)
    const [score, setScore] = useState<boolean | string | number | null>(null)
    const [value, setValue] = useState<string>("")
    const [total, setTotal] = useState<number>(0)
    const [array, setArray] = useState<number[]>([])
    const [bet, setBet] = useState<number>(10000)
    const [prize, setPrize] = useState<number>(0)
    const [message, setMessage] = useState<{ text: string; id: number } | null>(null)

    const [pokerBet, setPokerBet] = useState<number>(10000)
    const [win, setWin] = useState<0 | 1 | 2>(0)

    const [dealerCards, setDealerCards] = useState<string[]>([])
    const [userCards, setUserCards] = useState<string[]>([])
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false)
    const [gameOver, setGameOver] = useState<boolean>(false)

    const [deck, setDeck] = useState<string[]>([])

    const [showCard, setShowCard] = useState<string | null>(null)
    const [cardModal, setCardModal] = useState<boolean>(false)

    const cardRef = useRef<HTMLImageElement | null>(null)
    const [rotation, setRotation] = useState({x: 0, y: 0})

    const [bets, setBets] = useState<RouletteBet[]>([])

    const [selectedBet, setSelectedBet] = useState<string | null>(null)

    const [maxBet, setMaxBet] = useState<number>(bet)

    const [tableColor] = useState(randomPokerTableBackgroundColor())

    const showMessage = (text: string) => {
        setMessage({text, id: Date.now()})
    }

    const handleRouletteResult = async (gameId: string) => {
        const end = await fetch("api/casino/roulette/reveal", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                clubData,
                gameId
            }),
        })

        const endData = await end.json()
        const winningNumber = endData.winningNumber
        const net = endData.net
        const win = endData.win
        setScore(winningNumber)
        setWin(win)
        setBet(net)
    }

    const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const midX = rect.width / 2
        const midY = rect.height / 2

        const rotateX = ((y - midY) / midY) * 6
        const rotateY = ((x - midX) / midX) * 6

        setRotation({x: rotateX, y: rotateY})
    }

    const resetTilt = () => {
        setRotation({x: 0, y: 0})
    }

    const closeShowCard = () => {
        setCardModal(false)
        setTimeout(() => setShowCard(null), 500)
    }

    useEffect(() => {
        if (showCard) {
            setCardModal(false)
            requestAnimationFrame(() => {
                setCardModal(true)
                const audio = new Audio("/sfx/name_introduction.m4a")
                audio.play()
            })
        }
    }, [showCard])

    const getCardPersona = (card: string): { title: string; persona: string } => {
        const [suitKey, rankKey] = card.split("_")

        const title = suitKey && rankKey
            ? `${rankMap[rankKey]} of ${suitMap[suitKey]}`
            : "Back of the card"

        const persona = personaMap[card] || ""

        return {title, persona}
    }

    const handleGame = async (type: string, value: string | null) => {
        if (type === "Chohan" && value !== null) {
            setMoney(prev => prev - bet)
            const sum = Array(2)
            for (let i = 0; i < 2; i++) {
                sum[i] = Math.floor(Math.random() * (6 - 1)) + 1
            }
            const total = sum.reduce((a, b) => a + b, 0)
            if (total % 2 === 0) {
                if (value === "Even") {
                    handleScore("Chohan", "even", total, sum, true)
                } else {
                    handleScore("Chohan", "even", total, sum, false)
                }
            } else {
                if (value === "Odd") {
                    handleScore("Chohan", "odd", total, sum, true)
                } else {
                    handleScore("Chohan", "odd", total, sum, false)
                }
            }
        } else if (type === "Blackjack") {
            showMessage("No more bets!")
            await handleGameAction({type: "CASINO", status: "ACTIVE"}).then()
            setMoney(prev => prev - bet)
            setIsPlayerTurn(true)
            setGameOver(false)
            setScore(null)
            const res = await fetch("api/casino/blackjack/start", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    clubData,
                    bet
                })
            })
            const data = await res.json()
            setUserCards(data.userHand)
            setDealerCards(data.dealerHand)
            if (data.finished) {
                setWin(data.win)
                setGameOver(true)
                switch (data.win) {
                    case 2:
                        setScore("Blackjack! You sir are a winner!")
                        setMoney(prev => prev + (2.5 * bet))
                        break
                    case 1:
                        setScore("Both players have a blackjack, sir.")
                        setMoney(prev => prev + bet)
                        break
                    case 0:
                        setScore("Dealer with the blackjack, sir.")
                        break
                }
                return
            }
            setGameId(data.gameId)
        }
    }

    const playerHit = async () => {
        if (!isPlayerTurn || gameOver) return

        showMessage("Hit!")

        const res = await fetch("api/casino/blackjack/play", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                clubData,
                gameId
            })
        })

        const data = await res.json()
        const card = data.card
        if (card) {
            setUserCards(currentUserCards => [...currentUserCards, card])
        }

        if (data.win === 0) {
            setIsPlayerTurn(false)
            setGameOver(true)
            setScore("You are a bust, sir.")
            setWin(0)
        }

        if (data.win === 2) {
            setIsPlayerTurn(false)
            setGameOver(true)
            setScore("Blackjack! You sir are a winner!")
            setMoney(prev => prev + (2 * bet))
            setWin(2)
        }
    }

    const playerStand = async () => {
        setIsPlayerTurn(false)

        showMessage("Stand!")

        const res = await fetch("api/casino/blackjack/reveal", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                clubData,
                gameId,
                dealerCards
            })
        })
        const data = await res.json()
        setWin(data.win)
        setGameOver(true)
        setDealerCards(data.dealerCards)
        switch (data.win) {
            case 2:
                setScore("You sir are a winner!")
                setMoney(prev => prev + bet)
                break
            case 1:
                setScore("It is a push, sir.")
                setMoney(prev => prev + bet)
                break
            case 0:
                setScore("No luck today, sir. Dealer wins!")
                break
            default:
                setScore("It is my fault, sir.")
        }
    }

    const handleScore = (type: string, value: string, total: number, array: Array<number>, won: boolean) => {
        if (type === "Chohan") {
            setValue(value)
            setTotal(total)
            setArray(array)
            setScore(won)
            if (won) {
                setPrize(bet * 2)
                setMoney(prev => prev + prize)
            } else {
                setPrize(bet)
            }
        }
    }

    const handleBet = (type: string, action: "Add" | "Lower") => {
        if (game === "Blackjack") {
            setBet(prev => {
                if (action === "Add") {
                    return Math.min(prev + 1000, 50000)
                } else {
                    return Math.max(prev - 1000, 1000)
                }
            })
        } else if (game === "Roulette") {
            setBets(prev => {
                const existing = prev.find(b => b.type === type)
                const change = action === "Add" ? 1000 : -1000
                const newAmount = Math.min(10000, Math.max(0, (existing?.amount || 0) + change))

                if (newAmount === 0) {
                    return prev.filter(b => b.type !== type)
                }

                if (existing) {
                    return prev.map(b =>
                        b.type === type ? {...b, amount: newAmount} : b
                    )
                } else {
                    return [...prev, {type, amount: newAmount}]
                }
            })
        }
    }

    return (
        <div className={"flex flex-col justify-center items-center"}>
            <MessageSplash message={message}/>
            {game === "Chohan" && (
                <>
                    <h1 className={`text-[75px] ${yesteryear.className}`}>Chō-Han</h1>
                    <Chohan clubData={clubData} setMoney={setMoney} array={array} setArray={setArray}
                            setPrize={setPrize} setScore={setScore} setTotal={setTotal}/>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} absolute bottom-5 right-5 backdrop-blur-md p-2 h-55 w-120 rounded-[20] text-[40px] flex justify-center items-center flex-col`}>
                            <p>{prize > 0 ? `You won ¥${prize}!` : `You lost ¥${Math.abs(prize)}.`}</p>
                            <p>{total ? `The sum ${total} was ${total % 2 === 0 ? "even" : "odd"}.` : "The draw is rigged."}</p>
                            <p>{array ? `The winning pair was ${array[0]} and ${array[1]}.` : "The draw is rigged."}</p>
                        </h1>
                    )}
                </>
            )}
            {game === "Blackjack" && (
                <div className={"flex flex-col justify-center items-center gap-10"}>
                    <Blackjack clubData={clubData} userCards={userCards} dealerCards={dealerCards}
                               setShowCard={setShowCard} isPlayerTurn={isPlayerTurn} gameOver={gameOver} bet={bet}
                               handleBet={handleBet} playerHit={playerHit} playerStand={playerStand}
                               handleGame={handleGame} dealer={dealer}/>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} border-stone-500 border-2 absolute bottom-5 right-5 backdrop-blur-sm h-20 w-175 rounded-[20] text-[35px] flex justify-center items-center flex-row gap-20`}>
                            <p>{score}</p>
                            <p>{win === 0 ? `- ¥${bet}.` : win === 1 ? `+ ¥${bet}.` : win === 2 && `+ ¥${bet * 2.5}`}</p>
                        </h1>
                    )}
                </div>
            )}
            {game === "Roulette" && (
                <>
                    <h1 className={`absolute top-15 text-[75px] ${yesteryear.className}`}>Roulette</h1>
                    <div
                        className={"relative p-10 gap-20 flex justify-center items-center flex-row bg-green-800 rounded-[50] border-20 border-amber-950"}>
                        <Roulette ref={rouletteRef} handleRouletteResult={handleRouletteResult} clubData={clubData}
                                  bets={bets} setMoney={setMoney}/>
                        <RouletteBoard handleBet={handleBet} bets={bets} selectedBet={selectedBet}
                                       setSelectedBet={setSelectedBet}/>
                        <div
                            className={`absolute left-1/2 top-5 z-50 flex flex-row justify-center items-center ${yesteryear.className} text-[40px] gap-5`}>
                            <p>Total bet: ¥{bets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className={"flex flex-row absolute bottom-10 gap-5 left-1/2 -translate-x-[50%] rounded-[15] border-2 border-stone-500"}>
                        <button
                            className={`${yesteryear.className} text-[40px] p-2 w-75 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                            onClick={async () => {
                                showMessage("No more bets!")
                                await handleGameAction({type: "CASINO", status: "ACTIVE"}).then()
                                rouletteRef.current?.spin()
                            }}>
                            Spin the roulette
                        </button>
                        <button
                            className={`${yesteryear.className} text-[40px] p-2 w-75 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                            onClick={() => setBets([])}>
                            Clear bets
                        </button>
                    </div>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} border-stone-500 border-2 absolute bottom-5 right-5 backdrop-blur-sm p-2 h-25 rounded-[20] text-[40px] flex justify-center items-center flex-row gap-20`}>
                            <p>The winning number is {score}</p>
                            <p>¥{bet}</p>
                        </h1>
                    )}
                </>
            )}
            {game === "Poker" && (
                <>
                    <h1 className={`absolute top-5 text-[75px] ${yesteryear.className}`}>Poker</h1>
                    <div
                        className={`relative h-[75vh] w-[90vw] flex justify-center items-center flex-row ${tableColor} rounded-[100] border-20`}>
                        <TexasHoldEm ref={pokerRef} setScore={setScore} stage={stage} setStage={setStage}
                                     playerActionPending={playerActionPending}
                                     setPlayerActionPending={setPlayerActionPending} setShowCard={setShowCard}
                                     clubData={clubData} setDeck={setDeck} dealer={dealer} setMoney={setMoney}
                                     bet={bet} setMaxBet={setMaxBet} setPokerBet={setPokerBet}
                        />
                    </div>
                    {(stage === null || stage === "Showdown") && (
                        <div className={"border-2 border-stone-500 absolute bottom-10 rounded-[10] backdrop-blur-md flex flex-row justify-center items-center"}>
                            <button
                                className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                onClick={() => {
                                    setBet(prev => Math.max(prev - 1000, 10000))
                                }}>
                                <Minus size={30}/>
                            </button>
                            <button
                                className={"p-2 rounded-[10] w-50 justify-center items-center text-center flex text-nowrap gap-2 text-[20px] hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                onClick={async () => {
                                    await handleGameAction({type: "CASINO", status: "ACTIVE"}).then()
                                    pokerRef?.current.startGame()
                                    setMoney(prev => prev - bet)
                                    setMaxBet(bet - Math.round((bet / 2) / 1000) * 1000)
                                }}>
                                <JapaneseYen size={20}/>{bet}
                            </button>
                            <button
                                className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                onClick={() => {
                                    setBet(prev => Math.min(prev + 1000, 100000))
                                }}>
                                <Plus size={30}/>
                            </button>
                        </div>
                    )}
                    {playerActionPending && stage && (
                        <div className={"absolute bottom-5 flex flex-row gap-5 backdrop-blur-md border-2 border-stone-500 rounded-[15]"}>
                            <div className={"flex flex-col justify-center items-center"}>
                                <button
                                    className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                    onClick={() => {
                                        setPokerBet(prev => Math.min(prev + 1000, maxBet))
                                    }}>
                                    <Plus size={20}/>
                                </button>
                                <button
                                    className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                    onClick={() => {
                                        setPokerBet(prev => Math.max(prev - 1000, 1000))
                                    }}>
                                    <Minus size={20}/>
                                </button>
                            </div>
                            <button
                                onClick={() => pokerRef?.current.turn("Raise", pokerBet)}
                                className={`${yesteryear.className} relative text-[35px] p-2 w-40 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}>
                                <p>Raise</p>
                                <p className={"absolute bottom-0 text-[14px] text-stone-300 -translate-x-[50%] left-1/2"}>
                                   [¥{pokerBet}]
                                </p>
                            </button>
                            <button
                                onClick={() => pokerRef?.current.turn("Call")}
                                className={`${yesteryear.className} text-[35px] p-2 w-40 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}>
                                Call
                            </button>
                            <button
                                onClick={() => pokerRef?.current.turn("Fold")}
                                className={`${yesteryear.className} text-[35px] p-2 w-40 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}>
                                Fold
                            </button>
                        </div>
                    )}
                    {score !== null && (
                        <h1 className={`${yesteryear.className} border-stone-500 border-2 absolute bottom-5 right-5 backdrop-blur-sm p-2 w-125 rounded-[20] text-[40px] flex justify-center items-center flex-row gap-20 text-nowrap`}>
                            <p>{score}</p>
                        </h1>
                    )}
                </>
            )}
            {game === "Pachinko" && (
                <>
                    <Pachinko clubData={clubData} setMoney={setMoney} setScore={setScore}/>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} border-stone-500 border-2 absolute bottom-5 right-5 backdrop-blur-sm p-2 w-125 rounded-[20] text-[40px] flex justify-center items-center flex-row gap-20 text-nowrap`}>
                            <p>{score}</p>
                        </h1>
                    )}
                </>
            )}
            {showCard && (
                <div
                    className={`absolute inset-0 backdrop-blur-md z-[99] flex justify-center items-center transition-opacity duration-500 ${cardModal ? "opacity-100" : "opacity-0"}`}
                    onClick={closeShowCard}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        onMouseMove={(e) => handleCardTilt(e)}
                        onMouseOut={resetTilt}
                    >
                        <Image
                            ref={cardRef}
                            src={`/cards/${showCard}.png`}
                            alt={"Selected card"}
                            height={400}
                            width={400}
                            className={"z-[100] rounded-[20]"}
                            style={{
                                transform: `perspective(250px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                                transition: "all 400ms cubic-bezier(0.1, 0.99, 0.52, 0.99) 0s"
                            }}
                        />
                    </div>
                    <div
                        className={`absolute opacity-[.05] fit-content pointer-events-none flex flex-col items-center justify-center ${yesteryear.className} text-center`}>
                        <h1 style={{fontSize: "clamp(150px, 50vw, 250px)"}}>
                            {getCardPersona(showCard).persona}
                        </h1>
                        <h1 style={{fontSize: "clamp(200px, 90vw, 250px)"}}>
                            {getCardPersona(showCard).title}
                        </h1>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CasinoGame
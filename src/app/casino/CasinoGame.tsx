import React, {useEffect, useState} from "react";
import {Yesteryear} from "next/font/google";
import {CircleSmall, GlassWater, JapaneseYen, Minus, Plus} from "lucide-react";
import Image from "next/image";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

interface CasinoGameProps {
    game: "Roulette" | "Blackjack" | "Poker" | "Chohan" | null,
    money: number
}

const CasinoGame = ({game, money}: CasinoGameProps) => {
    const [score, setScore] = useState<boolean | string | null>(null)
    const [value, setValue] = useState<string>("")
    const [total, setTotal] = useState<number>(0)
    const [array, setArray] = useState<number[]>([])
    const [bet, setBet] = useState<number>(1000)
    const [prize, setPrize] = useState<number>(0)

    const [win, setWin] = useState<0 | 1 | 2>(0)

    const [dealerCards, setDealerCards] = useState<string[]>([])
    const [userCards, setUserCards] = useState<string[]>([])
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [deck, setDeck] = useState<string[]>([])

    const cards = {
        "spades": ["spades_ace", "spades_two", "spades_three", "spades_four", "spades_five", "spades_six", "spades_seven", "spades_eight", "spades_nine", "spades_ten", "spades_jack", "spades_queen", "spades_king"],
        "hearts": ["hearts_ace", "hearts_two", "hearts_three", "hearts_four", "hearts_five", "hearts_six", "hearts_seven", "hearts_eight", "hearts_nine", "hearts_ten", "hearts_jack", "hearts_queen", "hearts_king"],
        "diamonds": ["diamonds_ace", "diamonds_two", "diamonds_three", "diamonds_four", "diamonds_five", "diamonds_six", "diamonds_seven", "diamonds_eight", "diamonds_nine", "diamonds_ten", "diamonds_jack", "diamonds_queen", "diamonds_king"],
        "clubs": ["clubs_ace", "clubs_two", "clubs_three", "clubs_four", "clubs_five", "clubs_six", "clubs_seven", "clubs_eight", "clubs_nine", "clubs_ten", "clubs_jack", "clubs_queen", "clubs_king"],
        "default": "default"
    }

    const getCardValue = (card: string): number => {
        const rankMap: Record<string, number> = {
            "spades_ace": 11, "hearts_ace": 11, "diamonds_ace": 11, "clubs_ace": 11,
            "spades_two": 2, "hearts_two": 2, "diamonds_two": 2, "clubs_two": 2,
            "spades_three": 3, "hearts_three": 3, "diamonds_three": 3, "clubs_three": 3,
            "spades_four": 4, "hearts_four": 4, "diamonds_four": 4, "clubs_four": 4,
            "spades_five": 5, "hearts_five": 5, "diamonds_five": 5, "clubs_five": 5,
            "spades_six": 6, "hearts_six": 6, "diamonds_six": 6, "clubs_six": 6,
            "spades_seven": 7, "hearts_seven": 7, "diamonds_seven": 7, "clubs_seven": 7,
            "spades_eight": 8, "hearts_eight": 8, "diamonds_eight": 8, "clubs_eight": 8,
            "spades_nine": 9, "hearts_nine": 9, "diamonds_nine": 9, "clubs_nine": 9,
            "spades_ten": 10, "hearts_ten": 10, "diamonds_ten": 10, "clubs_ten": 10,
            "spades_jack": 10, "hearts_jack": 10, "diamonds_jack": 10, "clubs_jack": 10,
            "spades_queen": 10, "hearts_queen": 10, "diamonds_queen": 10, "clubs_queen": 10,
            "spades_king": 10, "hearts_king": 10, "diamonds_king": 10, "clubs_king": 10,
        }

        return rankMap[card] || 0
    }

    const calculateHandValue = (hand: string[]): number => {
        let total = 0
        let aces = 0

        hand.forEach(card => {
            const value = getCardValue(card)
            total += value
            if(value == 11) aces++
        })

        while (total > 21 && aces > 0){
            total -= 10
            aces--
        }
        return total
    }

    const handleDeckBuild = () => {
        const suits = Object.keys(cards).filter(k => k !== "default")
        let deck: string[] = []
        suits.forEach((suit) => {
            deck = deck.concat(cards[suit as keyof typeof cards])
        })
        return deck
    }

    const handleDeckShuffle = (deck: string[]) => {
        const newDeck = [...deck]
        for(let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
        }
        return newDeck
    }

    const handleGame = (type: string, value: string | null) => {
        if (type === "Chohan" && value !== null) {
            let sum = Array(2)
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
        }
        else if (type === "Blackjack"){
            let freshDeck = handleDeckShuffle(handleDeckBuild())
            const userHand = freshDeck.slice(0, 2)
            const dealerHand = freshDeck.slice(2, 4)
            const remainingDeck = freshDeck.slice(4)
            setDeck(remainingDeck)

            setUserCards(userHand)
            setDealerCards(dealerHand)
            setIsPlayerTurn(true)
            setGameOver(false)
            setScore(null)
        }
    }

    const playerHit = () => {
        if (!isPlayerTurn || gameOver || deck.length === 0) return

        const remainingDeck = [...deck];
        const card = remainingDeck.shift()

        if (card) {
            setUserCards(currentUserCards => [...currentUserCards, card])
            setDeck(remainingDeck)
        }
    }

    useEffect(() => {
        if (isPlayerTurn) {
            if (calculateHandValue(userCards) > 21) {
                setScore("Oops... you sir are a bust!")
                setIsPlayerTurn(false)
                setGameOver(true)
                setWin(0)
            }
            else if(calculateHandValue(userCards) === 21){
                setScore("Blackjack! Congatulations, sir!")
                setIsPlayerTurn(false)
                setGameOver(true)
                setWin(2)
            }
            else if(calculateHandValue(dealerCards) === 21){
                setScore("The dealer had a blackjack!")
                setIsPlayerTurn(false)
                setGameOver(true)
                setWin(0)
            }
        }
    }, [userCards])

    const dealerPlay = (currentDeck: string[]) => {
        let hand = [...dealerCards]
        const newDeck = [...currentDeck]

        while (calculateHandValue(hand) < 17) {
            hand.push(newDeck.shift()!)
        }

        const dealerValue = calculateHandValue(hand)
        const userValue = calculateHandValue(userCards)

        if (dealerValue > 21 || userValue > dealerValue) {
            setScore("You sir have beaten the dealer!")
            setWin(2)
        } else if (dealerValue === userValue) {
            setScore("It is a push, sir.")
            setWin(1)
        } else {
            setScore("No luck today, sir! Dealer wins!")
            setWin(0)
        }

        setDealerCards(hand)
        setGameOver(true)
    }

    const playerStand = () => {
        setIsPlayerTurn(false)
        dealerPlay(deck)
    }

    const handleScore = (type: string, value: string, total: number, array: Array<number>, won: boolean) => {
        if (type === "Chohan") {
            setValue(value)
            setTotal(total)
            setArray(array)
            setScore(won)
            if(won){
                setPrize(bet * 2)
            }
            else{
                setPrize(bet)
            }
        }
    }

    const handleBet = (type: string, action: "Add" | "Lower") => {
        if (type === "Chohan") {
            setBet(prev => {
                if (action === "Add") {
                    return Math.min(prev + 1000, 10000, money)
                } else {
                    return Math.max(prev - 1000, 1000)
                }
            })
        }
        else if(type === "Blackjack"){
            setBet(prev => {
                if (action === "Add") {
                    return Math.min(prev + 1000, 50000, money)
                } else {
                    return Math.max(prev - 1000, 1000)
                }
            })
        }
    }


    const renderDice = (value: number) => {
        return (
            <div className={"grid grid-cols-3 grid-rows-3"}>
                {Array.from({length: 9}).map((_, i) => {
                    const positions: Record<number, number[]> = {
                        1: [4],
                        2: [0, 8],
                        3: [0, 4, 8],
                        4: [0, 2, 6, 8],
                        5: [0, 2, 4, 6, 8],
                        6: [0, 2, 3, 5, 6, 8],
                    }
                    return positions[value].includes(i) ? (
                        <CircleSmall key={i} size={50} fill="black"/>
                    ) : (
                        <div key={i}></div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={"flex flex-col justify-center items-center"}>
            {game === "Chohan" && (
                <>
                    <h1 className={`text-[75px] ${yesteryear.className}`}>Chō-Han</h1>
                    <div className={"flex flex-col justify-center items-center gap-5"}>
                        <div className={"flex flex-row justify-center items-center h-140 gap-5"}>
                            <GlassWater fill={"white"} size={400} className={"-rotate-180"}/>
                            <div className={"flex flex-row justify-center items-center gap-5"}>
                                {array.map((item, i) => (
                                    <div
                                        key={i}
                                        className={"flex justify-center items-center border-2 bg-white rounded-[20px] h-40 w-40"}
                                    >
                                        {renderDice(item)}
                                    </div>
                                ))}
                            </div>

                        </div>
                        <h1 className={`${yesteryear.className} text-[30px]`}>Place your bet</h1>
                        <div className={"flex flex-row justify-center items-center gap-5"}>
                            <button
                                className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] border-white border-2 rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                onClick={() => {
                                    handleGame("Chohan", "Even")
                                }}>
                                <p>Even</p>
                                <CircleSmall fill={"white"}/>
                            </button>
                            <button
                                className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] border-white border-2 rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                onClick={() => {
                                    handleGame("Chohan", "Odd")
                                }}>
                                <p>Odd</p>
                                <CircleSmall/>
                            </button>
                        </div>
                        <div className={"rounded-[10] backdrop-blur-md flex flex-row justify-center items-center"}>
                            <button
                                className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                onClick={() => {
                                    handleBet("Chohan", "Lower")
                                }}>
                                <Minus size={30}/>
                            </button>
                            <p className={"p-2 rounded-[10] w-30 justify-center items-center text-center flex text-nowrap gap-2"}>
                                <JapaneseYen size={15}/>{bet}
                            </p>
                            <button
                                className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                onClick={() => {
                                    handleBet("Chohan", "Add")
                                }}>
                                <Plus size={30}/>
                            </button>
                        </div>
                    </div>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} absolute bottom-5 right-5 backdrop-blur-md p-2 h-55 w-120 rounded-[20] text-[40px] flex justify-center items-center flex-col`}>
                            <p>{score ? `You won ${prize}!` : `You lost ${prize}.`}</p>
                            <p>{total ? `The sum  ${total} was ${value}.` : "The draw is rigged."}</p>
                            <p>{array ? `The winning pair was ${array[0]} and ${array[1]}.` : "The draw is rigged."}</p>
                        </h1>
                    )}
                </>
            )}
            {game === "Blackjack" && (
               <div className={"flex flex-col justify-center items-center gap-10"}>
                   <h1 className={`text-[75px] ${yesteryear.className}`}>Blackjack</h1>
                   <div className={`flex flex-col justify-center items-center gap-5 p-10 h-150 w-225 rounded-[20] backdrop-blur-sm ${yesteryear.className}`}>
                       <div className={"relative flex flex-row justify-center items-center gap-5"}>
                           {isPlayerTurn && !gameOver && <h1 className={"absolute -top-15 z-50 text-white text-[30px]"}>Dealer</h1>}
                           {dealerCards.map((dealerCard, i) => (
                               <Image key={i} className={"rounded-[10] object-fill"} src={`/cards/${(i === 1 && isPlayerTurn && !gameOver) ? cards.default : dealerCard}.png`} alt={`Dealer Card ${i}`} height={200} width={150}/>
                           ))}
                       </div>
                       <div className={"relative flex flex-row justify-center items-center gap-5"}>
                           {userCards.map((userCard, i) => (
                               <Image key={i} className={"rounded-[10] object-fill"} src={`/cards/${userCard}.png`} alt={`User Card ${i}`} height={200} width={150}/>
                           ))}
                           {isPlayerTurn && !gameOver && <h1 className={`absolute -bottom-15 z-50 text-white text-[30px] ${yesteryear.className}`}>You</h1>}
                       </div>
                   </div>
                   <div className={"flex flex-col justify-center items-center gap-5"}>
                       {isPlayerTurn && !gameOver ? (
                           <div className={"flex gap-5 flex-row"}>
                               <button
                                   className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] border-white border-2 rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                   onClick={playerHit}>
                                   Hit
                               </button>
                               <button
                                   className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] border-white border-2 rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                   onClick={playerStand}>
                                   Stand
                               </button>
                           </div>
                       ) : (
                           <button
                               className={`${yesteryear.className} gap-5 flex flex-row backdrop-blur-xl text-[30px] border-white border-2 rounded-[10] p-2 w-35 items-center justify-center cursor-alias hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                               onClick={() => {
                                   handleGame("Blackjack", null)
                               }}>
                               Play
                           </button>
                       )}
                       <div className={"rounded-[10] backdrop-blur-md flex flex-row justify-center items-center"}>
                           <button
                               className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                               onClick={() => {
                                   handleBet("Blackjack", "Lower")
                               }}>
                               <Minus size={30}/>
                           </button>
                           <p className={"p-2 rounded-[10] w-30 justify-center items-center text-center flex text-nowrap gap-2"}>
                               <JapaneseYen size={15}/>{bet}
                           </p>
                           <button
                               className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                               onClick={() => {
                                   handleBet("Blackjack", "Add")
                               }}>
                               <Plus size={30}/>
                           </button>
                       </div>
                   </div>
                   {score !== null && (
                       <h1 className={`${yesteryear.className} absolute bottom-5 right-5 backdrop-blur-md p-2 h-55 w-120 rounded-[20] text-[40px] flex justify-center items-center flex-col`}>
                           <p>{score}</p>
                           <p>{win === 0 ? `You lost ${bet}.`: win === 1 ? `You receive your ${bet} back.` : win === 2 && `You have won ${bet * 2} !`}</p>
                       </h1>
                   )}
               </div>
            )}
        </div>
    )
}

export default CasinoGame
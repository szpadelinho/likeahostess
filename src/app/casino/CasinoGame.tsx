import React, {useEffect, useRef, useState} from "react";
import {Yesteryear} from "next/font/google";
import {CircleSmall, GlassWater, JapaneseYen, Minus, Plus} from "lucide-react";
import Image from "next/image";
import RouletteBoard from "@/app/casino/RouletteBoard";
import Roulette from "@/app/casino/Roulette";

const yesteryear = Yesteryear({
    weight: "400",
    subsets: ['latin'],
})

type Club = {
    name: string
    host: {
        name: string
        surname: string
        image: string
    },
    money: number
    popularity: number
    logo: string
}

interface CasinoGameProps {
    game: "Roulette" | "Blackjack" | "Poker" | "Chohan" | null,
    money: number,
    club: Club
}

const CasinoGame = ({game, money, club}: CasinoGameProps) => {
    const rouletteRef = useRef<{ spin: () => void } | null>(null)

    const [score, setScore] = useState<boolean | string | number | null>(null)
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

    const [showCard, setShowCard] = useState<string | null>(null)
    const [cardModal, setCardModal] = useState<boolean>(false)

    const cardRef = useRef<HTMLImageElement | null>(null)
    const [rotation, setRotation] = useState({x: 0, y: 0})

    const [bets, setBets] = useState<{type: string, amount: number}[]>([])

    const audio = new Audio("/sfx/name_introduction.m4a")

    const [selectedBet, setSelectedBet] = useState<string | null>(null)

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    const blackNumbers = Array.from({ length: 36 }, (_, i) => i + 1).filter(n => !redNumbers.includes(n))

    const handleRouletteResult = (winningNumber: number) => {
        setScore(winningNumber)

        const getMultiplier = (type: string) => {
            switch (type) {
                case "Red":
                case "Black":
                case "Even":
                case "Odd":
                case "1 to 18":
                case "19 to 36":
                    return 2
                case "1st 12":
                case "2nd 12":
                case "3rd 12":
                case "Column 1":
                case "Column 2":
                case "Column 3":
                    return 3
                case "0":
                    return 36
                default:
                    if (!isNaN(Number(type))) return 1
                    return 0
            }
        }

        const totalPayout = bets.reduce((sum, bet) => {
            const { type, amount } = bet
            const multiplier = getMultiplier(type)

            let isWin = false
            switch (type) {
                case "Red":
                    isWin = redNumbers.includes(winningNumber)
                    break
                case "Black":
                    isWin = blackNumbers.includes(winningNumber)
                    break
                case "Even":
                    isWin = winningNumber !== 0 && winningNumber % 2 === 0
                    break
                case "Odd":
                    isWin = winningNumber % 2 === 1
                    break
                case "1 to 18":
                    isWin = winningNumber >= 1 && winningNumber <= 18
                    break
                case "19 to 36":
                    isWin = winningNumber >= 19 && winningNumber <= 36
                    break
                case "1st 12":
                    isWin = winningNumber >= 1 && winningNumber <= 12
                    break
                case "2nd 12":
                    isWin = winningNumber >= 13 && winningNumber <= 24
                    break
                case "3rd 12":
                    isWin = winningNumber >= 25 && winningNumber <= 36
                    break
                case "Column 1":
                    isWin = [1,4,7,10,13,16,19,22,25,28,31,34].includes(winningNumber)
                    break
                case "Column 2":
                    isWin = [2,5,8,11,14,17,20,23,26,29,32,35].includes(winningNumber)
                    break
                case "Column 3":
                    isWin = [3,6,9,12,15,18,21,24,27,30,33,36].includes(winningNumber)
                    break
                default:
                    if (!isNaN(Number(type))) {
                        isWin = Number(type) === winningNumber
                    }
                    break
            }

            if (isWin) {
                return sum + amount * multiplier
            } else {
                return sum
            }
        }, 0)

        const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0)
        const net = totalPayout - totalBet

        if (net > 0) setWin(2)
        else if (net === 0) setWin(1)
        else setWin(0)

        setBet(totalPayout)
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
        if(showCard){
            setCardModal(false)
            requestAnimationFrame(() => {
                setCardModal(true)
                audio.play()
            })
        }
    }, [showCard])

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

    const getCardPersona = (card: string): { title: string; persona: string } => {
        const personaMap: Record<string, string> = {
            "spades_ace": "Shintaro Kazama", "hearts_ace": "Sohei Dojima", "diamonds_ace": "Futoshi Shimano", "clubs_ace": "Jin Goda",
            "spades_two": "Jun Oda", "hearts_two": "Makoto Makimura", "diamonds_two": "Homare Nishitani", "clubs_two": "Lao Gui",
            "spades_three": "Makoto Date", "hearts_three": "Yumi Sawamura", "diamonds_three": "The Florist of Sai", "clubs_three": "Osamu Kashiwagi",
            "spades_four": "Yukio Terada", "hearts_four": "Lady Yayoi Dojima", "diamonds_four": "Nishida", "clubs_four": "Toranosuke Sengoku",
            "spades_five": "Rikiya Shimabukuro", "hearts_five": "Tsuyoshi Kanda", "diamonds_five": "Yoshitaka Mine", "clubs_five": "Lau Ka Long",
            "spades_six": "Masayoshi Tanimura", "hearts_six": "Hana", "diamonds_six": "Daisaku Minami", "clubs_six": "Go Hamazaki",
            "spades_seven": "Taco Shinada", "hearts_seven": "Masaru Watase", "diamonds_seven": "Kamon Kanai", "clubs_seven": "Masato Aizawa",
            "spades_eight": "Joon-Gi Han", "hearts_eight": "Haruto Sawamura", "diamonds_eight": "Heizo Hiwami", "clubs_eight": "Kanji Koshimizu",
            "spades_nine": "Yu Nanba", "hearts_nine": "Masato Arakawa", "diamonds_nine": "Koichi Adachi", "clubs_nine": "Tianyou Zhao",
            "spades_ten": "Jo Amon", "hearts_ten": "Onimichio", "diamonds_ten": "Munancho Suzuki", "clubs_ten": "Pocket Circuit Fighter Fujisawa",
            "spades_jack": "Shun Akiyama", "hearts_jack": "Akira Nishikiyama", "diamonds_jack": "Daigo Dojima", "clubs_jack": "Ryuji Goda",
            "spades_queen": "Saeko Mukoda", "hearts_queen": "Haruka Sawamura", "diamonds_queen": "Seonhee", "clubs_queen": "Kaoru Sayama",
            "spades_king": "Kiryu Kazuma", "hearts_king": "Ichiban Kasuga", "diamonds_king": "Goro Majima", "clubs_king": "Taiga Saejima",
        }

        const [suitKey, rankKey] = card.split("_")

        const suitMap: Record<string, string> = {
            spades: "Spades",
            hearts: "Hearts",
            diamonds: "Diamonds",
            clubs: "Clubs",
        };

        const rankMap: Record<string, string> = {
            ace: "Ace",
            two: "Two",
            three: "Three",
            four: "Four",
            five: "Five",
            six: "Six",
            seven: "Seven",
            eight: "Eight",
            nine: "Nine",
            ten: "Ten",
            jack: "Jack",
            queen: "Queen",
            king: "King",
        };

        const title = suitKey && rankKey
            ? `${rankMap[rankKey]} of ${suitMap[suitKey]}`
            : "Back of the card"

        const persona = personaMap[card] || ""

        return { title, persona }
    }

    const calculateHandValue = (hand: string[]): number => {
        let total = 0
        let aces = 0

        hand.forEach(card => {
            const value = getCardValue(card)
            total += value
            if (value == 11) aces++
        })

        while (total > 21 && aces > 0) {
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
        for (let i = newDeck.length - 1; i > 0; i--) {
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
        else if (type === "Blackjack") {
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
            } else if (calculateHandValue(userCards) === 21) {
                setScore("Blackjack! Congatulations, sir!")
                setIsPlayerTurn(false)
                setGameOver(true)
                setWin(2)
            } else if (calculateHandValue(dealerCards) === 21) {
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
            if (won) {
                setPrize(bet * 2)
            } else {
                setPrize(bet)
            }
        }
    }

    const handleBet = (type: string, action: "Add" | "Lower") => {
        if (game === "Chohan") {
            setBet(prev => {
                if (action === "Add") {
                    return Math.min(prev + 1000, 10000, money)
                } else {
                    return Math.max(prev - 1000, 1000)
                }
            })
        }
        else if (game === "Blackjack") {
            setBet(prev => {
                if (action === "Add") {
                    return Math.min(prev + 1000, 50000, money)
                } else {
                    return Math.max(prev - 1000, 1000)
                }
            })
        }
        else if (game === "Roulette"){
            setBets(prev => {
                const existing = prev.find(b => b.type === type)
                const change = action === "Add" ? 1000 : -1000
                const newAmount = Math.min(10000, Math.max(0, (existing?.amount || 0) + change))

                if(newAmount === 0){
                    return prev.filter(b => b.type !== type)
                }

                if(existing){
                    return prev.map(b =>
                        b.type === type ? {...b, amount: newAmount} : b
                    )
                }
                else{
                    return [...prev, {type, amount: newAmount}]
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
                    <div
                        className={`backdrop-blur-sm flex flex-row justify-center items-center gap-30 p-10 h-150 rounded-[20] ${yesteryear.className}`}>
                        <div className="w-60 h-screen flex justify-center items-center">
                            <Image src={club.host.image} alt={"You"} height={250} width={170}/>
                        </div>
                        <h1 className={`z-50 text-white text-[30px] w-25 flex justify-center items-center`}>{club.host.name} {club.host.surname}</h1>
                        <div className={"relative flex flex-col justify-center items-center w-50 h-full"}>
                            <div className={"relative h-50 w-50"}>
                                {userCards.map((userCard, i) => (
                                    <Image key={i} className={"absolute rounded-[10] transition-transform duration-300 translate hover:-translate-y-25 active:scale-125"} src={`/cards/${userCard}.png`}
                                           alt={`User Card ${i}`} height={200} width={125}
                                           style={{
                                               top: `${i * 25}px`,
                                               left: `${i * 15}px`,
                                               zIndex: i,
                                           }}
                                           onClick={() => {
                                               setShowCard(userCard)
                                           }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={"flex flex-col justify-center items-center w-50 h-full"}>
                            <div className={"relative h-50 w-50"}>
                                {dealerCards.map((dealerCard, i) => (
                                    <Image key={i} className={"absolute rounded-[10] absolute rounded-[10] transition-transform duration-300 translate hover:-translate-y-25 active:scale-125"}
                                           src={`/cards/${(i === 1 && isPlayerTurn && !gameOver) ? cards.default : dealerCard}.png`}
                                           alt={`Dealer Card ${i}`} height={200} width={125}
                                           style={{
                                               top: `${i * 25}px`,
                                               left: `${i * 15}px`,
                                               zIndex: i,
                                           }}
                                           onClick={() => {
                                               if(i === 1 && isPlayerTurn && !gameOver){
                                                   setShowCard(cards.default)
                                               }
                                               else{
                                                   setShowCard(dealerCard)
                                               }
                                           }}
                                    />
                                ))}
                            </div>
                        </div>
                        <h1 className={"z-50 text-white text-[30px] w-25 flex justify-center items-center"}>Dealer Tanimura</h1>
                        <div className="w-60 h-screen flex justify-center items-center">
                            <Image src={`/images/tanimura_cover.png`} alt={"Dealer"} height={250} width={150}/>
                        </div>
                    </div>
                    <div className={"flex flex-col justify-center items-center gap-5"}>
                        {isPlayerTurn && !gameOver ? (
                            <div className={"rounded-[10] backdrop-blur-md flex flex-row justify-center items-center gap-5"}>
                                <button
                                    className={`${yesteryear.className} text-[20px] p-2 w-25 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                    onClick={playerHit}>
                                    Hit
                                </button>
                                <button
                                    className={`${yesteryear.className} text-[20px] p-2 w-25 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                                    onClick={playerStand}>
                                    Stand
                                </button>
                            </div>
                        ): (
                            <div className={"rounded-[10] backdrop-blur-md flex flex-row justify-center items-center"}>
                                <button
                                    className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                    onClick={() => {
                                        handleBet("Blackjack", "Lower")
                                    }}>
                                    <Minus size={30}/>
                                </button>
                                <button
                                    className={"p-2 rounded-[10] w-50 justify-center items-center text-center flex text-nowrap gap-2 text-[20px] hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                    onClick={() => {
                                        handleGame("Blackjack", null)
                                    }}>
                                    <JapaneseYen size={20}/>{bet}
                                </button>
                                <button
                                    className={"p-2 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white"}
                                    onClick={() => {
                                        handleBet("Blackjack", "Add")
                                    }}>
                                    <Plus size={30}/>
                                </button>
                            </div>
                        )}
                    </div>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} absolute bottom-5 right-5 backdrop-blur-sm p-2 h-25 w-175 rounded-[20] text-[40px] flex justify-center items-center flex-row gap-20`}>
                            <p>{score}</p>
                            <p>{win === 0 ? `- ${bet}.` : win === 1 ? `+ ${bet}.` : win === 2 && `+ ${bet * 2} `}</p>
                        </h1>
                    )}
                    {showCard && (
                        <div className={`absolute inset-0 backdrop-blur-md z-[99] flex justify-center items-center transition-opacity duration-500 ${cardModal ? "opacity-100" : "opacity-0"}`}
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
                            <div className={`absolute opacity-[.05] fit-content pointer-events-none flex flex-col items-center justify-center ${yesteryear.className} text-center`}>
                                <h1 style={{ fontSize: "clamp(150px, 50vw, 250px)" }}>
                                    {getCardPersona(showCard).persona}
                                </h1>
                                <h1 style={{ fontSize: "clamp(200px, 90vw, 250px)" }}>
                                    {getCardPersona(showCard).title}
                                </h1>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {game === "Roulette" && (
                <>
                    <h1 className={`absolute top-15 text-[75px] ${yesteryear.className}`}>Roulette</h1>
                    <div className={"relative p-10 gap-20 flex justify-center items-center flex-row bg-green-800 rounded-[50] border-20 border-amber-950"}>
                        <Roulette ref={rouletteRef} handleRouletteResult={handleRouletteResult}/>
                        <RouletteBoard handleBet={handleBet} bets={bets} selectedBet={selectedBet} setSelectedBet={setSelectedBet}/>
                        <div className={`absolute left-1/2 top-5 z-50 flex flex-row justify-center items-center ${yesteryear.className} text-[40px] gap-5`}>
                            <p>Total bet: ¥{bets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString()}</p>
                            <button
                                className={`p-1 w-75 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}>
                                Clear bets
                            </button>
                        </div>
                    </div>
                    <button
                        className={`${yesteryear.className} absolute bottom-10 text-[40px] p-2 w-75 rounded-[10] justify-center items-center text-center hover:bg-white hover:text-black transition-all duration-200 ease-in-out transform active:scale-110 text-white`}
                        onClick={() => {
                            rouletteRef.current?.spin()
                        }}>
                        Spin the roulette
                    </button>
                    {score !== null && (
                        <h1 className={`${yesteryear.className} absolute bottom-5 right-5 backdrop-blur-sm p-2 h-25 w-175 rounded-[20] text-[40px] flex justify-center items-center flex-row gap-20`}>
                            <p>The winning number is {score}</p>
                            <p>{bet}</p>
                        </h1>
                    )}
                </>
            )}
        </div>
    )
}

export default CasinoGame
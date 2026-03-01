import {cards, getCardValue} from "@/app/types";
import {Apple, Cherry, CircleSmall, Citrus, createLucideIcon, Heart, Star} from "lucide-react";
import React from "react";
import {flowerTulip, peach, pear, pumpkin, strawberry, watermelon} from "@lucide/lab";

export const panels: {title: "Roulette" | "Blackjack" | "Poker" | "Chohan" | "Pachinko" | null, description: string, position: string}[] = [
    {
        title: "Roulette",
        description: "A classic game. The dealer places a metal ball inside of the roulette, which is rolling through the number spots. The players have multiple possibilities to bet over - number, color, row, odd/even, interval and many others.",
        position: "right-70 top-90"
    },
    {
        title: "Blackjack",
        description: "A card game. The dealer gives himself two cards - one visible and one hidden. The players however receive two visible cards. The goal for the players is to have a bigger score than the dealer. However, when the score is bigger than 21 - the game is over. If you score a 21, a \"Blackjack\" is being called.",
        position: "left-50 bottom-90"
    },
    {
        title: "Poker",
        description: "A card game. The players take one card per round. They either bet or pass on the play. The goal is to have the most fitting 5-card hand with the cards on the table. The winner has the strongest hand.",
        position: "left-150 top-90"
    },
    {
        title: "Chohan",
        description: "Even versus Odd. The dealer is shaking a bamboo bowl, in which two dices are being shaken. In this game, the goal is to predict what the sum of two dices will be. You either call it the sum to be even (chō) or odd (han).",
        position: "right-100 bottom-15"
    },
    {
        title: "Pachinko",
        description: "Classic pachinko slots. Here you can either spend half of your life looking for the grand prize or... simply win it all at once. Choice is yours (actually not).",
        position: "right-25 top-125"
    },
]

export const handleDeckBuild = () => {
    const suits = Object.keys(cards).filter(k => k !== "default")
    let deck: string[] = []
    suits.forEach((suit) => {
        deck = deck.concat(cards[suit as keyof typeof cards])
    })
    return deck
}

export const handleDeckShuffle = (deck: string[]) => {
    const newDeck = [...deck]
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
}

export const renderDice = (value: number) => {
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

export const getIcon = (Icon: any): { fill: string, color: string } => {
    switch (Icon) {
        case Apple:
            return {fill: "#ff1a1a", color: "#bd1212"}
        case Cherry:
            return {fill: "#da0000", color: "#b50000"}
        case Star:
            return {fill: "#ffc400", color: "#ff8800"}
        case Heart:
            return {fill: "#ff0000", color: "#ff00f2"}
        case Citrus:
            return {fill: "#f3ff00", color: "#c5c500"}
        case Strawberry:
            return {fill: "#ff0000", color: "#ff4b4b"}
        case Peach:
            return {fill: "#ff5900", color: "#c63b00"}
        case Pumpkin:
            return {fill: "#ff4d00", color: "#bd3700"}
        case Pear:
            return {fill: "#ccff34", color: "#819f00"}
        case Watermelon:
            return {fill: "#00ff05", color: "#31aa00"}
        case FlowerTulip:
            return {fill: "#7400ff", color: "#600098"}
        default:
            return {fill: "#ffffff", color: "#000000"}
    }
}

export const rankMap: Record<string, string> = {
    ace: "A", two: "2", three: "3", four: "4", five: "5",
    six: "6", seven: "7", eight: "8", nine: "9",
    ten: "T", jack: "J", queen: "Q", king: "K",
}

export const suitMap: Record<string, string> = {
    spades: "s", hearts: "h", diamonds: "d", clubs: "c",
}

export const cardToPokerNotation = (card: string) => {
    const [suit, rank] = card.split("_")
    return `${rankMap[rank]}${suitMap[suit]}`
}

export const buildDeck = () => {
    const suits = ["spades", "hearts", "diamonds", "clubs"]
    const ranks = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"]
    return suits.flatMap(s => ranks.map(r => `${s}_${r}`))
}

export const getBetsValidation = (bets: RouletteBet[], winningNumber: number) => {
    let totalWin = 0
    let totalLoss = 0
    bets.forEach(({type, amount}) => {
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
                isWin = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(winningNumber)
                break
            case "Column 2":
                isWin = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(winningNumber)
                break
            case "Column 3":
                isWin = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(winningNumber)
                break
            default:
                if (!isNaN(Number(type))) {
                    isWin = Number(type) === winningNumber
                }
                break
        }

        if (isWin) {
            totalWin += amount * multiplier
        } else {
            totalLoss = amount
        }
    }, 0)
    return { totalWin, totalLoss }
}

export const getMultiplier = (type: string) => {
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

export const calculateHandValue = (hand: string[]): number => {
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

export const numbers = [
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
]

export const wheelNumbers = [ 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26 ]

export const degToRad = (d: number) => (d * Math.PI) / 180

export interface RouletteBet{
    type: string
    amount: number
}

export const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
export const blackNumbers = numbers.flat().filter((n) => !redNumbers.includes(n))

export const Strawberry = createLucideIcon("Strawberry", strawberry)
export const Peach = createLucideIcon("Peach", peach)
export const Pumpkin = createLucideIcon("Pumpkin", pumpkin)
export const Pear = createLucideIcon("Pear", pear)
export const Watermelon = createLucideIcon("Watermelon", watermelon)
export const FlowerTulip = createLucideIcon("FlowerTulip", flowerTulip)

export const elements = [Apple, Cherry, Star, Heart, Citrus, Strawberry, Peach, Pumpkin, Pear, Watermelon, FlowerTulip]

export type BlackjackGameData = {
    deck: string[]
    userCards: string[]
    dealerCards: string[]
}
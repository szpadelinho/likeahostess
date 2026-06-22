import Image from "next/image";
import {Dealer, StoredClub, yesteryear} from "@/app/types";
import {JapaneseYen, Minus, Plus} from "lucide-react";
import React from "react";
import {cards} from "@/lib/casino";

interface BlackjackProps {
    clubData: StoredClub,
    userCards: string[],
    dealerCards: string[],
    setShowCard: (value: (((prevState: (string | null)) => (string | null)) | string | null)) => void,
    isPlayerTurn: boolean,
    gameOver: boolean,
    bet: number,
    handleBet: (type: string, action: ("Add" | "Lower")) => void,
    playerHit: () => void,
    playerStand: () => void,
    handleGame: (type: string, value: (string | null)) => void,
    dealer: Dealer | null
}

export const Blackjack = ({
                              clubData,
                              userCards,
                              dealerCards,
                              setShowCard,
                              isPlayerTurn,
                              gameOver,
                              bet,
                              handleBet,
                              playerHit,
                              playerStand,
                              handleGame,
                              dealer
                          }: BlackjackProps) => {
    return (
        <div className={"absolute backdrop-blur-lg inset-0 flex flex-col justify-center items-center"}>
            <div className="h-150 w-75 left-0 absolute bg-gradient-to-l from-transparent to-black/75"/>
            <div className="h-150 w-75 right-0 absolute bg-gradient-to-r from-transparent to-black/75"/>
            <h1 className={`text-[75px] ${yesteryear.className}`}>Blackjack</h1>
            <div
                className={`flex flex-row justify-center items-center gap-30 p-10 rounded-[20] ${yesteryear.className}`}>
                <Image
                    className={"rotate-10 [mask-image:linear-gradient(to_top,transparent,black)] [-webkit-mask-image:linear-gradient(to_top,transparent,black)]"}
                    src={`/images/${clubData.host.surname}_blackjack.png`} alt={"You"} height={300} width={300}/>
                <div className={"relative flex flex-col justify-center items-center w-50 h-full"}>
                    <div className={"relative h-50 w-50"}>
                        {userCards.map((userCard, i) => (
                            <Image key={i}
                                   className={"absolute rounded-[10] transition-transform duration-300 translate hover:-translate-y-25 active:scale-125"}
                                   src={`/cards/${userCard}.png`}
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
                <h1 className={`text-[75px]`}>
                    vs.
                </h1>
                <div className={"flex flex-col justify-center items-center w-50 h-full"}>
                    <div className={"relative h-50 w-50"}>
                        {dealerCards.map((dealerCard, i) => (
                            <Image key={i}
                                   className={"absolute rounded-[10] transition-transform duration-300 translate hover:-translate-y-25 active:scale-125"}
                                   src={`/cards/${(i === 1 && isPlayerTurn && !gameOver) ? cards.default : dealerCard}.png`}
                                   alt={`Dealer Card ${i}`} height={200} width={125}
                                   style={{
                                       top: `${i * 25}px`,
                                       left: `${i * 15}px`,
                                       zIndex: i,
                                   }}
                                   onClick={() => {
                                       if (i === 1 && isPlayerTurn && !gameOver) {
                                           setShowCard(cards.default)
                                       } else {
                                           setShowCard(dealerCard)
                                       }
                                   }}
                            />
                        ))}
                    </div>
                </div>
                {dealer && <Image
                    className={"-rotate-10 [mask-image:linear-gradient(to_top,transparent,black)] [-webkit-mask-image:linear-gradient(to_top,transparent,black)]"}
                    src={`/images/${dealer.blackjackCover}`} alt={dealer.name} height={300} width={300}/>}
            </div>
            <div className={"flex flex-col justify-center items-center gap-5"}>
                {isPlayerTurn && !gameOver ? (
                    <div
                        className={"border-2 border-stone-500 rounded-[10] backdrop-blur-md flex flex-row justify-center items-center gap-5"}>
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
                ) : (
                    <div className={"rounded-[10] backdrop-blur-md flex flex-row justify-center items-center border-2 border-stone-500"}>
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
        </div>
    )
}
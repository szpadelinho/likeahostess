import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";
import {calculateHandValue, handleDeckBuild, handleDeckShuffle} from "@/lib/casino";

export async function POST(req: Request){
    const session = await auth()
    const { clubData, bet } = await req.json()
    const userId = session?.user?.id
    if (!session || !userId || !clubData) return NextResponse.json({error: "Unauthorized"}, {status: 401})

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    let userClub = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: clubData.clubId
            }
        }
    })

    if(!userClub) return NextResponse.json({message: "No such userClub"}, {status: 404})

    try{
        const freshDeck = handleDeckShuffle(handleDeckBuild())
        const userHand = freshDeck.slice(0, 2)
        const dealerHand = freshDeck.slice(2, 4)
        const remainingDeck = freshDeck.slice(4)

        const userValue = calculateHandValue(userHand)
        const dealerValue = calculateHandValue(dealerHand)
        const userBlackjack = userValue === 21
        const dealerBlackjack = dealerValue === 21

        const round = await prisma.$transaction(async (tx) => {
            let updatedClub = await tx.userClub.update({
                where: { id: userClub.id },
                data: { money: { decrement: bet } }
            })

            let net = 0
            let win = null
            if(userBlackjack || dealerBlackjack) {
                if(userBlackjack && dealerBlackjack) {
                    net = bet
                    win = 1
                }
                else if(userBlackjack){
                    net = bet * 2.5
                    win = 2
                }
                else{
                    net = 0
                    win = 0
                }
                if (net > 0) {
                    updatedClub = await tx.userClub.update({
                        where: { id: userClub.id },
                        data: { money: { increment: net } }
                    })

                    await prisma.gameAction.delete({
                        where: {
                            id: gameAction.id
                        }
                    })

                    return { updatedClub, finished: true, win }
                }
            }

            const newGame = await tx.gameRound.create({
                data: {
                    userId,
                    gameType: "BLACKJACK",
                    status: "SPINNING",
                    totalBet: bet,
                    gameData: {
                        deck: remainingDeck,
                        userCards: userHand,
                        dealerCards: dealerHand
                    }
                }
            })

            return { updatedClub, newGame, finished: false }
        })

        return NextResponse.json({
            finished: round.finished,
            userClub: round.updatedClub,
            userHand,
            dealerHand,
            win: round.win,
            gameId: round.finished ? undefined : round.newGame?.id
        })
    }
    catch(err){
        console.log(err)
    }
}
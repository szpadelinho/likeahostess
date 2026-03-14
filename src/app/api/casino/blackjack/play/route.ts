import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";
import {BlackjackGameData, calculateHandValue} from "@/lib/casino";

export async function POST(req: Request){
    const session = await auth()
    const { clubData, gameId } = await req.json()
    const userId = session?.user?.id
    if (!session || !userId || !clubData || !gameId) return NextResponse.json({error: "Unauthorized"}, {status: 401})

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

    const gameRound = await prisma.gameRound.findUnique({
        where: {
            id: gameId
        }
    })

    if (!gameRound || gameRound.userId !== userId)
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    try {
        const original = gameRound.gameData as unknown as BlackjackGameData

        const userCards = [...original.userCards]
        const deck = [...original.deck]
        let card

        if (calculateHandValue(userCards) < 21) {
            card = deck.shift()!
            userCards.push(card)
        }

        if(calculateHandValue(userCards) === 21){
            userClub = await prisma.userClub.update({
                where: {
                    id: userClub.id
                },
                data: {
                    money: {
                        increment: gameRound.totalBet * 2.5
                    }
                }
            })

            await prisma.gameRound.delete({
                where: {
                    id: gameId
                }
            })

            await prisma.gameAction.delete({
                where: {
                    id: gameAction.id
                }
            })

            return NextResponse.json({userClub, card, win: 2})
        }

        await prisma.gameRound.update({
            where: {
                id: gameId
            },
            data: {
                gameData: {
                    ...original,
                    deck,
                    userCards
                }
            }
        })

        return NextResponse.json({userClub, card})
    } catch (err) {
        console.log(err)
    }
}
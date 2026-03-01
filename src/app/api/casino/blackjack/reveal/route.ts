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

    let win = 0
    try {
        const original = gameRound.gameData as unknown as BlackjackGameData

        const dealerCards = [...original.dealerCards]
        const userCards = [...original.userCards]
        const deck = [...original.deck]

        while (calculateHandValue(dealerCards) < 17) {
            dealerCards.push(deck.shift()!)
        }

        const dealerValue = calculateHandValue(dealerCards)
        const userValue = calculateHandValue(userCards)

        if (dealerValue > 21 || userValue > dealerValue) {
            win = 2
        } else if (dealerValue === userValue) {
            win = 1
        } else {
            win = 0
        }

        let net = 0
        const bet = gameRound.totalBet

        switch(win){
            case 2:
                net = bet * 2
                break
            case 1:
                net = bet
                break
            case 0:
                net = 0
        }

        if (net > 0) {
            userClub = await prisma.userClub.update({
                where: {
                    id: userClub.id
                },
                data: {
                    money: {
                        increment: net
                    }
                }
            })
        }

        await prisma.gameAction.delete({
            where: {
                id: gameAction.id
            }
        })

        await prisma.gameRound.delete({
            where: {
                id: gameRound.id
            }
        })

        return NextResponse.json({userClub, net, win})
    } catch (err) {
        console.log(err)
    }
}
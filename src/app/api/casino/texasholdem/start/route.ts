import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";
import {buildDeck, handleDeckShuffle} from "@/lib/casino";

export async function POST(req: Request){
    const session = await auth()
    const { clubData } = await req.json()
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
        const freshDeck = handleDeckShuffle(buildDeck())
        const players = [
            {
                id: 0,
                name: clubData.host.surname,
                hand: freshDeck.slice(0, 2),
                chips: 5000,
                currentBet: 0,
                folded: false,
                image: `${clubData.host.surname.toLowerCase()}_poker`,
                hasActed: false,
                isAI: false
            },
            {
                id: 1,
                name: "Someya",
                hand: freshDeck.slice(2, 4),
                chips: 5000,
                currentBet: 0,
                folded: false,
                image: "someya_poker",
                hasActed: false,
                isAI: true
            },
            {
                id: 2,
                name: "Nagumo",
                hand: freshDeck.slice(4, 6),
                chips: 5000,
                currentBet: 0,
                folded: false,
                image: "nagumo_poker",
                hasActed: false,
                isAI: true
            },
            {
                id: 3,
                name: "Tanimura the Dealer",
                hand: freshDeck.slice(6, 8),
                chips: 5000,
                currentBet: 0,
                folded: false,
                image: "tanimura_poker",
                hasActed: false,
                isAI: true
            },
        ]
        const communityCards: string[] = []
        const deck = freshDeck.slice(8)
        const stage = "PreFlop"
        const score = null
        const pot = 0

        const round = await prisma.$transaction(async (tx) => {
            let updatedClub = await tx.userClub.update({
                where: { id: userClub.id },
                data: { money: { decrement: 5000 } }
            })

            const newGame = await tx.gameRound.create({
                data: {
                    userId,
                    gameType: "TEXASHOLDEM",
                    status: "SPINNING",
                    totalBet: 5000,
                    gameData: {
                        players,
                        communityCards,
                        deck,
                        stage,
                        score,
                        pot
                    }
                }
            })

            return { updatedClub, newGame }
        })

        return NextResponse.json({
            userClub: round.updatedClub,
            players,
            deck,
            communityCards,
            stage,
            score,
            pot,
            gameId: round.newGame.id
        })
    }
    catch(err){
        console.log(err)
    }
}
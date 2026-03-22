import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";
import {wheelNumbers} from "@/lib/casino";

export async function POST(req: Request){
    const session = await auth()
    const { clubData, bets } = await req.json()
    const userId = session?.user?.id
    if (!session || !userId || !clubData) return NextResponse.json({error: "Unauthorized"}, {status: 401})
    if (!Array.isArray(bets)) return NextResponse.json({error: "Passed object is not an array!"}, {status: 403})

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    const userClub = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId: clubData.id
            }
        }
    })

    if(!userClub) return NextResponse.json({message: "No such userClub"}, {status: 404})

    try{
        const coverage = bets.reduce((sum, bet) => sum + bet, 0)
        const randomIndex = Math.floor(Math.random() * wheelNumbers.length)
        const winningNumber = wheelNumbers[randomIndex]

        const round = await prisma.$transaction(async (tx) => {
            const updatedClub = await tx.userClub.update({
                where: { id: userClub.id },
                data: { money: { decrement: coverage } }
            })

            const newGame = await tx.gameRound.create({
                data: {
                    userId,
                    gameType: "ROULETTE",
                    status: "SPINNING",
                    totalBet: coverage,
                    gameData: { bets },
                    winningNumber
                }
            })

            return { updatedClub, newGame }
        })

        return NextResponse.json({
            gameId: round.newGame.id,
            randomIndex,
            userClub: round.updatedClub
        })
    }
    catch(err){
        console.log(err)
    }
}
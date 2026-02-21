import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";
import {elements} from "@/lib/casino";

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
        const slots: number[] = []

        for(let i = 0; i < 3; i++){
            slots[i] = Math.floor(Math.random() * elements.length)
        }

        const round = await prisma.$transaction(async (tx) => {
            const updatedClub = await tx.userClub.update({
                where: { id: userClub.id },
                data: { money: { decrement: 1000 } }
            })

            const newGame = await tx.gameRound.create({
                data: {
                    userId,
                    gameType: "PACHINKO",
                    status: "SPINNING",
                    totalBet: 1000,
                    gameData: { slots }
                }
            })

            return { updatedClub, newGame }
        })

        return NextResponse.json({
            gameId: round.newGame.id,
            slots,
            userClub: round.updatedClub
        })
    }
    catch(err){
        console.log(err)
    }
}
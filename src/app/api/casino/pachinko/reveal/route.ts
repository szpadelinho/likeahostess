import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";

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
                clubId: clubData.id
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

    try{
        const data = gameRound.gameData as { slots: number[] }
        const [a, b, c] = data.slots

        let score
        let prize

        if (a === b && b === c) {
            score = "JACKPOT!!! +¥100000"
            prize = 100000
        } else if (a === b || b === c || a === c) {
            score = "Two of a kind! +¥10000"
            prize = 10000
        } else {
            score = "No luck."
            prize = 0
        }

        if(prize > 0){
            userClub = await prisma.userClub.update({
                where: {
                    id: userClub.id
                },
                data: {
                    money: {
                        increment: prize
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

        return NextResponse.json({userClub, score})
    }
    catch(err){
        console.log(err)
    }
}
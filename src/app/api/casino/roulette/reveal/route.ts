import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";
import {getBetsValidation, RouletteBet} from "@/lib/casino";

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
        const gameData = gameRound.gameData as unknown as { bets: RouletteBet[] }
        const bets = gameData.bets
        const winningNumber = gameRound.winningNumber
        if(!winningNumber) return NextResponse.json({error: "Winning number does not exist..."}, {status: 404})

        const { totalWin, totalLoss } = getBetsValidation(bets, winningNumber)

        const net = totalWin - totalLoss
        let win

        if (net > 0) {
            win = 2

        }
        else if (net === 0) win = 1
        else win = 0

        if(net > 0){
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

        return NextResponse.json({userClub, net, win, winningNumber})
    }
    catch(err){
        console.log(err)
    }
}
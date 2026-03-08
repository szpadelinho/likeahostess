import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../../prisma/prisma";
import {evaluateHands, TexasHoldemGameData, texasHoldEmTurn} from "@/lib/casino";

export async function POST(req: Request){
    const session = await auth()
    const { clubData, gameId, action } = await req.json()
    const userId = session?.user?.id
    if (!session || !userId || !clubData || !gameId || !action) return NextResponse.json({error: "Unauthorized"}, {status: 401})

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

    let gameRound = await prisma.gameRound.findUnique({
        where: {
            id: gameId
        }
    })

    if (!gameRound || gameRound.userId !== userId)
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })

    try {
        const gameData = gameRound.gameData as unknown as TexasHoldemGameData

        let newGameData = texasHoldEmTurn(gameData, action)

        if(newGameData.stage === "Showdown"){
            newGameData = evaluateHands(newGameData)

            if(newGameData.score?.includes(clubData.host.surname)){
                await prisma.userClub.update({
                    where: {
                        userId_clubId: {
                            userId,
                            clubId: clubData.clubId
                        }
                    },
                    data: {
                        money: {
                            increment: newGameData.pot
                        }
                    }
                })
            }

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

            return NextResponse.json({gameData: newGameData, clubData})
        }

        await prisma.gameRound.update({
            where: {
                id: gameId
            },
            data: {
                gameData: JSON.parse(JSON.stringify(newGameData))
            }
        })

        return NextResponse.json({gameData: newGameData})
    } catch (err) {
        console.log(err)
    }
}
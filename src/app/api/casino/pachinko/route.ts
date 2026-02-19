import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    const { clubData, bet, game } = await req.json()
    const userId = session?.user?.id
    if (!session || !userId || !clubData || !game) return NextResponse.json({error: "Unauthorized"}, {status: 401})

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
        const sum = Array(2)

        for (let i = 0; i < 2; i++) {
            sum[i] = Math.floor(Math.random() * 6) + 1
        }

        const total = sum.reduce((a, b) => a + b, 0)
        const isWin = total % 2 === 0
            ? game === "Even"
            : game === "Odd"

        if(isWin){
            userClub = await prisma.userClub.update({
                where: {
                    userId_clubId: {
                        userId,
                        clubId: clubData.clubId
                    }
                },
                data: {
                    money: {
                        increment: bet * 2
                    }
                }
            })
        }

        await prisma.gameAction.delete({
            where: {
                userId: session.user.id,
                id: gameAction.id
            }
        })

        return NextResponse.json({clubData: userClub, array: sum, prize: isWin ? (bet * 2) : -bet })
    }
    catch(err){
        console.log(err)
    }
}
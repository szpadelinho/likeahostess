import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401})

    const { clubData, amount } = await req.json()
    if(clubData === undefined || amount !== "number") return NextResponse.json({message: "Incorrect credentials"}, {status: 400})

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    try{
        const existing = await prisma.loan.findFirst({
            where: {
                userClubId: clubData.id
            }
        })

        if(existing){
            const club = await prisma.userClub.update({
                where: {
                    userId_clubId: {
                        userId: session.user.id,
                        clubId: clubData.id
                    }
                },
                data: {
                    money: {
                        decrement: existing.amount * existing.interest
                    }
                }
            })

            await prisma.loan.delete({
                where: {
                    id: existing.id
                }
            })

            return NextResponse.json({clubData: club})
        }
        else{
            const club = await prisma.userClub.update({
                where: {
                    userId_clubId: {
                        userId: session.user.id,
                        clubId: clubData.id
                    }
                },
                data: {
                    money: {
                        increment: amount
                    }
                }
            })

            const now = new Date()
            const dueAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

            await prisma.loan.create({
                data: {
                    userClubId: clubData.id,
                    amount,
                    interest: 1.2,
                    createdAt: now,
                    dueAt,
                    paid: false
                }
            })

            if(club) {
                await prisma.gameAction.delete({
                    where: {
                        userId: session.user.id,
                        id: gameAction.id
                    }
                })
            }

            return NextResponse.json({clubData: club})
        }
    }
    catch(err){
        console.error(err)
    }
}
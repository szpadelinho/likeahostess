import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";
import {calculateAmount, calculateInterest} from "@/app/types";

export async function GET(req: Request) {
    const session = await auth()
    const { searchParams } = new URL(req.url)
    const clubId = searchParams.get("clubId")
    const userId = session?.user?.id
    if (!session || !userId || !clubId) return NextResponse.json({error: "Unauthorized"}, {status: 401})

    const userClub = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId
            }
        }
    })

    if(!userClub) return NextResponse.json(null)

    try {
        const loan = await prisma.loan.findFirst({
            where: {
                userClubId: userClub.id
            }
        })

        if (!loan) return NextResponse.json(null)

        const interest = calculateInterest(loan)
        const amount = calculateAmount(loan)

        return NextResponse.json({
            ...loan,
            currentInterest: interest,
            amount
        })
    } catch (err) {
        console.error("Moneylender Route.ts", err)
        return NextResponse.json({error: "Cannot fetch loans"}, {status: 500})
    }
}

export async function POST(req: Request){
    const session = await auth()
    if(!session?.user.id) return NextResponse.json({message: "Unauthorized"}, {status: 401})

    const { clubData, amount } = await req.json()
    if(clubData === undefined) return NextResponse.json({message: "Incorrect credentials"}, {status: 400})

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    const userClub = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId: session.user.id,
                clubId: clubData.id
            }
        }
    })

    if(!userClub) return NextResponse.json({message: "UserClub has not been found"}, {status: 404})

    try{
        const existing = await prisma.loan.findFirst({
            where: {
                userClubId: userClub.id
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

            return NextResponse.json({clubData: club, money: club.money})
        }
        else{
            if(typeof amount !== "number") return NextResponse.json({message: "Incorrect amount"}, {status: 400})

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
                    userClubId: userClub.id,
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

            return NextResponse.json({clubData: club, money: club.money})
        }
    }
    catch(err){
        console.error(err)
        return NextResponse.json({error: err, status: 500})
    }
}
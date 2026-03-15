import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {drinks, DRINKS_MAP} from "@/app/types";

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
        const effect = await prisma.effect.findFirst({
            where: {
                userClubId: userClub.id
            }
        })

        if (!effect) return NextResponse.json(null)

        const now = new Date()

        if (effect.expiresAt <= now) {
            await prisma.effect.delete({
                where: { id: effect.id }
            })
            return NextResponse.json(null)
        }

        return NextResponse.json(effect)
    } catch (err) {
        console.error("Effect Route.ts", err)
        return NextResponse.json({error: "Cannot fetch effects"}, {status: 500})
    }
}

export async function POST(req: Request){
    const session = await auth()
    const userId = session?.user?.id
    const { clubData, effect } = await req.json()
    const clubId = clubData?.id
    const type = effect

    if (!session || !userId) return NextResponse.json({error: "Unauthorized"}, {status: 401})

    if (!clubId || !type) {
        return NextResponse.json({ error: "Invalid values" }, { status: 400 })
    }

    const userClub = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId
            }
        }
    })

    if(!userClub) return NextResponse.json({error: "No such userClub found"}, {status: 404})

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    try{
        const existingEffect = await prisma.effect.findFirst({
            where: {
                userClubId: userClub.id
            }
        })

        if (existingEffect) {
            return NextResponse.json(
                { error: "You already have an effect" },
                { status: 409 }
            )
        }

        const now = new Date()
        const expiresAt = new Date(now.getTime() + 60 * 60 * 1000)

        const effect = await prisma.effect.create({
            data: {
                userClubId: userClub.id,
                type,
                createdAt: now,
                expiresAt,
            }
        })

        const selectedDrink = drinks.find(d => DRINKS_MAP[d.id as keyof typeof DRINKS_MAP] === type)

        if (!selectedDrink) {
            console.error("Nie znaleziono drinku dla typu:", type)
            return NextResponse.json({ error: "Invalid effect type" }, { status: 400 })
        }

        const price = selectedDrink.price

        const club = await prisma.userClub.update({
            where: {
                id: userClub.id
            },
            data: {
                money: {
                    decrement: price
                }
            }
        })

        if(effect) {
            await prisma.gameAction.delete({
                where: {
                    userId: session.user.id,
                    id: gameAction.id
                }
            })
        }

        return NextResponse.json({
            money: club.money,
            clubData: club
        }, { status: 201 })
    }
    catch(err: any){
        return NextResponse.json({
            error: "Internal Server Error",
            message: err.message
        }, { status: 500 });
    }
}

export async function DELETE(req: Request){
    const session = await auth()
    const { clubId } = await req.json()
    const userId = session?.user?.id
    if (!session || !clubId || !userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const userClub = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId,
                clubId
            }
        }
    })

    if(!userClub) return NextResponse.json({error: "No such userClub found"}, {status: 404})

    const gameAction = await prisma.gameAction.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if(!gameAction) return NextResponse.json({message: "Illegal transaction"}, {status: 403})

    try {
        const effect = await prisma.effect.deleteMany({
            where: {
                userClubId: userClub.id,
            }
        })

        if(effect) {
            await prisma.gameAction.delete({
                where: {
                    userId: session.user.id,
                    id: gameAction.id
                }
            })
        }

        return NextResponse.json({deleted: true})
    } catch (err) {
        console.error("Effect Route.ts", err)
        return NextResponse.json({error: "Cannot delete effect"}, {status: 500})
    }
}
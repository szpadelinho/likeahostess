import {prisma} from "../../../../prisma/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";

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

        return NextResponse.json(effect)
    } catch (err) {
        console.error("Effect Route.ts", err)
        return NextResponse.json({error: "Cannot fetch effects"}, {status: 500})
    }
}

export async function POST(req: Request){
    const session = await auth()
    const userId = session?.user?.id
    const { type, clubId } = await req.json()

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

    try{
        const existingEffect = await prisma.effect.findFirst({
            where: {
                userClubId: userClub.id,
                active: true
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

        return NextResponse.json(effect, { status: 201 })
    }
    catch(err){
        console.error("Effect POST error:", err)
        return NextResponse.json(
            { error: "Cannot create effect" },
            { status: 500 }
        )
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

    try {
        const loan = await prisma.effect.deleteMany({
            where: {
                userClubId: userClub.id,
            }
        })
        return NextResponse.json(loan)
    } catch (err) {
        console.error("Effect Route.ts", err)
        return NextResponse.json({error: "Cannot delete effect"}, {status: 500})
    }
}
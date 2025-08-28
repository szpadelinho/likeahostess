import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";
import {prisma} from "../../../../prisma/prisma";

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const {searchParams} = new URL(req.url)
    const clubId = searchParams.get("clubId")

    if (!clubId) {
        return NextResponse.json({error: "No clubId provided/found"}, {status: 400})
    }

    const user = await prisma.user.findUnique({
        where: {email: session.user.email}
    })

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404})
    }

    let club = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId: user.id,
                clubId,
            }
        }
    })

    if (!club) {
        club = await prisma.userClub.create({
            data: {
                userId: user.id,
                clubId,
                money: 100000,
                popularity: 100
            }
        })
    }

    return NextResponse.json(club)
}

export async function GET(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const {searchParams} = new URL(req.url)
    const clubId = searchParams.get("clubId")

    if (!clubId) {
        return NextResponse.json({error: "No clubId provided/found"}, {status: 400})
    }

    const user = await prisma.user.findUnique({
        where: {email: session.user.email}
    })

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404})
    }

    const club = await prisma.userClub.findUnique({
        where: {
            userId_clubId: {
                userId: user.id,
                clubId,
            }
        }
    })

    if (!club) {
        return NextResponse.json({error: "UserClub not found"}, {status: 404})
    }

    return NextResponse.json({
        money: club.money,
        popularity: club.popularity
    })
}
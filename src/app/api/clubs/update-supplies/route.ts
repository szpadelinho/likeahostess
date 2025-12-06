import { NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { userId, clubId, amount } = await req.json()

    if (!userId || !clubId || typeof amount !== "number") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    try {
        const club = await prisma.userClub.update({
            where: { userId_clubId: { userId, clubId } },
            data: { supplies: { increment: amount } },
        })

        return NextResponse.json({ supplies: club.supplies })
    } catch (error) {
        console.error("Failed to update club supplies:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
import { NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await auth()
    const userId = session?.user?.id

    if (!session || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { amount } = await req.json()

    if (typeof amount !== "number") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    try {
        const hostesses = await prisma.userHostess.findMany({
            where: { userId },
            select: { hostessId: true, fatigue: true },
        })

        await prisma.$transaction(
            hostesses.map(h => prisma.userHostess.update({
                where: {
                    userId_hostessId: {
                        userId,
                        hostessId: h.hostessId,
                    },
                },
                data: {
                    fatigue: Math.min(
                        100,
                        Math.max(h.fatigue - amount, 0)
                    ),
                },
            }))
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to update club money:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
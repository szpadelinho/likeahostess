import { NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { hostessId, amount } = await req.json()

    if(hostessId === null || amount === null){
        return NextResponse.json({ error: "Input is empty" }, { status: 403 })
    }

    if (typeof amount !== "number") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    try {
        await prisma.userHostess.update({
            where: {
                userId_hostessId: {
                    userId: session.user.id,
                    hostessId: hostessId
                }
            },
            data: {
                fatigue: {
                    decrement: amount
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(`Failed to update hostess #${hostessId} fatigue:`, error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
import { NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { amount } = await req.json()

    if (typeof amount !== "number") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    try {
        await prisma.userHostess.updateMany({
            where: {
                userId: session?.user?.id
            },
            data: {
                fatigue: {
                    decrement: amount
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to update club money:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
import { NextResponse } from "next/server"
import { prisma } from "../../../../../prisma/prisma"
import { auth } from "@/lib/auth"
import {applyEffect, getEffect} from "@/lib/effects";

export async function POST(req: Request) {
    const session = await auth()
    const userId = session?.user?.id
    if (!session || !userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { clubId, amount } = await req.json()

    if (!clubId || typeof amount !== "number") {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const effect = await getEffect(userId, clubId)

    const finalAmount = applyEffect(amount, effect)

    try {
        const club = await prisma.userClub.update({
            where: { userId_clubId: { userId, clubId } },
            data: { money: { increment: finalAmount } },
        })

        return NextResponse.json({ money: club.money })
    } catch (error) {
        console.error("Failed to update club money:", error)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}